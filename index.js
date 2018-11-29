const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const logger = require('./utils/middleware/logger')
const cors = require('cors')
// const pg = require('pg')
const config = require('./utils/config')

var unless = (path, middleware) => {
  return (req, res, next) => {
    if (path === req.path) {
      return next()
    } else {
      return middleware(req, res, next)
    }
  }
}

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(unless('/api/login', logger))

// Routers
const loginRouter = require('./controllers/login')
const groupsRouter = require('./controllers/groups')
const membershipRouter = require('./controllers/memberships')
const topicsRouter = require('./controllers/topics')
const topicDatesrouter = require('./controllers/topicDates')
const tokenCheckRouter = require('./controllers/tokenCheck')
const registrationRouter = require('./controllers/registrations')
const usersRouter = require('./controllers/users')
app.use('/api/login', loginRouter)
app.use('/api/groups', groupsRouter)
app.use('/api/memberships', membershipRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/topicDates', topicDatesrouter)
app.use('/api/tokenCheck', tokenCheckRouter)
app.use('/api/registrations', registrationRouter)
app.use('/api/users', usersRouter)

// Database connection
// const connectionString = process.env.DATABASE_URI || 'postgres://localhost:5432/todo';
// const client = new pg.Client(connectionString)
// client.connect();

// Database connection
const db = require('./models')
db.connect()

// Initialize server
const PORT = config.port
const server = http.createServer(app)
server.listen(PORT, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  // Close database connection
  db.sequelize.close()
    .then(() => console.log('client has disconnected'))
    .catch(err => console.error('error during disconnection', err.stack))
})

module.exports = {
  app,
  server
}
