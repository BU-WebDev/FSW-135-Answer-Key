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
            const token = jwt.sign(savedUser.toObject(), process.env.SECRET)
            return res.status(201).send( {token, user: savedUser})
        })
    })
})

//User Login
authRouter.post("/login", (req, res, next) => {
    Control.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
        if(err){
            res.status(500)
            return next(err)
        }
        if(!user || req.body.password !== user.password){
            res.status(403)
            return next(new Error("Invalid Login Account"))
        }
        const token = jwt.sign(user.toObject(), process.env.SECRET)
        return res.status(200).send( {token, user} )
    })
})

//Create new User
// authRouter.post('/', (req, res, next) => {
//     const newUser = new Control(req.body)
//     newUser.save((err, savedUser) => {
//         if(err){
//             res.status(500)
//             return next(err)
//         }
//         return res.status(201).send(savedUser)
//     })
// })

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