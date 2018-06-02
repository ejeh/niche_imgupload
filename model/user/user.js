var db = global.db;
var mongoose = require("mongoose");
    bcrypt = require('bcryptjs');


// MONGOOSE MODEL CONFIGURATION
const UserSchema = new mongoose.Schema({
    
        
        email: {
            type: String,
            required: [true, 'Please enter a valid email address'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password 6 digit minimum'],
            minlength:6

        },
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        phonenumber: {
            type: String,
            minlength:11
        },
        address: {
            type: String,
        }
    
    
});


    UserSchema.pre('save', function(next){
        var User = this;
        bcrypt.hash(User.password, 10, function(err, hash){
            if(err){
                return next(err);
            }
            User.password= hash;
            next()
        })
    })
    
    
    
    UserSchema.statics.authenticate = function (email, password, callback){
        var User = this
        User.findOne({ email: email}).exec(function (err, User){
            if(err){
                return callback(err)
            }else if(!User){
                var err = new Error('User not found');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, User.password, function(err, result){
                if (result === true){
                    return callback(null, User);
                }
                else{
                    return callback()
                }
                
            })
        })
    }
module.exports = mongoose.model('User', UserSchema);
