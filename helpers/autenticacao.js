const request = require('supertest');

const obterToken = async (usuario, senha) => {
    // Lógica para obter e retornar o token de autenticação
    const respostaToken = await request(process.env.BASE_URL)
                    .post('/login')
                    .set('Content-Type', 'application/json')
                    .send({
                        "username": usuario,
                        "senha": senha
                    });
    
                return respostaToken.body.token;
}

module.exports = { obterToken };