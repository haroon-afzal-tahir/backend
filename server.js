import * as  db from './database/database.js'
import express from 'Express'
import bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url';
import logger from 'morgan'

const app = express()
const port = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jade")

app.use(cors())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

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