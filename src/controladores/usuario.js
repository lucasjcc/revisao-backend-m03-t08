const { pool } = require("../config/bd");
const bcrypt = require("bcrypt");

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: "Os campos nome, e-mail e senha são obrigatórios" });
    }

    try {
        const queryConsulta = `SELECT * FROM usuarios WHERE email = $1`
        const { rowCount: quantidadeEmailCadastrado } = await pool.query(queryConsulta, [email]);

        if (quantidadeEmailCadastrado) {
            return res.status(400).json({ mensagem: "Email ou senha incorretos" });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);
        const queryCadastro = `INSERT INTO usuarios
            (nome, email, senha)
            VALUES
            ($1, $2, $3) returning *`
        const { rows: usuariosCadastrados, rowCount } = await pool.query(queryCadastro, [nome, email, senhaCriptografada]);

        if (!rowCount) {
            return res.status(500).json({ mensagem: "Erro interno no servidor" });
        }
        const { senha: _, ...usuarioCadastrado } = usuariosCadastrados[0];
        return res.status(201).json(usuarioCadastrado);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

module.exports = {
    cadastrarUsuario,
}
