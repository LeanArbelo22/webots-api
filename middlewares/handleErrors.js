const handleError = (error, req, res, next) => {
  console.log(`Error: ${error.code}`);
  console.error(error.name);
  console.log(error.message);

  // if error.name === ... do...

  if(error.code === 11000) {
    res.json({ error: 'Duplicate entry of an existing value' });
  }

  res.status(400).end();
};

module.exports = handleError;