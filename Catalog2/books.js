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
    fs.writeFileSync('books.csv', data)
}

const searchBooks = function (topic) {
    const books = loadBooks()
    const foundBooks = books.filter((book) => (book.topic == topic))
    // const propsToRemove = ['topic', 'itemsInStock', 'cost']
    // foundBooks.forEach((book) => {
    //     propsToRemove.forEach((propName) => {
    //         delete book[propName]
    //     })
    // })
    return foundBooks
}

const infoBook = function (item_number) {
    const books = loadBooks()
    const foundBook = books.find((book) => (book.item_number == item_number))
    const propsToRemove = ['topic', 'item_number']

    // try {
    //     propsToRemove.forEach((propName) => {
    //         delete foundBook[propName]
    //     })
        return foundBook
    // } catch (error) {
        // return {}
    // }
}

const updateBook = (item_number, updates) => {
    books = loadBooks()
    books.forEach(book => {
        if (book.item_number == item_number) {
            if (updates.itemsInStock) {
                if (book.itemsInStock == 0 && updates.itemsInStock < 0)
                    throw new Error('No items in stock')
                book.itemsInStock += updates.itemsInStock
            }
            if (updates.cost) {
                if (updates.const < 0)
                    throw new Error('Invalid value')
                book.cost = updates.cost
            }
        }
    });
    saveBooks(books)

}

module.exports = {
    infoBook,
    loadBooks,
    saveBooks,
    searchBooks,
    updateBook

}
