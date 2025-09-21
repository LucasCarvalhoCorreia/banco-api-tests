const request = require('supertest');
const { expect } = require('chai');
const { obterToken } = require('../helpers/autenticacao');
require('dotenv').config();
const postTransferencias = require('../fixtures/postTransferencias.json');

describe('Transferencias', () => {
    let token;

    beforeEach(async () => {
        // Configurar o ambiente antes de cada teste, se necessário
        token = await obterToken('julio.lima', '123456');
    });

    describe('POST /transferencias', () => {
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

    describe('GET /transferencias', () => {
        it('Deve retornar sucesso com 200 e dados iguais ao registro de trandsferencia contido no banco de dados quando o id for valido', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias/17')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.id).to.equal(17);
            expect(resposta.body.id).to.be.a('number');
            expect(resposta.body.conta_origem_id).to.equal(1);
            expect(resposta.body.conta_destino_id).to.equal(2);
            expect(resposta.body.valor).to.equal(10.10);
        });
    });

    describe('GET /transferencias', () => {
        it('Deve retornar 10 elementos na paginação quando informar limite de 10 registros', async () => {
            const resposta = await request(process.env.BASE_URL)
                .get('/transferencias?page=1&limit=10')
                .set('Authorization', `Bearer ${token}`);

            expect(resposta.status).to.equal(200);
            expect(resposta.body.limit).to.equal(10);
            expect(resposta.body.transferencias).to.have.lengthOf(10);
        });
    });
});
