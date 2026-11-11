import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: ['src/**/*.ts'],
	// Mirror src in dist, so every file is importable at its own path.
	unbundle: true,
	format: ['esm', 'cjs'],
	dts: true,
	clean: true,
	sourcemap: true,
	target: 'es2022',
	platform: 'node',
	// Emit .js/.cjs like a "type": "module" package expects, not .mjs.
	fixedExtension: false,
	treeshake: true,
	// Keep `exports.default` in every CJS file, as the previous tsc build did.
	outputOptions: { exports: 'named' },
});
