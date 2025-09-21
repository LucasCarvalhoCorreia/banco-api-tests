const request = require('supertest');
const postLogin = require('../fixtures/postLogin.json');

const obterToken = async (usuario, senha) => {
    // Lógica para obter e retornar o token de autenticação
    const bodyLogin = { ...postLogin };  

    const respostaToken = await request(process.env.BASE_URL)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(bodyLogin);
    
    return respostaToken.body.token;
}

module.exports = { obterToken };