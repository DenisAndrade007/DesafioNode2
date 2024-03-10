// index.js

// Importação dos módulos necessários
const express = require('express');
const { v4: uuidv4 } = require('uuid');

// Inicialização do aplicativo Express
const app = express();

// Permitir que o Express entenda requisições JSON
app.use(express.json());

// Array para armazenar os pedidos
let orders = [];

// Middleware para logar as requisições
app.use((req, res, next) => {
    console.log(`[${req.method}] - ${req.url}`); // Uso correto de template strings
    next();
});

// Middleware para verificar a existência do ID
function checkOrderId(req, res, next) {
    const { id } = req.params;
    const order = orders.find(order => order.id === id);

    if (!order) {
        return res.status(404).json({ error: "Pedido não encontrado" });
    }

    req.order = order;
    next();
}

// Rota POST para criar um novo pedido
app.post('/order', (req, res) => {
    const { order, clientName, price } = req.body;

    const newOrder = {
        id: uuidv4(),
        order,
        clientName,
        price,
        status: "Em preparação"
    };

    orders.push(newOrder);

    res.status(201).json(newOrder);
});

// Rota GET para listar todos os pedidos
app.get('/order', (req, res) => {
    res.json(orders);
});

// Rota PUT para alterar um pedido
app.put('/order/:id', checkOrderId, (req, res) => {
    const { order, clientName, price } = req.body;
    const foundOrder = req.order;

    foundOrder.order = order || foundOrder.order;
    foundOrder.clientName = clientName || foundOrder.clientName;
    foundOrder.price = price || foundOrder.price;

    res.json(foundOrder);
});

// Rota DELETE para deletar um pedido
app.delete('/order/:id', checkOrderId, (req, res) => {
    const { id } = req.params;
    orders = orders.filter(order => order.id !== id);

    res.status(204).send(); // Correção aplicada aqui
});

// Rota GET para retornar um pedido específico
app.get('/order/:id', checkOrderId, (req, res) => {
    res.json(req.order);
});

// Rota PATCH para alterar o status de um pedido para "Pronto"
app.patch('/order/:id', checkOrderId, (req, res) => {
    req.order.status = "Pronto";
    res.json(req.order);
});

// Definindo a porta e iniciando o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`); // Uso correto de template strings para log
});