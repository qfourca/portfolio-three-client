import path from 'path';

import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const isProd = mode === 'production';
	const env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	const publicPath = '/';

	const browserList = isProd
		? ['> 0.5%', '> 0.5% in KR', 'last 3 versions', 'Firefox ESR', 'not dead']
		: ['last 3 versions', '> 0.5%', 'ie >= 11'];

	const outDir = path.resolve(__dirname, 'dist');

	return {
		base: publicPath,
		define: {
			'process.env': { ...env },
		},
		server: {
			port: 3000,
			open: true,
			cors: true,
			strictPort: true,
			hmr: {
				overlay: true,
			},
		},
		plugins: [macrosPlugin(), react(), svgr()],
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
			alias: [{ find: '@', replacement: path.resolve(__dirname, 'packages/src') }],
		},
		css: {
			modules: {
				localsConvention: 'camelCase',
				generateScopedName: isProd ? '[hash:base64:5]' : '[name]__[local]___[hash:base64:5]',
			},
			preprocessorOptions: {
				less: {
					javascriptEnabled: true,
				},
			},
		},
		optimizeDeps: {
			include: ['styled-components/macro'],
		},
		build: {
			cssTarget: 'chrome82',
			cssCodeSplit: true,
			assetsInlineLimit: 4096,
			outDir,
			emptyOutDir: true,
			minify: true,
			target: browserslistToEsbuild(browserList),
			sourcemap: true,
			rollupOptions: {
				output: {
					manualChunks: {
						framework: ['react', 'react-dom', 'styled-components', 'styled-components/macro'],
						three: ['three'],
					},
					entryFileNames: '[name].[hash].js',
					chunkFileNames: '[name].[hash].js',
					assetFileNames: '[name].[hash].[ext]',
				},
				input: {
					columbus: path.resolve(__dirname, './columbus.html'),
				},
			},
		},
	};
});
