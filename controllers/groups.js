const groupsRouter = require('express').Router()
const db = require('../models/index')
const checkLogin = require('../utils/middleware/checkLogin').checkLogin

groupsRouter.post('/', checkLogin, (req, res) => {
  if (!req.body.group_name) return res.status(400).json({ error: 'group name undefined' })
  db.Group.findOne({ where: { group_name: req.body.group_name } })
    .then((foundGroup) => {
      //check if group name available
      if (foundGroup) return res.status(400).json({ error: 'a group with that name already exists' })
      //add group to database
      db.Group.create({
        group_name: req.body.group_name
      })
        .then(group => {
          res.status(200).json({ group })
        })
        .error(error => {
          console.log(error)
          res.status(500).json({ error: 'database error' })
        })
    })
})

module.exports = groupsRouter