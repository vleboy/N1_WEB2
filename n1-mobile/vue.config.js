module.exports = {
  productionSourceMap: false,

  pwa: {
    name: 'NA代理',
    msTileColor: '#1C2327',
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: new RegExp('^https://d3prd6rbitzqm3.cloudfront.net/'),
        handler: 'staleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }]
    }
  },

  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 200000,
        maxSize: 250000,
      }
    }
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: undefined,
  runtimeCompiler: undefined,
  parallel: undefined,
  css: undefined
}