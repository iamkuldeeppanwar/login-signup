const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const bodyParser = require('body-parser')
const hbs = require('hbs')

const app =express()

app.use(bodyParser.urlencoded())
app.use(userRouter)

const port = process.env.PORT || 3001

app.set('view engine', 'hbs')

app.listen(port, () => {
        console.log('Server is up on port ' + port)
})