const mongoose = require('mongoose');

const connectionString = process.env.MONGO_DB_URI;

mongoose.set('strictQuery', false);

mongoose
  .connect(connectionString)
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err));