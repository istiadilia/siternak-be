const httpServer = require('./app');
const port = process.env.PORT || 8080;

httpServer.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});

module.exports = httpServer;