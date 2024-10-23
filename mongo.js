const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('give password as argument');
    process.exit(1);
}

const password = process.argv[2];

const url =
    `mongodb+srv://caleb:${password}@cluster0.kl01s.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`
    ;
mongoose.set('strictQuery', false);

mongoose.connect(url);

//Definición del esquema
const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv[3]) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    });
    person.save().then(result => {
        console.log(`${result.name} was added!`);
        mongoose.connection.close();
    });
} else {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(p => {
            console.log(p.name, p.number);
        })
        mongoose.connection.close();
    });
}