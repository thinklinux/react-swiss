const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV != undefined && BABEL_ENV !== 'cjs';

const plugins = [
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-class-properties'
];

module.exports = () => ({
  presets: [
    [
      '@babel/env',
      {
        modules: building ? false : 'commonjs'
      }
    ],
    '@babel/react'
  ],
  plugins: plugins
});
