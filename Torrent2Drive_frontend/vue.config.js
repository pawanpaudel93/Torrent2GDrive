module.exports = {
  devServer: {
    publicPath: '/',
    proxy: "http://localhost:3000",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    },
  },
  "transpileDependencies": [
    "vuetify"
  ]
}