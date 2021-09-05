const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
        Firstname: {
                type: String,
                required: true,
                trim: true
        },
        Lastname: {
                type: String,
                required: true,
                trim: true
        },
        email: {
                type: String,
                required: true,
                unique: true,
                lowercase: true,
                trim: true,
                validate (value) {
                        if (!validator.isEmail(value)) {
                                throw new Error('Invalid email or Password')
                        }
                }
        },
        password: {
                type: String,
                required: true,
                trim: true        
        },
        confirmpassword: {
                type: String,
                required: true,
                trim: true
        },
        phone: {
                type: Number,
                unique: true,
                required: true,
                trim: true
        },
        age: {
                type: Number,
                required: true,
                trim: true,
                default: 0
        },
        tokens: [{
                token: {
                        type: String,
                        required: true
                }
        }]
})

userSchema.methods.generateAuthtoken = async function () {
        try {
                const token = jwt.sign({ _id: this._id.toString() }, "thisisregistrationform")
                this.tokens = this.tokens.concat({ token: token })
                await this.save()
                return token
        } catch (e) {
                res.send(e)
        }
}

userSchema.pre('save', async function(next) {
        
        if(this.isModified('password')) {
          
                this.password = await bcrypt.hash(this.password, 8)
                this.confirmpassword = await bcrypt.hash(this.password, 8)
        }
        next()
})

const signUP = mongoose.model('signUP', userSchema)

module.exports = signUP