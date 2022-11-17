const { pool } = require("../config/bd");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const realizarLogin = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        res.status(400).json({ mensagem: "E-mail e senha são obrigatórios" });
    }

    try {
        const query = `SELECT * FROM usuarios WHERE email = $1`;
        const { rows, rowCount } = await pool.query(query, [email]);

        if (rowCount <= 0) {
            return res.status(400).json({ mensagem: "E-mail ou senha inválidos" });
        }

        const usuarioEncontrado = rows[0];

        const senhaConfere = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaConfere) {
            return res.status(400).json({ mensagem: "E-mail ou senha inválidos" });
        }

        const token = jwt.sign({ id: usuarioEncontrado.id }, 't08', { expiresIn: '1h' });

        const { senha: _, ...dadosUsuarioEncontrado } = usuarioEncontrado;

        res.status(200).json({ usuario: dadosUsuarioEncontrado, token });
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno do servido" });
    }
}

module.exports = {
    realizarLogin,
}