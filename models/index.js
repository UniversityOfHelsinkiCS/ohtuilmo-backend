const Sequelize = require('sequelize')
const db = {}

db.connect = () => {
  setTimeout(function () {
    const sequelize = new Sequelize('postgres', 'postgres', null, {
      host: 'db',
      port: '5432',
      dialect: 'postgres',
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 300000000
      }
    })

    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
      })
      .catch(err => {
        console.error('Unable to connect to the database:', err)
      })

    const UserModel = require('./user')
    const GroupModel = require('./group')
    const Review = require('./review')
    const Review_answer = require('./review_answer')

    const User = UserModel(sequelize, Sequelize)
    const Group = GroupModel(sequelize, Sequelize)


    db.User = User
    db.Group = Group
    db.sequelize = sequelize
    db.Sequelize = Sequelize

    sequelize.sync()
  }, 9000)
}

module.exports = db