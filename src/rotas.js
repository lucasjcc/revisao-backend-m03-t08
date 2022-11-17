const express = require('express');
const { exibirGastos, detalharGasto, atualizarGasto, excluirGasto } = require('./controladores/gasto');
const { realizarLogin } = require('./controladores/login');
const { cadastrarUsuario } = require('./controladores/usuario');
const { validarToken } = require('./intermediarios/token');
const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', realizarLogin);

rotas.use(validarToken);

rotas.get('/gastos', exibirGastos);
rotas.get('/gastos/:id', detalharGasto);
rotas.put('/gastos/:id', atualizarGasto);
rotas.delete('/gastos/:id', excluirGasto);

module.exports = {
    rotas,
}