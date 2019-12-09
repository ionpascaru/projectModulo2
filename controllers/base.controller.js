const createError = require('http-errors');
const mongoose = require('mongoose');

const User = require('../models/user.model')
const Complain = require('../models/complain.model')
//const Comment = require('../models/comment.model')

//vista complains
module.exports.complainsIndex = (req, res, next) => {
  Complain.find({ type: 'Queja' })
  .populate('user')
  .sort({ createdAt: -1 })
  .limit(10)
  .then(complains => {
    res.render('quejas', { complains })
  }).catch(next)
}

//vista suggestions
module.exports.suggestionsIndex = (req, res, next) => {
  Complain.find({ type: 'Sugerencia' })
  .sort({ createdAt: -1 })
  .limit(10)
  .populate('user')
  .then(complains => {
    res.render('sugerencias', { complains })
  }).catch(next)
}

//funcion buscador
module.exports.results = (req, res, next) => {
  const criteria = req.query.search
  ? {
    body: new RegExp(req.query.search, "i")
  }
  : {}

  Complain.find(criteria)
  .sort({ createdAt: -1 })
  .limit(10)
  .populate('user')
    .then(complains => {
      res.render('results', { complains: complains })
    }).catch(next)
};
