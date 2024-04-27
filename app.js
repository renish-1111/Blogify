const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT
const userRouter = require('./routes/user')
const blogRouter = require('./routes/blog')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { checkForAuthenticationCookie } = require('./middlewares/authentication')
const Blog = require('./models/blog')
require('dotenv').config()


mongoose.connect(process.env.MONGO_URL)
    .then((db) => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err)
    })

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve('./public')))

app.use('/user', userRouter)
app.use('/blog', blogRouter)
app.get('/', async (req, res) => {

    const allBlog = await Blog.find({})
    res.render('home', {
        user: req.user, 
        blogs: allBlog
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))