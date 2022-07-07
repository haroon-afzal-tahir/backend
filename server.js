import * as  db from './database/database.js'
import express from 'Express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true
	})
)

// Display Home
app.get('/', (request, response) => {
	response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.get('/books', db.getBooksExpress)
app.get('/books/:id', db.getBookById)
app.post('/books', db.createBook)
app.delete('/books/:id', db.deleteBook)

app.get('/history', db.getHistoryExpress)
app.get('/history/:id', db.getHistoryById)
app.post('/history', db.createHistory)

app.listen(port, () => {
	console.log(`App Running on port ${port}`)
})