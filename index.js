require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const static = require('static');

const app = express();
const Person = require('./models/person');

morgan.token('body', (req, res) => JSON.stringify(req.body));

const errorHandler = (error, req, res, next) => {
    console.error(error);

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    }
    else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error._message })
    }

    next(error);
}

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors());
app.use(express.static('dist'));

app.get('/api/persons', (req, res, next) => {
    Person.find({}).then(p => {
        res.json(p);
    });
});

app.get('/info', (req, res, next) => {
    const currentTime = new Date();
    Person.find({}).then(p => {
        res.send(
            `<p>Phonebook has info for ${p.length} people</p><p>${currentTime.toLocaleString()}</p>`
        )
    });
});

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(p => {
        p ?
            res.status(200).json(p)
            : res.status(404).end();
    })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id).then(
        () => res.status(204).end()
    )
        .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
    if (!req.body.name || !req.body.number) return res.status(400).json({ error: "content missing" });
    const person = new Person({
        name: req.body.name,
        number: req.body.number
    });
    person.save().then(added => res.status(200).json(added))
        .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {

    Person.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        number: req.body.number
    }, { runValidators: true }).then(
        () => res.status(200).json(req.body)
    ).catch(error => next(error));
})

app.use(errorHandler);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});