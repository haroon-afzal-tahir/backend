class History {
	constructor(borrowedId, book: Book, student: Student, dateBorrowed, dateReturn) {
		this.borrowedId = borrowedId
		this.book = book
		this.student = student
		this.dateBorrowed = dateBorrowed
		this.dateReturn = dateReturn
	}
}