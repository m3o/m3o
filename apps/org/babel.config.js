module.exports = {
  presets: ['@babel/preset-env', 'next/babel'],
  plugins: [
    '@babel/plugin-transform-runtime',
    // Below is for storybook
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
  ],
}
