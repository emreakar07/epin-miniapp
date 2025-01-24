const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utilities')
    },
    configure: {
      resolve: {
        fallback: {
          "buffer": require.resolve("buffer/"),
          "stream": require.resolve("stream-browserify")
        }
      }
    }
  }
};