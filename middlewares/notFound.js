const notFound = (req, res) => {
  res.status(404).json({ error: 'Not found' }).end();
  console.log('HTTP Status 404\n');
};

module.exports = notFound;
