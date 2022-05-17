const express = require('express')
const books = require('./books')

var app = express()
const port = 3000

app.use(express.json())

app.get('/search/:topic', (req, res) => {
    var topic = req.params.topic
    res.send(books.searchBooks(topic))
})

app.get('/info/:item_number', (req, res) => {
    console.log('cat1')

    var item_number = req.params.item_number
    const book = books.infoBook(item_number)
    if (!book.title) {
        res.status(404).send()
    }
    else {
        res.send(book)
    }
})

app.put('/update/:item_number', (req, res) => {
    var item_number = req.params.item_number
    var updates = req.body
    var temp = Object.keys(updates)
    temp = temp.filter((update) => (update != 'cost' && update != 'itemsInStock'))
    if (temp.length > 0) {
        console.log(temp)
        res.status(400).send()
    } else {
        books.updateBook(item_number, updates)
        res.send()
    }
})

app.listen(port, () => {
    console.log('Server has started at port ', port)
})
