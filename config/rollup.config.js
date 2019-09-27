import vue from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'
import {name, dependencies} from '../package.json'
import pascalcase from 'pascalcase'
import {terser} from 'rollup-plugin-terser'
import alias from 'rollup-plugin-alias'
const globals = {
  vue: 'Vue',
  lodash: '_',
  cookie: 'Cookie',
}


export default [
  // ESM build to be used with webpack/rollup.
  {
    input: 'src/index.ts',
    output: [
      {
        exports: 'named',
        file: 'dist/bundle.umd.js',
        format: 'umd',
        globals,
        name: pascalcase(name),
      },
      {
        file: 'dist/bundle.esm.js',
        format: 'esm',
      },
      {
        exports: 'named',
        file: 'dist/bundle.min.js',
        format: 'iife',
        globals,
        name: pascalcase(name),
      },
      {
        exports: 'named',
        file: 'dist/bundle.js',
        format: 'iife',
        globals,
        name: pascalcase(name),
      },
    ],
    external: Object.keys(dependencies),
    plugins: [
      alias({
        //optional, by default this will just look for .js files or folders
        resolve: ['.jsx', '.js', '.tsx', '.ts', '.vue'],
        entries:[
          //the initial example
          {find:/^@\//, replacement: process.cwd() + '/src/'},
        ],
      }),
      typescript({
        tsconfig: false,
        experimentalDecorators: true,
        module: 'es2015',
      }),
      commonjs(),
      vue(),
      terser({
        include: [/^.+\.min\.js$/],
      }),
    ],
  },
  // SSR build.
  {
    input: 'src/index.ts',
    output: {
      exports: 'named',
      format: 'cjs',
      file: 'dist/bundle.node.js',
    },
    external: Object.keys(dependencies),
    plugins: [
      alias({
        //optional, by default this will just look for .js files or folders
        resolve: ['.jsx', '.js', '.tsx', '.ts', '.vue'],
        entries:[
          //the initial example
          {find:/^@\//, replacement: process.cwd() + '/src/'},
        ],
      }),
      typescript({
        tsconfig: false,
        experimentalDecorators: true,
        module: 'es2015',
      }),
      commonjs(),
      vue({template: {optimizeSSR: true}}),
    ],
  },
]
