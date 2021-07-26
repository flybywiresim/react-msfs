import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

import packageJson from './package.json';

export default {
    input: 'src/index.ts',
    output: [
        { dir: 'dist/' },
        {
            file: packageJson.main,
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: packageJson.module,
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        resolve(),
        json(),
        commonjs(),
        typescript(),
    ],
};
