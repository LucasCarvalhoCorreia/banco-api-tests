const request = require('supertest');
const { expect } = require('chai');
require('dotenv').config();

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        it('Deve retornar sucesso com 201 quando o valor da transferencia for igual ou acima de 10 reais', async () => {
            // Capturar o token
            const respostaToken = await request(process.env.BASE_URL)
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    "username": 'julio.lima',
                    "senha": '123456'
                });

            const token = respostaToken.body.token;

            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 10.10,
                    token: ""
                });

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('message', 'Transferência realizada com sucesso.');
        });

        it('Deve retornar falha com 422 quando o valor da transferencia for abaixo de 10 reais', async () => {
            // Capturar o token
            const respostaToken = await request('http://localhost:3000')
                .post('/login')
                .set('Content-Type', 'application/json')
                .send({
                    "username": 'julio.lima',
                    "senha": '123456'
                });

            const token = respostaToken.body.token;

            const resposta = await request('http://localhost:3000')
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    contaOrigem: 1,
                    contaDestino: 2,
                    valor: 9.99,
                    token: ""
                });

            expect(resposta.status).to.equal(422);
            expect(resposta.body).to.have.property('error', 'O valor da transferência deve ser maior ou igual a R$10,00.');
        });
    });
});
