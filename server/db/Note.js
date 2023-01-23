const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/iNoteBook";
mongoose.connect(url);

mongoose.connection
    .once('open', function () {
        console.log('Successfully connected to Database Note collection...');
    })
    .on('error', function (err) {
        console.log(err);
    });

const noteSchema = new mongoose.Schema({
    user: { //so that only login user can see its own note only
        type: mongoose.Schema.Types.ObjectId, //acts as foreign key from User model
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now  // dont call this func , it will get called during insertng data
    }
});


const Note = new mongoose.model("Note", noteSchema);

module.exports = Note;