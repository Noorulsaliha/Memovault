const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const saltRounds = 10;

const userSchema = new Schema({
    fullname : {type : String, required : true},
    email : {type : String, required : true, unique:true},
    password : {type : String, required : true},
    createdOn : {type : Date, default : Date.now}
})

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();
    
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        if(err) return next(err);
        this.password = hash;
        next();
    })
})

userSchema.methods.comparePassword = function(candiatePassword){
    return new Promise((resolve, reject) => {
        bcrypt.compare(candiatePassword, this.password, (err, isMatch) => {
            if(err) return reject(err);
            resolve(isMatch);
        })
    })
}

module.exports = mongoose.model("User", userSchema)