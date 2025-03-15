import { defineConfig } from 'tsup';

export default defineConfig({
  target: 'es2020',
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
  outDir: 'lib',
  minify: true,
  esbuildOptions(options) {
    options.loader = {
      '.html': 'copy', 
    };
    options.assetNames = '[name]'; 
  },
});
