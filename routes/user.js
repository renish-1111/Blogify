const { Router } = require('express')
const User = require('../models/user')

const router = Router()

router.get('/signup', (req, res) => {
    return res.render('signup')
})

router.get('/signin', (req, res) => {
    return res.render('signin')
})

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/')
})

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body

    if (!email || !fullName || !password) {
        return res.render('signup', { 'error': 'Fill this form!' })
    }
    const existEmail = await User.findOne({ email })
    if (existEmail) {
        return res.render('signup', { 'error': 'Email is exist!' })
    }

    await User.create({
        fullName,
        email,
        password
    })

    return res.redirect('/user/signin')
})


router.post('/signin', async (req, res) => {
    const { email, password } = req.body

    try {
        const token = await User.matchPasswordAndGenerateToken(email, password)
        res.cookie('token', token).redirect('/')
    }
    catch (err) {
        return res.render('signin', { err })
    }
})

module.exports = router