const { pool } = require("../config/bd");

const exibirGastos = async (req, res) => {
    const { usuarioLogado } = req;
    try {
        const query = `SELECT * FROM gastos WHERE gastos.id_usuario = $1`;
        const { rows: dados, rowCount } = await pool.query(query, [usuarioLogado.id]);
        return res.json(dados);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ menssagem: "Erro interno no servidor" });
    }
}

const detalharGasto = async (req, res) => {
    const { id } = req.params;
    const { usuarioLogado } = req;

    try {
        const query = `SELECT * FROM gastos WHERE id = $1 AND id_usuario = $2`;
        const { rows, rowCount } = await pool.query(query, [id, usuarioLogado.id]);

        if (!rowCount) {
            return res.status(404).json({ mensagem: "Gasto não encontrado" });
        }

        const gastoEncontrado = rows[0];

        return res.json(gastoEncontrado);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

const atualizarGasto = async (req, res) => {
    const { usuarioLogado } = req;
    const { id } = req.params;
    const { preco, descricao } = req.body;

    if (!preco) {
        return res.status(400).json({ mensagem: "O campo preço é obrigatório" });
    }

    if (preco <= 0) {
        return res.status(403).json({ mensagem: "Não é permitido cadastro deste valor" });
    }

    try {
        const queryEncontrarGasto = `SELECT * FROM gastos WHERE id_usuario = $1 AND id = $2`;
        const gastosEncontrados = await pool.query(queryEncontrarGasto, [usuarioLogado.id, id]);

        if (!gastosEncontrados.rowCount) {
            return res.status(404).json({ mensagem: "Gasto não encontrado" });
        }

        const queryAtualizar = `UPDATE gastos 
            SET id_usuario = $1, preco = $2, descricao = $3 
            WHERE id_usuario = $1 AND id = $4`;
        const parametrosAtualizacao = [usuarioLogado.id, preco, descricao, id];
        await pool.query(queryAtualizar, parametrosAtualizacao);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

const excluirGasto = async (req, res) => {
    const { usuarioLogado } = req;
    const { id } = req.params;

    try {
        const queryEncontrarGasto = `SELECT * FROM gastos WHERE id_usuario = $1 AND id = $2`;
        const gastosEncontrados = await pool.query(queryEncontrarGasto, [usuarioLogado.id, id]);

        if (!gastosEncontrados.rowCount) {
            return res.status(404).json({ menssagem: "Gasto não encontrado" });
        }

        const queryExcluir = `DELETE FROM gastos WHERE id = $1`;
        await pool.query(queryExcluir, [id]);
        return res.status(204).send();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

module.exports = {
    exibirGastos,
    detalharGasto,
    atualizarGasto,
    excluirGasto,
}