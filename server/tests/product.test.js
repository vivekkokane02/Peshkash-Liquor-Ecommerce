import request from 'supertest';
import { createApp } from '../src/app.js';
import { Product } from '../src/models/Product.js';
import './setup.js';

const app = createApp();

const validProduct = {
  name: 'Test Reserve Whisky',
  batch: 'No. 999',
  category: 'Single Malt Whisky',
  price: 4999,
  volume: '750ml',
  abv: '43%',
  color: '#C9822B',
  image: 'https://example.com/bottle.jpg',
  description: 'A test bottle for CRUD verification.',
};

describe('POST /api/products (Create)', () => {
  test('creates a product with valid data', async () => {
    const res = await request(app).post('/api/products').send(validProduct);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe(validProduct.name);
    expect(res.body.data.id).toBeDefined();
  });

  test('rejects creation with missing required fields', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Incomplete' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  test('rejects an invalid category', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ ...validProduct, category: 'Not A Real Category' });
    expect(res.status).toBe(422);
  });

  test('rejects a negative price', async () => {
    const res = await request(app).post('/api/products').send({ ...validProduct, price: -5 });
    expect(res.status).toBe(422);
  });
});

describe('GET /api/products (List)', () => {
  beforeEach(async () => {
    await Product.create([
      validProduct,
      { ...validProduct, name: 'Second Bottle', category: 'Vodka' },
    ]);
  });

  test('returns paginated products', async () => {
    const res = await request(app).get('/api/products?page=1&limit=1');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.meta.total).toBe(2);
    expect(res.body.meta.totalPages).toBe(2);
  });

  test('filters by category', async () => {
    const res = await request(app).get('/api/products?category=Vodka');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe('Vodka');
  });
});

describe('GET /api/products/:id (Read one)', () => {
  test('returns a single product', async () => {
    const created = await Product.create(validProduct);
    const res = await request(app).get(`/api/products/${created._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(created._id.toString());
  });

  test('returns 400 for a malformed id', async () => {
    const res = await request(app).get('/api/products/not-a-valid-id');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ID');
  });

  test('returns 404 for a well-formed but missing id', async () => {
    const res = await request(app).get('/api/products/64b6f1a1a1a1a1a1a1a1a1a1');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
  });
});

describe('PATCH /api/products/:id (Update)', () => {
  test('updates a product with valid data', async () => {
    const created = await Product.create(validProduct);
    const res = await request(app)
      .patch(`/api/products/${created._id}`)
      .send({ price: 5299 });
    expect(res.status).toBe(200);
    expect(res.body.data.price).toBe(5299);
  });

  test('rejects an update with an invalid field value', async () => {
    const created = await Product.create(validProduct);
    const res = await request(app)
      .patch(`/api/products/${created._id}`)
      .send({ price: -1 });
    expect(res.status).toBe(422);
  });

  test('returns 404 when updating a missing product', async () => {
    const res = await request(app)
      .patch('/api/products/64b6f1a1a1a1a1a1a1a1a1a1')
      .send({ price: 100 });
    expect(res.status).toBe(404);
  });
});

describe('DELETE /api/products/:id (Delete)', () => {
  test('soft-deletes an existing product', async () => {
    const created = await Product.create(validProduct);
    const res = await request(app).delete(`/api/products/${created._id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const stillFetchable = await request(app).get(`/api/products/${created._id}`);
    expect(stillFetchable.status).toBe(404);

    const raw = await Product.findById(created._id);
    expect(raw.isActive).toBe(false); // record still exists in DB
  });

  test('returns 404 when deleting a missing product', async () => {
    const res = await request(app).delete('/api/products/64b6f1a1a1a1a1a1a1a1a1a1');
    expect(res.status).toBe(404);
  });
});

describe('GET /health', () => {
  test('reports OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('GET /', () => {
  test('reports that the API is running', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.api).toBe('/api');
  });
});

describe('GET /api', () => {
  test('reports the API entry point', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toBe('/api/products');
  });
});
