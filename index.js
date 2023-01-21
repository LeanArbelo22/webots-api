require('dotenv').config();
require('./db/dbConfig');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json()); // body-parser middleware

const corsOptions = {
  origin: ['http://localhost:3000/', 'https://we.bots.com']
};

app.use(cors(corsOptions));

const {
  requestsLogger,
  postLogger,
  notFoundLogger
} = require('./middlewares/allRequests');
const User = require('./db/models/User');

const PORT = process.env.PORT || 3002;

app.use(requestsLogger);
app.use(postLogger);

app.get('/', (req, res) => {
  try {
    res.send('<h1>We, Bots!</h1>');
  } catch (error) {
    throw new Error(`Error while trying to get path "/": ${error}`);
  }
});

app.get('/users', (req, res) => {
  try {
    User.find({})
      .then(result => {
        if (!result) res.json({});
        res.json(result);
      })
      .catch(err => console.log(err));
  } catch (error) {
    throw new Error(`Error while trying to get path "/users": ${error}`);
  }
});

app.get('/users/:id', (req, res) => {
  const { id } = req.params;

  try {
    User.findById(id)
      .then(result => {
        if (!result) {
          res.status(400);
          res
            .send({
              status: 'No Content',
              data: 'The requested id is not valid/not exists'
            })
            .end();
        }
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(400).end();
      });
  } catch (err) {
    throw new Error(`Error while trying to get path "/users/${id}": ${err}`);
  }
});

app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  User.findByIdAndDelete(id);

  res.status(204).end();
});

app.post('/items', (req, res) => {
  const { body: newItem } = req;

  if (!newItem || !newItem.name || !newItem.number)
    return res.status(400).json({ error: 'Something is missing' });

  const item = new User({
    name: newItem.name,
    number: newItem.number,
    date: new Date().toLocaleString('es-AR', {
      timeZone: 'America/Buenos_Aires'
    }),
    isAdmin: newItem.isAdmin || false
  });

  item.save().then(saved => {
    res.status(201).json(saved);
    console.log(`Item saved: ${saved}`);
  });
});

// error 404 middleware
app.use(notFoundLogger);

console.log('Welcome to We, Bots!');
app.listen(PORT, () => console.log(`App running on port: ${PORT}`));

//
/* 
app.post('/items', (req, res) => {
  const { body: newItem } = req;

  if (!newItem || !newItem.name)
    return res.status(400).json({ error: 'Something is missing' });

  const ids = data.map(item => item.id);
  const maxId = Math.max(...ids);
  const item = {
    id: maxId + 1,
    name: newItem.name,
    date: new Date().toLocaleString('es-AR', {
      timeZone: 'America/Buenos_Aires'
    })
  };

  data = [...data, item]; // data.concat(newItem)
  res.status(201).json(item);
});
*/
