const express = require('express')
const signUp = require('../model/sign-up')
const router = new express.Router()
const bcrypt = require('bcryptjs')

router.get('/', (req, res) => {
        res.render('home')
})

router.get('/login', (req, res) => {
        res.render('login')
})

router.get('/signup', (req, res) => {
        res.render('sign-up')
})

router.post('/signup', async (req, res) => {
        try {
                const password = req.body.password
                const confirmPassword = req.body.confirmpassword

                if (password === confirmPassword) {

                        const newuser = new signUp({
                                Firstname: req.body.Firstname,
                                Lastname: req.body.Lastname,
                                email: req.body.email,
                                password: req.body.password,
                                confirmpassword: req.body.confirmpassword,
                                phone: req.body.phone,
                                age: req.body.age
                        })

                        const token = await newuser.generateAuthtoken()

                        const register = await newuser.save()

                        res.status(201).render('login')
                } else {
                        res.send('Password did not match!')
                }

        } catch (e) {
                res.status(400).send(e)
        }
})

router.post('/login', async (req, res) => {
        try {

                const email = req.body.email
                const pass = req.body.password

                const isMatch = await signUp.findOne({ email: email })

                const matchPassword = await bcrypt.compare(pass, isMatch.password)

                const token = await isMatch.generateAuthtoken()

                if (matchPassword) {
                        res.status(201).render('home')
                } else {
                        res.send('invalid email or password!')
                }

        } catch (e) {
                res.status(400).send('invalid email or password')
        }
})

router.get('*', (req, res) => {
        res.render('404')
})

module.exports = router