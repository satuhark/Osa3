const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://satumharkonen:${password}@cluster0.r4cnza1.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Add = mongoose.model('name', noteSchema)

if (name !== undefined && number !== undefined) {
  const add = new Add({
    name: name,
    number: number,
  })
  add.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error saving note:', error)
      mongoose.connection.close()
    })
} else {
  Add.find({})
    .then(result => {
      console.log('Phonebook:')
      result.forEach((entry) => {
        console.log(`Name: ${entry.name}, Number: ${entry.number}`)
      })
      mongoose.connection.close()
    })
    .catch((error) => {
      console.error('Error retrieving numbers from the database:', error)
      mongoose.connection.close()
    })
}
