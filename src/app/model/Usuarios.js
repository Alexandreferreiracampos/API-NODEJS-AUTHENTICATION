const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select: false,
    },
    beat:{
        type: JSON,
        },
    passwordResetToken:{
        type: String,
        select: false,
    },
    passwordResetExpires:{
        type: String,
        select: false,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    }

});

//crypt password
UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})

module.exports = mongoose.model("User", UserSchema);


