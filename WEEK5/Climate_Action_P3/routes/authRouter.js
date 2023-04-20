const express = require('express')
const authRouter = express.Router()
const Control = require('../models/User.js')
const jwt = require('jsonwebtoken')

//User Signup 
authRouter.post("/signup", (req, res, next) => {
    Control.findOne({username: req.body.username.toLowerCase()}, (err, user) => {
        if(err) {
            res.status(500)
            return next(err)
        }
        if(user) {
            res.status(403)
            return next(new Error("The User already exists!"))
        }
        const newUser  = new Control(req.body)
        newUser.save((err, savedUser) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            const token = jwt.sign(savedUser.withoutPassword(), process.env.SECRET)
            return res.status(201).send( {token, user: savedUser.withoutPassword()})
        })
    })
})

//User Login
authRouter.post("/login", (req, res, next) => {
    const failedLogin = "Username or Password is incorrect"
    Control.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if(err){
            res.status(500)
            return next(err)
        }
        if(!user){
            res.status(403)
            return next(new Error(failedLogin))
        }
        user.checkPassword(req.body.password, (err, isMatch) => {
            if(err) {
                res.status(403)
                return next(new Error(failedLogin))
            }
            if(!isMatch) {
                res.status(403)
                return next(new Error(failedLogin))
            }
            const token = jwt.sign(user.withoutPassword(), process.env.SECRET)
            return res.status(200).send( {token, user: user.withoutPassword()} )
        })
    })
})

//Read All
authRouter.get('/users', (req, res, next) => {
    Control.find((err, users) => {
        if(err){
            res.status(500)
            return next(err)
        }
        return res.status(200).send(users)
    })
})

//Read User by Search term
authRouter.get('/usersearch', (req, res, next) =>{
    const { user } = req.query
    const pattern = new RegExp(user)
    Control.find (
        { username: {$regex: pattern, $options: 'i'} },
        (err, users) => {
            if(err) {
                res.status(500)
                return next(err)
            }
            return res.status(201).send(users)
        }
    )
})

//Update User
authRouter.put('/updateuser/:userID', (req, res, next) => {
    Control.findOneAndUpdate(
        { _id: req.params.userID },
        req.body,
        {new : true },
        (err, updatedControl) => {
            if(err){
                res.status(500)
                return next(err)
            }
            return res.status(201).send(updatedControl)
        }
    )
})

//Delete User
authRouter.delete('/deleteuser/:userID', (req, res, next) => {
    Control.findOneAndDelete(
      { _id: req.params.userID },
      (err, deletedUser) => {
        if(err){
          res.status(500)
          return next(err)
        }
        return res.status(200).send(`Successfully delete todo: ${deletedUser.username}`)
      }
    )
  })

module.exports = authRouter