const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 4000;

const connectOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}

app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://dai:moaicon135@cluster0.rcrau.mongodb.net/todos?retryWrites=true&w=majority', connectOption);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'DB connection error:'));
db.once('open', () => console.log('DB connection successful'));

const todoSchema = require("./model/todoSchema")
const Todo = mongoose.model('todo', todoSchema, 'todo')

app.use(express.json())

app.get('/get', async(req, res) => {
    const todos = await Todo.find({});
    res.json(todos);
})

app.post('/post', async (req, res) => {
    const todos = new Todo({
        text: req.body.text,
        completed: req.body.completed
    })
    const result = await todos.save().catch((error) => ({ error }))
    res.json(result);
})

app.get('/delete', async (req, res) => {
    const {id} = req.query
    const result = await Todo.findByIdAndDelete(id).catch((error) => ({ error }))
    res.json(result)

})

app.post('/complete', async (req, res) => {
    const {id} = req.query
    const {completed} = req.body
    const result = await Todo.findByIdAndUpdate(id, {completed: completed}).catch((error) => ({ error }))
    res.json(result)
})

app.get('/deleteall', async (req, res) => {
    const result = await Todo.deleteMany({completed: true}).catch((error) => ({ error }))
    res.json(result)
})

app.get('/completeall', async (req, res) => {
    const result = await Todo.updateMany({completed: true}).catch((error) => ({ error }))
    res.json(result)
})

app.get('/showActive', async (req, res) => {
    const result = await Todo.find({completed: false}).exec().catch((error) => ({ error }))
    res.json(result)
})


app.listen(PORT, (err) => {
    if (err) throw err
    console.log("Server is running on Port: " + PORT);
});