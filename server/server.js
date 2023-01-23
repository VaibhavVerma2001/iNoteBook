const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator'); //https://express-validator.github.io/docs/
const bcrypt = require('bcryptjs');// For hashing and salting // https://www.npmjs.com/package/bcryptjs
const jwt = require('jsonwebtoken'); //helps in login, way to verify a user like express session to give token to user
const User = require('./db/User');
const Note = require('./db/Note');
const fetchuser = require('./middleware/fetchuser');

// to get api call
const cors = require("cors");



const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());



// **************************** Authentication  *******************************

// put in .env
const JWT_SECRET = "This is a secret string to sign web token";


//ROUTE 1 -- adding express validators -- app.post("path" , [validators] , (req,res)...)
app.post("/api/auth/createuser", [body('email', 'Enter a valid email').isEmail(), body('password', 'minimum password length 4').isLength({ min: 4 }), body('name', 'Enter a valid name').isLength({ min: 1 })], (req, res) => {
    // validators
    const errors = validationResult(req);
    //means it has error
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        success = false;
        return res.status(400).json({success, errors: errors.array() });
    }
    // when no error
    else {
        // if email already exist
        User.findOne({ email: req.body.email }, function (err, foundUser) {
            if (err) {
                console.log(err);
            }
            else {
                if (foundUser !== null) {
                    // console.log("User with given email already exist...");
                    success = false;
                    return res.status(400).json({success, error: "Sorry a user with this email already exists" })
                }
            }
        });

        // https://www.npmjs.com/package/bcryptjs
        // secure password with hashing
        const salt = bcrypt.genSaltSync(10); //use Sync bec it return promise
        const securePass = bcrypt.hashSync(req.body.password, salt); //use Sync bec it return promise

        let newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: securePass
        });

        newUser.save((err, user) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log("User added successfully...");
                const data = {
                    user: {
                        id: user.id //bec id has index so it is fast
                    }
                }
                const authtoken = jwt.sign(data, JWT_SECRET); //sync method
                // console.log(authtoken);
                success = true;
                res.json({success, authtoken,user });
            }
        });
    }
});


//ROUTE 2 --  make functions async and use await
app.post("/api/auth/login", [body('email', 'Enter a valid email').isEmail()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // console.log(errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (!user) {
            // means that email dont exists 
            success = false; // to send msg
            return res.status(400).json({success, error: "Please try to login with correct credentials" });
        }

        //compare entered password with that found user password
        const passwordCompare = await bcrypt.compare(password, user.password); //returns true or false
        if (!passwordCompare) {
            success = false; // just to show user message
            return res.status(400).json({ success ,error: "Please try to login with correct credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true; // just to show user message
        res.json({success, authtoken ,user});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// Route 3 -- Get login user detail . Login required (Creating a middleware(function which will get called when we go to that route) to decode user from a JWT ) using auth token
app.post('/api/auth/getuser', fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});




// ***************************  Fetching notes of user  **************************

// fetchuser will have that user
app.get("/api/notes/fetchallnotes", fetchuser, (req, res) => {
    Note.find({ user: req.user.id }, (err, notes) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(notes); //notes array
        }
    });
});


// Add a new note -- corresponding to a token given in header ("auth-token") of given user save notes
app.post("/api/notes/addnote", fetchuser, [body('title', 'Title cannot be blank').exists(), body('description', 'Description cannot be blank').exists()], async (req, res) => {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // console.log(errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const newNote = new Note({
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag,
            user: req.user.id // will be added automatically
        });

        const savedNote = await newNote.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


//Update and existing node -- only logged in user can update there notes only
// we can use post also
app.put("/api/notes/updatenote/:noteId", fetchuser, async (req, res) => {

    try {
        let newTitle = req.body.title;
        let newDescription = req.body.description;
        let newTag = req.body.tag;

        //1st check whether user is giving some value to update or not
        const newNote = {};
        if (newTitle) { newNote.title = newTitle };
        if (newDescription) { newNote.description = newDescription };
        if (newTag) { newNote.tag = newTag };

        //Find the new note to be updated and update it
        // to protect from hackers 1st check whether that note belongs to logged in user or not
        let note = await Note.findById(req.params.noteId);
        // if note dont exist with that id
        if (!note) {
            return res.status(404).send("Not Found");
        }
        // note.user.toString()-- will give Id
        // if not same means logged in user is trying to update someone else note -- HACKER FOUND :-)
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // now update 
        note = await Note.findByIdAndUpdate(req.params.noteId, { $set: newNote }, { new: true }); // new:true means if new entry comes then add that
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


// For deleting note
app.delete('/api/notes/deletenote/:noteId', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.noteId);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.noteId)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


const port = "5000";
app.listen(port, () => {
    console.log("Listening on port 5000...");
});