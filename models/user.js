const mongoose = require('mongoose');
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require('../services/authentication');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER'

    }
},
    {
        timestamps: true,
    });

userSchema.pre('save', function (next) {
    const user = this

    if (!user.isModified('password')) return

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt)
        .update(user.password)
        .digest("hex");
    this.salt = salt;
    this.password = hashedPassword;
    next();

})

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user =await this.findOne({ email })

    if (!user) throw new Error('email is wrong')

    const hashedPassword = user.password
    const salt = user.salt

    const userHashedPassword = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userHashedPassword) throw new Error('password is wrong')
    
    const token = createTokenForUser(user)
    return token
})

const User = mongoose.model('User', userSchema);

module.exports = User;