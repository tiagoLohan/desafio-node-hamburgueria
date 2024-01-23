const express = require("express")
const uuid = require("uuid")
const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkId = (req, res, next) => {     // Middleware para checar se o ID é válido
    const { id } = req.params
    const index = orders.findIndex( order => order.id === id)

    if(index < 0) {
        return res.status(404).json({ error: "Order not found"})
    }

    req.orderIndex = index

    next()
}

const checkMetUrl = (req, res, next) => {       // Meddlewares para mostrar o método e a url da rota.
    console.log(`O método dessa rota é ${req.method} e a url é ${req.url}`)

    next()
}


app.post("/order", checkMetUrl, (req, res) => {                          // Rota para criar um pedido.
    const { order, clienteName, price, status } = req.body

    const newOrder = { id: uuid.v4(), order, clienteName, price, status }

    orders.push(newOrder)

    return res.status(201).json(newOrder)
})

app.get("/order", checkMetUrl, (req, res) => {             // Rota para mostrar todos os pedidos feitos.
    return res.status(200).json(orders)
})

app.put("/order/:id", checkId, checkMetUrl, (req, res) => {         // Rota para editar algum dado do pedido.
    const { id } = req.params
    const { order, clienteName, price, status } = req.body
    const index = req.orderIndex

    // const index = orders.findIndex( order => order.id === id)

    // if(index < 0) {
    //     return res.status(404).json({ error: "Order not found"})
    // }

    const editOrder = { id, order, clienteName, price, status }

    orders[index] = editOrder

    return res.json(editOrder)
})

app.delete("/order/:id", checkId, checkMetUrl, (req, res) => {      // Rota para excluir um pedido.
    const { id } = req.params
    const index = req.orderIndex

    // const index = orders.findIndex( order => order.id === id)

    // if(index < 0) {
    //     return res.status(404).json({ error: "Order not found"})
    // }

    orders.splice(index, 1)

    return res.status(204).json()
})

app.get("/order/:id", checkId, checkMetUrl, (req, res) => {        // Rota para mostrar um pedido específico.
    const { id } = req.params
    const index = req.orderIndex

    // const index = orders.findIndex( order => order.id === id)

    // if(index < 0) {
    //     return res.status(404).json({ error: "Order not found"})
    // }

    return res.json(orders[index])
})

app.patch("/order/:id", checkId, checkMetUrl, (req, res) => {    // Rota para alterar o status do pedido.
    const { id } = req.params
    const { status } = req.body
    const index = req.orderIndex

    // const index = orders.findIndex( order => order.id === id)

    // if(index < 0) {
    //     return res.status(404).json({ error: "Order not found"})
    // }

    const updateOrder = { id, order: orders[index].order, clienteName: orders[index].clienteName, price: orders[index].price, status}

    orders[index] = updateOrder

    return res.json(updateOrder)
})




app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port} 🚀`)
})