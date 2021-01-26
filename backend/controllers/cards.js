const Card = require('../models/card');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadReqError = require('../errors/bad-req-error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadReqError(err.message);
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      if (card.owner.toString() !== id) {
        throw new BadReqError('Не ты владелец карточки с таким id');
      } else {
        Card.findByIdAndDelete(req.params.cardId)
        // eslint-disable-next-line no-shadow
          .then((card) => {
            res.status(200).send(card);
          })
          .catch(next);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      Card.findByIdAndUpdate({ _id: req.params.cardID }, { $push: { likes: user } }, { new: true })
        .then((card) => {
          console.log(card);
          res.status(200).send(card);
        })
        .catch(next);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      Card.findByIdAndUpdate({ _id: req.params.cardID }, { $pull: { likes: user._id } }, { new: true })
        .then((card) => {
          res.status(200).send(card);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
