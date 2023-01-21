const ip = require('ip');

const requestsLogger = (req, res, next) => {
  const ipAddress = ip.address(); // ? full ip
  if (req.path === '/favicon.ico') return;
  console.log('\n-- New request --');
  console.log('Method: ' + req.method);
  console.log('Path: ' + req.path);
  console.log('IP: ' + ipAddress);
  console.log('-----------------\n');
  next();
};

const postLogger = (req, res, next) => {
  if (req.method === 'POST') {
    console.log('Body:');
    console.log(req.body);
    console.log('\n');
  }
  next();
};

const notFoundLogger = (req, res) => {
  res.status(404).json({ error: 'Not found' }).end();
  console.log('HTTP Status 404\n');
};

module.exports = {
  requestsLogger,
  postLogger,
  notFoundLogger
};

// ? const ipAddress = req.socket.remoteAddress; loopback ::1 (ipv4) 127.0.0.1 (ipv6)
// ? const ipAddress = req.ip loopback
