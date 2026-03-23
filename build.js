import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const copyHbsPlugin = {
  name: 'copy-hbs-recursive',
  setup(build) {
    build.onEnd(() => {
      const srcDir = path.resolve(import.meta.dirname, 'src/views');
      const distDir = path.resolve(import.meta.dirname, 'dist/views');

      const copyRecursive = (src, dest) => {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, {recursive: true});
        }

        const entries = fs.readdirSync(src, {withFileTypes: true});

        for (const entry of entries) {
          const srcPath = path.join(src, entry.name);
          const destPath = path.join(dest, entry.name);

          if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
          } else if (entry.isFile() && entry.name.endsWith('.hbs')) {
            fs.copyFileSync(srcPath, destPath);
          }
        }
      };

      copyRecursive(srcDir, distDir);
    });
  }
};

const copyCssPlugin = {
  name: 'copy-css',
  setup(build) {
    build.onEnd(() => {
      const srcDir = path.resolve(import.meta.dirname, 'src/styles');
      const distDir = path.resolve(import.meta.dirname, 'dist/styles');

      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, {recursive: true});
      };

      const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.css'));
      for (const file of files) {
        fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
      }
    });
  }
};

const copyScriptsPlugin = {
  name: 'copy-scripts',
  setup(build) {
    build.onEnd(() => {
      const dirPairs = [['src/scripts', 'dist/scripts'],
        ['src/scripts/actions', 'dist/scripts/actions'],
        ['src/scripts/constants', 'dist/scripts/constants'],
        ['src/scripts/interfaces', 'dist/scripts/interfaces']
      ];

      dirPairs.forEach(dirPair => {
        const srcDir = path.resolve(import.meta.dirname, dirPair[0]);
        const distDir = path.resolve(import.meta.dirname, dirPair[1]);

        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, {recursive: true});
        };

        const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.mjs'));
        for (const file of files) {
          fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
        }
      });

    });
  }
};

// banner: { js: 'import {createRequire as topLevelCreateRequire} from "module";\nconst require = topLevelCreateRequire(import.meta.url); }' // Not working
esbuild.build({
  entryPoints: ['src/**/*.js'],
  platform: 'node', // when commented builds for browser?
  format: 'esm',
  bundle: false,
  outdir: 'dist',
  metafile: false,
  sourcemap: true,
  minify: false,
  plugins: [copyHbsPlugin, copyCssPlugin, copyScriptsPlugin],
});