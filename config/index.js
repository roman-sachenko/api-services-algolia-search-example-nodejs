module.exports = {
  env: {
    name: process.env.ENV_NAME,
  },
  searchEngine: {
    appId: process.env.ALGOLIA_APP_ID,
    apiKey: process.env.ALGOLIA_API_KEY,
  }
};