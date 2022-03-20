const express = require('express')
const books = require('./books')

console.log(books.searchBooks('Distributed systems'));
console.log(books.infoBook(3))