const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema  = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('bruh at least put more effort in your fake email...')
            }
        }

    }, 
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('come back once you are born')
            }

        }
    },
    password: {
        type: String,
        minLength: 6,
        trim: true,
        required: true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error('try coming up with a more creative password')
            }  
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }

    }],
    avatar: {
        type: Buffer
    }

}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject 

}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id : user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token

}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new error('unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new error('unable to login')
    }

    return user
}



//hash password before saving
userSchema.pre('save', async function(next){
    const user = this 
    
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete user tasks when user is remove
userSchema.pre('remove', async function(next) {
    const user = this 
    await Task.deleteMany({owner: user._id })



    next()
})


const User = mongoose.model('User', userSchema )




module.exports = User