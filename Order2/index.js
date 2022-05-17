const express = require('express')
const request = require('request')

const orders = require('./orders')

var app = express()
const port = 3001
var catalogIP = 'http://catalog:3000/'
var catalog2IP = 'http://catalog2:3001/'
var orderIP = 'http://order:3000/'

app.use(express.json())


app.post('/addOrder/:item_number', (req, res) => {
    var item_number = req.params.item_number
    res.send({ orderID: orders.addOrder(item_number) })
});


app.post('/purchase/:item_number', (req, res) => {
    console.log('ord2')

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
                    clientServerOptions.uri = catalog2IP + 'update/' + item_number;
                    request(clientServerOptions, (error, UpdateResponse) => {

                        if (UpdateResponse.statusCode == 200) {
                            const orderRequest = {
                                uri: orderIP + 'addOrder/' + item_number,
                                body: '',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }
                            request(orderRequest, (error, UpdateResponse) => {
                                if (UpdateResponse.statusCode == 200) {
                                    res.send({ orderID: orders.addOrder(item_number), infoResponse: JSON.parse(infoResponse.body) })
                                } else {
                                    res.status(400).send()
                                }
                            })
                        } else {
                            res.status(400).send()
                        }
                    })
                }
                else {
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

