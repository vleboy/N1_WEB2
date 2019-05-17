module.exports = {
  productionSourceMap: false,

  pwa: {
    name: 'NA代理',
    themeColor: '#FFFFFF',
    msTileColor: '#FFFFFF',
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: new RegExp('^https://testagent.cncshe.com/'),
        handler: 'staleWhileRevalidate',
        options: {
          cacheName: 'api-cache',
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      }, {
        urlPattern: new RegExp('^https://n1agent.na12345.com/'),
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