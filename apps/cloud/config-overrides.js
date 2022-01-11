module.exports = function override(config, env) {
  config.resolve.fallback = {
    url: require.resolve('url/')
  }

  return config
}
