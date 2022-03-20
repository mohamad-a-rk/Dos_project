const fs = require('fs')

const loadBooks = function () {
    try {
        const dataBuffer = fs.readFileSync('books.csv')
        const notes = JSON.parse(dataBuffer.toString())
        return notes
    } catch (e) {
        return []
    }
}

const saveBooks = function (books) {
    const data = JSON.stringify(books)
    fs.writeFileSync('notes.json', data)
}

const searchBooks = function (topic) {
    const books = loadBooks()
    const foundBooks = books.filter((book) => (book.topic == topic))
    const propsToRemove = ['topic', 'itemsInStock', 'cost']
    foundBooks.forEach((book) => {
        propsToRemove.forEach((propName) => {
            delete book[propName]
        })
    })
    return foundBooks
}

const infoBook = function (item_number) {
    const books = loadBooks()
    const foundBook = books.find((book) => (book.item_number == item_number))
    const propsToRemove = ['topic', 'item_number', 'title']

    try {
        propsToRemove.forEach((propName) => {
            delete foundBook[propName]
        })
        return foundBook
    } catch (error) {
        return {}
    }

}

module.exports = {
    saveBooks,
    loadBooks,
    searchBooks,
    infoBook
}