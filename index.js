const mongoose = require('mongoose')
require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.static('dist'))
app.use(express.json())
const morgan = require('morgan')
app.use(morgan('dev'))

const cors = require('cors')
app.use(cors())

const Note = require('./models/note')


app.get('/', (req, res) => {
  res.send('')
})

app.get('/api/persons', (req, res, next) => {
  Note.find({}).then((notes) => {
    res.json(notes)
  })
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  Note.find({}).then((notes) => {
    const numberOfPeople = notes.length
    const currentTime = new Date().toString()
    const infoMessage = `Phonebook has info for ${numberOfPeople} people. <br> ${currentTime}`
    res.json({ infoMessage })
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Note.findById(req.params.id).then(note => {
    if (note) {
      res.json(note)
    } else {
      res.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.options('/api/persons', cors())

app.post('/api/persons', async (request, response) => {
  try {
    const { name, number } = request.body
    const nameExists = await Note.exists({ name: name })
    const numberExists = await Note.exists({ number: number })

    if (nameExists) {
      response.status(400).json({ error: 'Name must be unique' })
      return
    }

    if (numberExists) {
      response.status(400).json({ error: 'Number must be unique' })
      return
    }

    const newNote = new Note({ name: name, number: number })
    await newNote.save()
      .then(() => {
        response.status(201).json(newNote)
      })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } else {
      console.error('Error handling POST request:', error)
      response.status(500).json({ error: 'Internal Server Error' })
    }
  }})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  const url = process.env.MONGODB_URI
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB')
    })
    .catch((error) => {
      console.log('Error connecting to MongoDB:', error.message)
    })
})
