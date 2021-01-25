const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string()
        .pattern(new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')),
    }),
  }), createCard);
router.delete('/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex().min(24)
        .max(24),
    }),
  }), deleteCard);

module.exports = router;
