const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const uploads_path = path.join('/assets/uploads');
const userSchema = new mongoose.Schema({
    name : {
        type : String, required : true
    },
    email : {
        type : String, required : true, unique : true
    },
    password : {
        type : String, required : true
    },
    uploads : [{
        type : String, unique : true
    }],
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpires : {
        type : Date
    },
    isAdmin : {
        type : Boolean, default : false
    }
}, {
    timestamps : true
});
let storage = multer.diskStorage({
    destination : function(req, file, cb) {
        cb(null, path.join(__dirname, '..', uploads_path));
    },
    filename : function(req, file, cb) {
        cb(null, req.body.place+'_'+req.body.date+'_'+Date.now());
    }
});
userSchema.statics.uploadedImage = multer({storage : storage}).single('uploads');
userSchema.statics.uploadsPath = uploads_path;
const User = mongoose.model('User', userSchema);
module.exports = User;