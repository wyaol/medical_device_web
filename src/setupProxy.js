const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  // app.use(
  //   '/socket.io',
  //   createProxyMiddleware({
  //     target: 'ws://localhost:8765',
  //     changeOrigin: true,
  //     ws: true,
  //   })
  // );
  //
  // app.use(
  //   '/ws',
  //   createProxyMiddleware({
  //     target: 'ws://localhost:8765',
  //     changeOrigin: true,
  //     ws: true,
  //   })
  // );

  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${process.env.REACT_APP_MEDICAL_DEVICE_SERVICE_HOST}:${process.env.REACT_APP_MEDICAL_DEVICE_SERVICE_PORT}`,
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': '', // 去掉 /api 前缀
      // },
    })
  );
};
