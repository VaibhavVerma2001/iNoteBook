const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/iNoteBook";
mongoose.connect(url);

mongoose.connection
    .once('open', function () {
        console.log('Successfully connected to Database User collection...');
    })
    .on('error', function (err) {
        console.log(err);
});

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now  // dont call this func , it will get called during insertng data
    }
});

const User = new mongoose.model("User", userSchema);




module.exports = User;