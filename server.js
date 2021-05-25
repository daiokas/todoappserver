const express = require("express");
const app = express();
// const bodyParser = require
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = 4000;

const connectOption = {
    useUnifiedTopology: true,
    useNewUrlParser: true
}

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

app.post('/post', async(req, res) => {
    const todos = new Todo({
        text: req.body.text,
        // completed: req.
    })
    return app.render(req, res, '/post', req.query)
})

app.listen(PORT, (err) => {
    if (err) throw err
    console.log("Server is running on Port: " + PORT);
});