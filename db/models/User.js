const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  name: String,
  number: String,
  date: String,
  isAdmin: Boolean
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const User = model('User', userSchema);

module.exports = User;

/* 

const user = new User({
  name: 'Leandro Arbelo',
  number: '+549 3515912166',
  date: new Date(),
  media: false
});

User.find({}).then(result => {
  console.log(result);
  mongoose.connection.close();
});

user
  .save()
  .then(result => {
    console.log('Admin user created\n', result);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));

*/
