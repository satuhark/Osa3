const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('C:\\Users\\satum\\teht3\\dist'))
app.use(cors())



let notes = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
  ]


  app.get('/', (request, response) => {
    response.send('')
  })
  
  app.get('/api/persons', (request, response) => {
    const formattedJSON = JSON.stringify(notes, null, 2)
    response.header('Content-Type', 'application/json')
    response.send(formattedJSON)
  })

  app.get('/info', (request, response) => {
    const numberOfPeople = notes.length
    const currentTime = new Date().toString()
    const infoMessage = `Phonebook has info for ${numberOfPeople} people. <br> ${currentTime}`
    response.send(infoMessage)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = notes.find((note) => note.id === id)
    if (person) {
        const formattedJSON = JSON.stringify(person, null, 2)
        response.header('Content-Type', 'application/json')
        response.send(formattedJSON)
      } else {
        response.status(404).end()      
    }})
    
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
    })

  app.post('/api/persons', (request, response) => {
    const { name, number } = request.body
    const nameExists = notes.some((note) => note.name === name)
    const numberExists = notes.some((note) => note.number === number)
    
    if (nameExists) {
        response.status(400).json({ error: 'Name must be unique' })
    }

    if (numberExists) {
        response.status(400).json({ error: 'Number must be unique' })
    }
       
    const id = (Math.floor(Math.random() * 100) + 1).toString()
    const note = { ...request.body, id }
    console.log(note)
    notes.push(note)
    response.json(note)
    })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

