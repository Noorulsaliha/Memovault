require("dotenv").config();
const config = require("./config.json")
const mongoose = require("mongoose")
const mongoURI = process.env.connectionString;
mongoose.connect(mongoURI).then (() => console.log('MongoDB Connected'))


const User = require("./models/user.model")
const Memo = require("./models/memo.model")
const express = require("express")
const PORT= process.env.PORT || 3000;
const path = require("path")
const cors = require("cors")
const app = express();
const jwt = require("jsonwebtoken")
const authenticationToken = require("./utilities")


app.use(express.json())
app.use(
    cors({
        origin : "*"
    })
)
//CREATE ACCOUNT
app.post("/create-account", async (req,res) => {

    const { fullname, email, password } = req.body;
    if(!fullname){
        return res.status(400).json({
            error : true,
            message : "Full name is required"
        })
    }
    if(!email){
        return res.status(400).json({
            error : true,
            message : "Email id is required"
        })
    }
    if(!password){
        return res.status(400).json({
            error : true,
            message : "Password is required"
        })
    }
    try {
    const isUser = await User.findOne({email});
    if(isUser){
        return res.status(400).json({
            error : true,
            message : "User already exists"
        });
    }

    const user = new User({
        fullname,
        email,
        password
    })
    await user.save();

    const accessToken = jwt.sign({userId : user._id}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn : "1h"
    })

    return res.json({
        error : false,
        user : {
            fullname : user.fullname,
            email : user.email
        },
        accessToken,
        message : "Registration Successfull"
    })}
    catch(err){
        res.status(500).json({
            error : true,
            message : "Internal Server Error"
        })
}
})

//Login
app.post('/login', async(req,res) => {
    const { email, password } = req.body;
    
    if(!email){
        return res.status(400).json({
            message : "Email is required"
        })
    }
    if(!password){
        return res.status(400).json({
            message : "Password is required"
        })
    }

    try {
        const user = await User.findOne({email : email})
    
        if(!user) {
        return res.status(400).json({
            message : "User Not Found"
        })
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({
                message :"Invalid Password"
            })
        }
        const accessToken = jwt.sign({userId : user._id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn : '1h'
        })
        
        res.json({
            accessToken,
            user : {
                fullname : user.fullname,
                email : user.email
            },
            message : 'Login Successfull'
        })
    }
    catch(err){
        res.status(400).json({message : "Server Error"})
    }
})

//Add memo
app.post('/add-memo', authenticationToken, async(req, res) => {
    const { title, content, tags } = req.body;
    const user = req.user;
    
    if(!title){
        return res.status(400).json({
            error : true,
            message : "Title is required"
        })
    }
    if(!content){
        return res.status(400).json({
            error : true,
            message : "Content is required"
        })
    }

    try {
        const memo = new Memo({
            title,
            content,
            tags : tags || [],
            userId : user.userId
        })
        await memo.save()

        res.json({
            error : false,
            memo,
            message : "Note Added Successfully"
        });
    }
    catch(err){
        res.status(400).json({
            message : "Internal server error"
        })
    }
})

//Edit-memo
app.put('/edit-memo/:memoId', authenticationToken, async(req,res) => {
    const memoId = req.params.memoId;
    const user = req.user;
    const { title, content, tags, isPinned } = req.body;

    
    if(!title && !content && !tags){
        return res.status(400).json({
            error: true,
            message : "no changes Provided"
        })
    }
    try {
        const memo = await Memo.findOne({
            _id : memoId,
            userId : user.userId
        })

        if(!memo){
            return res.status(400).json({
                error : true,
                message : "Memo not found"
            })
        }
        if(title) memo.title = title;
        if(content) memo.content = content;
        if(tags) memo.tags = tags;
        if(isPinned) memo.isPinned = isPinned;

        await memo.save();

        return res.json({
            error : false,
            memo,
            message : "Note updated Successfully"
        })
    }
    catch(err){
        res.status(500).json({
            error : true,
            message  : "Internal Server Error"
        })
    }
})

//All-memos
app.get('/get-all-memos', authenticationToken, async(req,res) => {
    const user = req.user;

    try{
        const memos = await Memo.find({
            userId : user.userId
        }).sort({
            isPinned : -1
        })

        return res.json({
            error : false,
            memos,
            message : "All memos retrived successfully!"
        })
    }
    catch(err){
        return res.json(500).json({
            error : true,
            message : "Internal Server Error"
        })
    }
})

//Delete-memo
app.delete('/delete-memo/:memoId', authenticationToken, async(req,res) => {
    const memoId = req.params.memoId;
    const user = req.user;

    try{
        const memo = await Memo.find({
            _id : memoId,
            userId : user.userId
        })

        if(!memo){
            return res.status(404).json({
                error : true,
                message : "Note not found"
            })
        }
        
        await Memo.deleteOne({
            _id : memoId,
            userId : user.userId
        })
        return res.json({
            error : false,
            message : "Note deleted successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        })
    }
})

//update-ispinned
app.put('/update-memo-ispinned/:memoId', authenticationToken, async(req,res) => {
    const memoId = req.params.memoId;
    const user = req.user;
    const { isPinned } = req.body;

    try {
        const memo = await Memo.findOne({
            _id: memoId,
            userId : user.userId
        })

        if(!memo){
            return res.status(404).json({
                error : true,
                message : "Memo not found"
            })
        }
        memo.isPinned = isPinned

        await memo.save();

        return res.json({
            error : false,
            memo,
            message : "Note Updated Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            error : true,
            message : "Internal Server Error"
        })
    }
})

//get-user
app.get('/get-user', authenticationToken, async(req,res) => {
    const user = req.user;

    const isUser = await User.findOne({
        _id : user.userId
    })

    if(!isUser){
        return res.sendStatus(401)
    }
    res.json({
        user : {
            fullname : isUser.fullname,
            email : isUser.email,
            _id : isUser._id,
            createdOn : isUser.createdOn
        }
    })
})

//search-query
app.get('/search-memo', authenticationToken, async(req,res) => {
    const user = req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({
            error : true,
            message : "Search Query is Required"
        })
    }
    try {
        const matchingNotes = await Memo.find({
            userId : user.userId,
            $or : [{
                title : {
                    $regex : new RegExp(query, "i") //i makes the search query case-insensitive
                }
            },{
                content : {
                    $regex : new RegExp(query, "i")
                }
            }]
        })
        return res.json({
            error : false,
            memos : matchingNotes,
            message : "Notes matching the search query retrieved successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            error : true,
            message : "Internal server error"
        })
    }
})

app.use(express.static(path.join(__dirname, "../frontend/MemoVault/dist")))
app.get('*', (_, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/MemoVault/dist/index.html"))
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
module.exports = app;