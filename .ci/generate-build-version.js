const version = process.env.npm_package_version;
const ref = process.env.GITHUB_BASE_REF || process.env.GITHUB_REF || 'refs/heads/develop';
const runNumber = process.env.GITHUB_RUN_NUMBER || 0;

const branch = ref.replace(/^refs\/(heads\/)?/, '').replace('/', '.');

const build = `${version}-${branch}+${String(runNumber).padStart(4, '0')}`;

console.log(build);
