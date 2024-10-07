const express = require('express');
const app = express();

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

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
});

app.get('/api/persons', (req, res) => {
    res.json(persons)
});

app.get('/info', (req, res) => {
    const currentTime = new Date();
    res.send(
        `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${currentTime.toLocaleString()}</p>
        `
    )
});

app.get('/api/persons/:id', (req, res) => {
    const wanted = persons.find(
        element => element.id === Number(req.params.id)
    );
    wanted
        ? res.json(wanted)
        : res.status(404).end()
});

app.delete('/api/persons/:id', (req, res) => {
    const target = persons.find(element => element.id === Number(req.params.id));
    target && persons.splice(persons.indexOf(target), 1);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    if(!req.body.name || !req.body.number) return res.status(400).json({ error: "content missing" });

    const newPerson = {
        ...req.body,
        id: Math.floor(Math.random() * 9999)
    }
    if(!!persons.find(element => element.name === newPerson.name)) {
        res.status(400).json({ error: "name must be unique" })
    } else {
        persons.push(newPerson);
        res.status(200).end();
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});