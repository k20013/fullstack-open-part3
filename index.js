require('dotenv').config();
const express = require('express');

const morgan = require('morgan')
const cors = require('cors')
const static = require('static')

const app = express();
const Person = require('./models/person');

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res) => {
    Person.find({}).then(p => {
        res.json(p);
    })
});

app.get('/info', (req, res) => {
    const currentTime = new Date();
    Person.find({}).then(p => {
        res.send(
            `<p>Phonebook has info for ${p.length} people</p><p>${currentTime.toLocaleString()}</p>`
        )
    })
});

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(p => {
        res.json(p);
    });
});

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id).then(
        () => res.status(204).end()
    )
});

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) return res.status(400).json({ error: "content missing" });
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    });
    person.save().then(added => res.status(200).json(added));
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});