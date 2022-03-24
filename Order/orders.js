const fs = require('fs')

const loadOrders = function () {
    try {
        const dataBuffer = fs.readFileSync('order.csv')
        const notes = JSON.parse(dataBuffer.toString())
        return notes
    } catch (e) {
        return []
    }
}

const saveOrders = (orders) => {
    const data = JSON.stringify(orders)
    fs.writeFileSync('order.csv', data)
}

const addOrder = (item_number) => {
    var orders = loadOrders()
    var today = getFullDate()

    let myOrder = { id: generateAnID(), book: item_number, quantity: 1, date: today }
    orders.push(myOrder)
    saveOrders(orders)
    return myOrder.id
}

const getFullDate = () => {
    const date = new Date();
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const today = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + " " + dd + '/' + mm + '/' + yyyy;

    return today
}

const generateAnID = () => {
    const date = new Date()
    return date.getTime()
}

module.exports = {
    addOrder
}