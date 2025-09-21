const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('../helpers/autenticacao');
require('dotenv').config();
const postTransferencias = require('../fixtures/postTransferencias.json');

describe('Transferencias', () => {
    describe('POST /transferencias', () => {
        let token;
        
        beforeEach(async () => {
            // Configurar o ambiente antes de cada teste, se necessário
            token = await obterToken('julio.lima', '123456');
        });

        it('Deve retornar sucesso com 201 quando o valor da transferencia for igual ou acima de 10 reais', async () => {
            const bodyTransferencias = { ...postTransferencias };  

            // Capturar o token
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(201);
            expect(resposta.body).to.have.property('message', 'Transferência realizada com sucesso.');
        });

        it('Deve retornar falha com 422 quando o valor da transferencia for abaixo de 10 reais', async () => {
            const bodyTransferencias = { ...postTransferencias }; 
            bodyTransferencias.valor = 9.99;

            // Capturar o token
            const resposta = await request(process.env.BASE_URL)
                .post('/transferencias')
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(bodyTransferencias);

            expect(resposta.status).to.equal(422);
            expect(resposta.body).to.have.property('error', 'O valor da transferência deve ser maior ou igual a R$10,00.');
        });
    });
});
