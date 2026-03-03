const request = require("supertest");
require("dotenv").config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("GET /api/product/relatedproducts", () => {
  it("should return related products excluding current product", async () => {
    const res = await request(BASE_URL)
      .get("/api/product/relatedproducts")
      .query({
        id: 1,
        category: "Lipstick",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.products)).toBe(true);

    res.body.products.forEach(product => {
      expect(product.category).toBe("Lipstick");
      expect(product.product_id).not.toBe(1);
    });
  });

  it("should return 400 if id is missing", async () => {
  const res = await request(BASE_URL)
    .get("/api/product/relatedproducts")
    .query({ category: "Lipstick" });

  expect(res.statusCode).toBe(400);
});

it("should return empty array if no related products exist", async () => {
  const res = await request(BASE_URL)
    .get("/api/product/relatedproducts")
    .query({ id: 9999, category: "NonExisting" });

  expect(res.statusCode).toBe(200);
  expect(res.body.products.length).toBe(0);
});


});
