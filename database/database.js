import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CQ',
  password: '123456',
  port: 5432,
})

async function getStudents() {
	const str = `SELECT * FROM "Student"."Student"`
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}
}

async function getBooks() {
	const str = `SELECT * FROM "Student"."Book"`
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}
}

async function getHistory() {

	const str = `SELECT * FROM "Student"."History"`
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}
}

async function getStudentId(fName, lName) {
	let value = null;

	const str = `SELECT "Student"."GetStudentId"('${fName}', '${lName}') as s_id`
	try {
		const res = await pool.query(str);
		return res.rows[0].s_id;
	} catch (err) {
		return err.stack;
	}
}

async function getBookId(bName) {
	let value = null;
	const str = `SELECT "Student"."GetBookId"('${bName}') as b_id`
	
	try {
		const res = await pool.query(str);
		return res.rows[0].b_id;
	} catch (err) {
		return err.stack;
	}
}

async function AddBook(bookName, author) {
	const str = `CALL "Student"."AddBook"('${bookName}', '${author}')`
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}
}

async function AddStudent(fName, lName) {
	const str = `CALL "Student"."AddStudent"('${fName}', '${lName}')`
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}
}

async function AddHistory(fName, lName, bName) {
	let b_id = null, s_id = null;

	b_id = await getBookId(bName)
	s_id = await getStudentId(fName, lName)

	console.log(b_id)
	console.log(s_id)

	const str = `SELECT "Student"."AddHistory"(${b_id}, ${s_id})`
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}

}

async function RemoveStudent(fName, lName) {
	const str = `DELETE FROM "Student"."Student" WHERE fName='${fName}' AND lName='${lName}'`;
	try {
		const res = await pool.query(str);
		return res.rows;
	} catch (err) {
		return err.stack;
	}
}

// ------------- Express ---------------
const getUsers = (request, response) => {
	pool.query('SELECT * FROM "Student"."Student"', (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).json(results.rows)
	})
}

const getBooksExpress = (request, response) => {
	pool.query(`SELECT * FROM "Student"."Book"`, (error, results) => {
		if (error) throw error
		response.status(200).json(results.rows)
	})
}

const getHistoryExpress = (request, response) => {
	pool.query(`SELECT * FROM "Student"."History" as h
				INNER JOIN "Student"."Student" as s on h.s_id = s.s_id
				INNER JOIN "Student"."Book" as b on h.b_id = b.b_id`, (error, results) => {
		if (error) throw error
		response.status(200).json(results.rows)
	})
}
  
const getUserById = (request, response) => {
	const id = parseInt(request.params.id)
  
	pool.query('SELECT * FROM "Student"."Student" WHERE s_id = $1', [id], (error, results) => {
		if (error) throw error
		response.status(200).json(results.rows)
	})
}

const getBookById = (request, response) => {
	const id = parseInt(request.params.id)

	pool.query(`SELECT * FROM "Student"."Book" WHERE b_id = ${id}`, (error, results) => {
		if (error) throw error
		response.status(200).json(results.rows)
	})
}

const getHistoryById = (request, response) => {
	const id = parseInt(request.params.id)
	pool.query(`SELECT * FROM "Student"."History" as h
				INNER JOIN "Student"."Student" as s on h.s_id = s.s_id
				INNER JOIN "Student"."Book" as b on h.b_id = b.b_id
				WHERE h.br_id = ${id}`, (error, results) => {
		if (error) throw error
		response.status(200).json(results.rows)
	})
}
  
const createUser = (request, response) => {
	const { fName, lName } = request.body
  
	pool.query('INSERT INTO "Student"."Student" (fName, lName) VALUES ($1, $2)', [name, email], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send(`User added with ID: ${results.insertId}`)
	})
}

const createBook = (request, response) => {
	const { bName, author } = request.body

	pool.query(`INSERT INTO "Student"."Book" (bName, author) VALUES ('${bName}', '${author}')`, (error, results) => {
		if (error) throw error
		response.status(201).send(`Book Added with ID: ${results.insertId}`)
	})
}

const createHistory = (request, response) => {
	const { b_id, s_id } = request.body

	pool.query(`INSERT INTO "Student"."History" (b_id, s_id) VALUES (${b_id}, ${s_id})`, (error, results) => {
		if (error) throw error
		response.status(201).send(`History Added With ID: ${results.insertId}`)
	})
}
  
const updateUser = (request, response) => {
	const id = parseInt(request.params.id)
	const { fName, lName } = request.body
  
	pool.query('UPDATE "Student"."Student" SET fName = $1, lName = $2 WHERE s_id = $3', [fName, lName, id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`User modified with ID: ${id}`)
	})
}
  
const deleteUser = (request, response) => {
	const id = parseInt(request.params.id)
  
	pool.query('DELETE FROM "Student"."Student" WHERE s_id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`User deleted with ID: ${id}`)
	})
}

const deleteBook = (request, response) => {
	const id = parseInt(request.params.id)
  
	pool.query('DELETE FROM "Student"."Book" WHERE b_id = $1', [id], (error, results) => {
		if (error) {
			throw error
		}
		response.status(200).send(`Book deleted with ID: ${id}`)
	})
}


export {
	getBooks,
	getHistory,
	getStudentId,
	getStudents,
	getBookId,
	AddBook,
	AddStudent,
	AddHistory,
	RemoveStudent,

	getUsers,
	getUserById,
	createUser,
	updateUser,
	deleteUser,

	getBooksExpress,
	getBookById,
	createBook,
	deleteBook,

	getHistoryExpress,
	getHistoryById,
	createHistory
}