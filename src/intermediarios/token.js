const jwt = require("jsonwebtoken");
const { pool } = require("../config/bd");

const validarToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401).json({ mensagem: "Não autorizado" });
    }

    try {
        const token = authorization.split(" ")[1];
        const { id } = jwt.verify(token, 't08');
        const query = `SELECT * FROM usuarios WHERE id = $1`;
        const { rows, rowCount } = await pool.query(query, [id]);

        if (!rowCount) {
            return res.status(401).json({ mensagem: "Não autorizado" });
        }

        const { senha: _, ...dadosUsuarioCadastrado } = rows[0];
        req.usuarioLogado = dadosUsuarioCadastrado;
        return next();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servido" });
    }

}

module.exports = {
    validarToken,
}
