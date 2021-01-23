const express = require('express');

require('dotenv').config();

console.log(process.env.NODE_ENV);

const cors = require('cors');

const app = express();
app.use(cors());
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(bodyParser.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
      .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required()
      .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')),
  }),
}), login);

app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.use(errorLogger);

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  if (err.kind === 'ObjectId') {
    res
      .status(400)
      .send({
      // проверяем статус и выставляем сообщение в зависимости от него
        message: 'Неверно переданы данные',
      });
  } else {
    res
      .status(statusCode)
      .send({
      // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`App is on port ${PORT}`);
});
