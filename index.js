require('dotenv').config();
const express = require('express');

const morgan = require('morgan')
const cors = require('cors')
const static = require('static')

const app = express();
const Person = require('./models/person');

const persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
];

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// app.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>')
// });

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
    Person.deleteOne({ _id: req.params.id }).then(
        () => res.status(204).end()
    )
});

app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) return res.status(400).json({ error: "content missing" });

    Person.find({ name: req.body.name }).then(
        found => {
            if (found.length) {
                return res.status(400).json({ error: "name must be unique" });
            } else {
                const person = new Person({
                    name: req.body.name,
                    number: req.body.number
                });
                person.save().then(added => res.status(200).json(added));
            }
        }
    )


});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});