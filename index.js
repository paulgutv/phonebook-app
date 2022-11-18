const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('content', (req, res) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
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
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = persons.find(a => a.id === id)

    if(contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(a => a.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const randomId = Math.floor(Math.random() * 999999)
    return randomId
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(404).json({
            error: 'content missing'
        })
    } else if(persons.some(a => a.name.includes(body.name))) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    const contact = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(contact)
    response.json(contact)
})



const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)