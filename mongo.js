const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.2o2yd1n.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const contactSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Contact = mongoose.model('Contact', contactSchema)


mongoose
  .connect(url)
  .then((result) => {
    if(!name) {
        Contact.find({}).then(result => {
            console.log('phonebook:')
            result.forEach(contact => {
                console.log(`${contact.name} ${contact.number}`)
            })
            mongoose.connection.close() 
        })
    } else {
        const contact = new Contact({
            name: name,
            number: number
        })    
        return contact.save()
    }    
})
.then(() => {
    if (name) {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()        
    }
})
.catch(err => console.log(err))