import { defineConfig, loadEnv } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	const includeMobilePreview = env.VITE_INCLUDE_MOBILE_PREVIEW === 'true';
	const basePath = (env.VITE_BASE_PATH || '/').replace(/\/?$/, '/');
	const input = {
		main: path.resolve(process.cwd(), 'index.html'),
		...(includeMobilePreview
			? {
					mobilePreview: path.resolve(process.cwd(), 'mobile-preview.html'),
				}
			: {}),
	};

	return {
		base: basePath,
		plugins: [tsconfigPaths(), react(), eslintPlugin()],
		resolve: {
			alias: {
				'@': path.resolve('./src'),
			},
		},
		build: {
			// Set to {} to enable a watched build workflow, null to disable (default).
			watch: env.VITE_WATCH ? {} : null,
			rollupOptions: {
				input,
			},
		},
		test: {
			environment: 'jsdom', // Required for DOM-based tests
			globals: true, // So we can use describe/it/expect directly
			setupFiles: './src/setupTests.ts',
			exclude: [...configDefaults.exclude],
			coverage: {
				provider: 'v8',
				reporter: ['text', 'html'],
			},
		},
	};
});
