const express = require('express')
const request = require('request')

const orders = require('./orders')

var app = express()
const port = 3000
var catalogIP = 'http://catalog:3000/'
app.use(express.json())

app.post('/purchase/:item_number', (req, res) => {
    var item_number = req.params.item_number
    var clientServerOptions = {
        uri: catalogIP + 'info/' + item_number,
        body: '',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    request(clientServerOptions, (error, infoResponse) => {
        if (infoResponse && infoResponse.statusCode == 200) {
            clientServerOptions = {
                uri: catalogIP + 'update/' + item_number,
                body: JSON.stringify({ itemsInStock: -1 }),
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            request(clientServerOptions, (error, UpdateResponse) => {
                if (UpdateResponse.statusCode == 200) {
                    res.send({ orderID: orders.addOrder(item_number) })
                } else {
                    res.status(400).send()
                }
            })

        }
        else {
            res.status(400).send()
        }
    });
})

app.listen(port, () => {
    console.log('Server has started at port ', port)
})

