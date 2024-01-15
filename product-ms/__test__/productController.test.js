const request = require('supertest');
const express = require('express');
const app = express();
const routes = require("../Controllers/ProductController");



jest.mock('../Models/ProductModel', () => ({
  find: jest.fn(),
}));

app.use('/', routes);

describe('GET /Products', () => {
  it('should retrieve a list of products', async () => {
    const mockProducts = [
      { id: 1, title: 'Product 1' },
      { id: 2, title: 'Product 2' },
    ];

    require('../Models/ProductModel').find.mockResolvedValue(mockProducts);

    const response = await request(app).get('/Products');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts);
  });
});

describe('GET /Products/:id', () => {
  it('should retrieve a product by ID', async () => {
    const productId = 1;
    const mockProduct = { id: productId, title: 'Product 1' };

    require('../Models/ProductModel').find.mockResolvedValue([mockProduct]);

    const response = await request(app).get(`/Products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProduct);
  });

  it('should handle invalid product ID', async () => {
    const invalidProductId = 'invalid';

    const response = await request(app).get(`/Products/${invalidProductId}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Produit ID invalide' });
  });
});