import { existsSync } from 'fs';

import chalk from 'chalk';
import simpleGit, { DiffResult } from 'simple-git';

enum EXIT_CODE {
	OK = 0,
	// 1~14 are reserved https://nodejs.org/api/process.html#process_exit_codes
	UNCAUGHT_EXCEPTION = 1,
	INVALID_ARGUMENTS = 9,

	// 15~19 are reserved for CI
	NO_TARGET_FILE = 15,
	OUT_OF_RULES_BRANCH_NAME = 16,
}

const log = {
	process: (...text: unknown[]) => {
		console.log(chalk.hex('239, 41, 41')(...text));
	},
	basic: (...text: unknown[]) => {
		console.log(chalk.whiteBright(...text));
	},
	complete: (...text: unknown[]) => {
		console.log(chalk.greenBright(...text));
	},
	warn: (...text: unknown[]) => {
		console.log(chalk.yellowBright(...text));
	},
	error: (...text: unknown[]) => {
		console.log(chalk.redBright(...text));
	},
};

const swallow = (_err: Error) => {
	return null;
};

async function printHasTargetFile() {
	console.log(''); // empty line

	const targetFilename = process.argv[2];
	if (!targetFilename || typeof targetFilename !== 'string') {
		log.warn(
			`Invalid argument. Please pass the ${chalk.bold('file name you want to target')} as the ${chalk.bold(
				'first'
			)} argument.`
		);
		process.exit(EXIT_CODE.INVALID_ARGUMENTS);
	}

	const git = simpleGit();

	const branchResults = await Promise.all([
		git.raw('rev-parse', '--abbrev-ref', 'HEAD').catch(swallow),
		git.raw('rev-parse', '--abbrev-ref', 'HEAD@{upstream}').catch(swallow),
		git.raw('rev-parse', '--abbrev-ref', 'HEAD@{origin}').catch(swallow),
	]);

	const isRepo = await git.checkIsRepo((err, data) => {
		if (err) {
			log.warn('Error occurred while checking if the current directory is a git repository.');
			log.error(err);
			process.exit(EXIT_CODE.UNCAUGHT_EXCEPTION);
		} else if (!data) {
			log.warn('The current directory is not a git repository.');
			process.exit(EXIT_CODE.UNCAUGHT_EXCEPTION);
		}
	});
	if (!isRepo) process.exit(EXIT_CODE.UNCAUGHT_EXCEPTION);

	const replaceBranchResults = branchResults.map((branch) => branch?.replace('\n', ''));
	const [currentBranch, upstreamBranch, originBranch] = replaceBranchResults;
	const remoteBranch = upstreamBranch || originBranch;

	log.process(`The current branch tracks the remote branch ${chalk.bold(remoteBranch)}.`);
	log.process(`Getting list of changed files in the ${chalk.bold(currentBranch)} branch...`);

	const commitLogResult = await git.log({ from: currentBranch, to: remoteBranch });
	const isFirstCommit = commitLogResult.total === 0;
	let changedFiles: DiffResult;

	if (isFirstCommit) {
		// if first commit is not exist, get only staged files
		changedFiles = await git.diffSummary(['--staged', '--name-only']);
	} else {
		const firstCommitHash = commitLogResult.all[commitLogResult.all.length - 1].hash;
		changedFiles = await git.diffSummary([firstCommitHash, '--staged', '--name-only']);
	}

	log.process(`Checking if any of the changed files are '${chalk.bold(targetFilename)}'...`);
	const filteredFiles = changedFiles.files
		// Filter out deleted files and binary files (images, audio, etc.) that don't need to be checked for target file name
		.filter((i) => !i.binary && existsSync(i.file))
		// Filter out files that don't have the target file name
		.filter((i) => i.file.endsWith(targetFilename));

	const hasTargetFile = filteredFiles.length > 0;

	console.log(''); // empty line
	if (hasTargetFile) {
		log.complete(`✔ Found ${chalk.bold(filteredFiles.length)} file(s) with the name '${chalk.bold(targetFilename)}'`);
		log.complete(`✔ ${chalk.bold(targetFilename)} file found in the following file(s):`);
		filteredFiles.forEach((i) => {
			log.complete(`- ${i.file}`);
		});
	} else {
		log.complete(`✔ Did not find '${chalk.bold(targetFilename)}' in the list of changed files.`);
	}

	process.exit(EXIT_CODE.OK);
}

printHasTargetFile().catch((error) => {
	log.error(error);
	process.exit(EXIT_CODE.UNCAUGHT_EXCEPTION);
});
