import babel from '@rollup/plugin-babel';

const config = {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'umd',
    name: 'FakeWebSocket'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-private-methods']
    })
  ]
};

export default config