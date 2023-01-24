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

const notFound = require('./middlewares/notFound');
const handleError = require('./middlewares/handleErrors');
const { requestsLogger, postLogger } = require('./middlewares/loggers');
const User = require('./db/models/User');

const PORT = process.env.PORT || 3002;

app.use(requestsLogger);
app.use(postLogger);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the We, Bots! API' });
});

app.get('/users', (req, res) => {
  User.find({})
    .then(result => {
      if (!result) res.json({});
      res.json(result);
    })
    .catch(err => console.log(err));
});

app.get('/users/:id', (req, res, next) => {
  const { id } = req.params;
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
      next(err);
      res.status(400).end();
    });
});

app.delete('/users/:id', (req, res, next) => {
  const { id } = req.params;
  User.findByIdAndDelete(id)
    .then(result => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

app.delete('/users', (req, res, next) => {
  User.find({})
    .deleteMany()
    .then(result =>
      res.json({
        message: `All users deleted, deleted count: ${result.deletedCount}`
      })
    );
});

app.put('/users/:id', (req, res, next) => {
  const { id } = req.params;
  const {
    body: { name, number, isAdmin }
  } = req;

  const modified = {
    name,
    number,
    isAdmin
  };

  User.findByIdAndUpdate(id, modified, { new: true })
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      next(err);
    });
});

app.post('/users', (req, res, next) => {
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

  item
    .save()
    .then(saved => {
      res.status(201).json(saved);
      console.log(`Item saved: ${saved}`);
    })
    .catch(err => next(err));
});

// error 404 middleware
app.use(notFound);
// error
app.use(handleError);

console.log('Welcome to We, Bots!');
app.listen(PORT, () => console.log(`App running on port: ${PORT}`));
