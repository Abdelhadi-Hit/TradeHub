const request = require('supertest');
const express = require('express');
const axios = require('axios');
const app = express();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const paiementRouter = require('../Controllers/PaymentController');

let mongoServer;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

app.use(express.json());
app.use('/', paiementRouter);

jest.mock('axios');

describe('Paiement API', () => {
    it('should create a new Paiement', async () => {
        const paiementData = {
            idCommande: 'commande123',
            montant: 100,
            numeroCarte: 1234567890,
        };

        axios.get.mockResolvedValue({
            data: {
                productId: 1,
                dateCommande: new Date(),
                quantite: 5,
                commandePayee: false,
            }
        });
        axios.put.mockResolvedValue({ status: 200 });

        const response = await request(app)
            .post('/payments')
            .send(paiementData);

        expect(response.status).toBe(201);
        expect(response.body.idCommande).toBe(paiementData.idCommande);
    });

    it('should return a 409 error if the command is already paid', async () => {
        const paiementData = {
            idCommande: 'commande123',
            montant: 100,
            numeroCarte: 1234567890,
        };

        const response = await request(app)
            .post('/payments')
            .send(paiementData);

        expect(response.status).toBe(409);
    });
});