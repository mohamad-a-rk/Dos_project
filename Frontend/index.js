const express = require('express')
const request = require('request')

var app = express()
const port = 5000

var catalogIP = 'http://localhost:3000'
var orderIP = 'http://localhost:4000'

app.use(express.json())


app.post('/purchase/:item_number', (req, res) => {
    res.redirect(307, orderIP + '/purchase/' + req.params.item_number)
})

app.all('*', (req, res) => {

    var catalogForwardOptions = {
        uri: catalogIP + req.url,
        body: req.body.toString(),
        method: req.method,
        headers: {
            'Content-Type': req.headers['content-type']
        }
    }
    request(catalogForwardOptions, (error, response) => {
        if (error) {
            console.log(error);
        }
        res.status(response.statusCode).send(response.body)
    })
})

app.listen(port, () => {
    console.log('Server has started at port ', port)
})
