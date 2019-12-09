const mongoose = require('mongoose');

const User = require('../models/user.model')
const Complain = require('../models/complain.model')
//const Comment = require('../models/comment.model')
const categories = require('../constants/categories')
const types = require('../constants/types')

//index - short preview of complains
module.exports.index = (req, res, next) => {
  //buscador
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
      res.render('index', { complains })
    }).catch(next)
}

//nueva queja
module.exports.create = (req, res, next) => {
  res.render('quejas/create', { complains: new Complain(), categories, types })
}

module.exports.doCreate = (req, res, next) => {
  const newComplain = new Complain(req.body)
  // const newComplain = new Complain({
  //   //user: req.complain._id,
  //   // type: req.body.type,
  //   // subject: req.body.subject,
  //   // title: req.body.title,
  //   // body: req.body.body,
  //   // image: req.body.image
  //   //image: req.file ? req.file.url : undefined
  // })

  newComplain.save()
    .then(() => {
      res.redirect('/')
    }).catch(error => { next(error); })
}

//detalle queja o sugerencia
module.exports.detailComplain = (req, res, next) => {
  Complain.findOne({ _id: req.params.id })
  .populate('user')
  .then(complain => {
    if(complain){
      res.render('quejas/detalle', { complain })
    } else {
      next(createError(404, 'Student not found'));
    }
  }).catch(error => { next(error); })
}

//profile
module.exports.profile = (req, res, next) => {
  User.findOne({ username: req.params.username })
  .populate({
    path: 'complains',
    populate: {
      path: 'user'
    }
  })

  .then(user => {
    if (user) {
      res.render('users/profile', { user, complains: user.complains })
    } else {
      // req.session.genericError = 'user not found'
      res.redirect('/')
    }
  })
  .catch(next)
}