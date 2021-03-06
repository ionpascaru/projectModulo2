require('../config/db.config')

const User = require('../models/user.model')
const Complain = require('../models/complain.model')
const Comment = require('../models/comment.model')
const faker = require('faker')

const categories = require('../constants/categories');
const types = require('../constants/types');

const userIds = []

Promise.all([
  User.deleteMany(),
  Complain.deleteMany(),
  Comment.deleteMany()
])
  .then(() => {
    for (let i = 0; i < 20; i++) {

      //creamos el usuario
      const user = new User({
        name: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        bio: faker.lorem.sentence(),
        city: 'Madrid',
        password: '123123',
        avatar: faker.image.avatar(),
        validated: true,
        createdAt: faker.date.past() 
      })
      user.save()
        
        .then(user => {
          userIds.push(user._id)

          for (let j = 0; j < 20; j++) {
            //creamos las quejas
            const complain = new Complain({
              user: user._id,
              title: faker.lorem.words(),
              type: types[Math.floor(Math.random() * types.length)],
              subject: categories[Math.floor(Math.random() * categories.length)],
              body: faker.lorem.text(),
              hashtags: '#transporte',
              images: faker.random.image(),
              createdAt: faker.date.past()
            })
            complain.save()

              .then(complain => {
                for (let k = 0; k < 20; k++) {
                  const comment = new Comment({
                    user: userIds[Math.floor(Math.random() * userIds.length)],
                    complain: complain._id,
                    text: faker.lorem.paragraph(),
                    createdAt: faker.date.past()
                  })
                  comment.save()
                }
              })

          }
        }).catch(console.error)
    }
  }).catch(console.error)
