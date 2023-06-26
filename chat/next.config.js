module.exports = {
  env: {},

  async redirects() {
    return [
      {
        source: '/groups',
        destination: '/',
        permanent: false,
      },
    ]
  },
}
