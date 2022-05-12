const express = require('express')
const request = require('request')
const { SequentialRoundRobin } = require('round-robin-js');
var app = express()

const NodeCache = require("node-cache");
const infoCache = new NodeCache();
const searchCache = new NodeCache();
const port = 3000

var catalogIP = 'http://catalog:3000'
var orderIP = 'http://order:3000'
var catalog2IP = 'http://catalog2:3001'
var order2IP = 'http://order2:3001'

const catalogServers = new SequentialRoundRobin([catalogIP, catalog2IP]);
const orderServers = new SequentialRoundRobin([orderIP, order2IP]);

app.use(express.json())

const verifyCache = (req, res, next) => {
    const type = require('url').parse(req.url).pathname.substring(1);
    console.log(type)

    try {
        if (type === `search/${req.params.topic}` && searchCache.has(req.params.topic)) {
            console.log('A topic found')
            return res.status(200).json(JSON.parse(searchCache.get(req.params.topic)));
        }
        else if (type === `info/${req.params.item_number}` && infoCache.has(req.params.item_number)) {
            console.log('An item found')
            return res.status(200).json(JSON.parse(infoCache.get(req.params.item_number)));
        }
        return next();
    } catch (err) {
        throw new Error(err);
    }
};

app.post('/purchase/:item_number', (req, res) => {
    var orderForwardOptions = {
        uri: orderServers.next().value + req.url,
        body: JSON.stringify(req.body),
        method: req.method,
        headers: {
            'Content-Type': req.headers['content-type']
        }
    }
    request(orderForwardOptions, (error, response) => {
        if (error) {
            console.log(error);
        }
        infoCache.del(JSON.parse(response.body).infoResponse.item_number)
        searchCache.del(JSON.parse(response.body).infoResponse.topic)
        res.status(response.statusCode).send(response.body)
    })
})


app.all('/search/:topic', verifyCache, (req, res) => {
    var catalogForwardOptions = {
        uri: catalogServers.next().value + req.url,
        body: JSON.stringify(req.body),
        method: req.method,
        headers: {
            'Content-Type': req.headers['content-type']
        }
    }
    request(catalogForwardOptions, (error, response) => {
        if (error) {
            console.log(error);
        }
        const topic = req.params.topic;
        searchCache.set(topic, JSON.parse(response).body);
        res.status(response.statusCode).send(response.body)
    })
})


app.all('/info/:item_number', verifyCache, (req, res) => {
    var catalogForwardOptions = {
        uri: catalogServers.next().value + req.url,
        body: JSON.stringify(req.body),
        method: req.method,
        headers: {
            'Content-Type': req.headers['content-type']
        }
    }
    request(catalogForwardOptions, (error, response) => {
        if (error) {
            console.log(error);
        }
        const id = req.params.item_number;

        infoCache.set(id, response.body);
        console.log('1', response.body)
        // console.log('11', JSON.parse(response).body)
        console.log(infoCache.get(id))
        res.status(response.statusCode).send(response.body)
    })
})

app.listen(port, () => {
    console.log('Server has started at port ', port)
})
