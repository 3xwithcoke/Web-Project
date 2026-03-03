const request = require('supertest');
require('dotenv').config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}`;

describe("Search API", () => {
  it("should return search results for a valid query", async () => {
    const res = await request(BASE_URL)
      .get("/api/product/search") // Your backend endpoint
      .query({ keyword: "Cleanser" });

    // Expect 200 only if products exist
    if (res.statusCode === 200) {
      expect(Array.isArray(res.body.results)).toBe(true);
      if (res.body.results.length > 0) {
        expect(res.body.results[0]).toHaveProperty("product_id");
        expect(res.body.results[0]).toHaveProperty("name");
        expect(res.body.results[0]).toHaveProperty("price");
      }
    } else {
      // If your backend returns 404 when no products found
      expect(res.statusCode).toBe(404);
      expect(Array.isArray(res.body.results)).toBe(true);
      expect(res.body.results.length).toBe(0);
      expect(res.body.message).toMatch(/no products found/i);
    }
  });

  it("should return 404 for a query that does not exist", async () => {
    const uniqueQuery = `nonexistent${Date.now()}`;
    const res = await request(BASE_URL)
      .get("/api/product/search")
      .query({ keyword: uniqueQuery });

    expect(res.statusCode).toBe(404); // Adjusted for your controller
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBe(0);
    expect(res.body.message).toMatch(/no products found/i);
  });

  it("should fail if keyword is missing", async () => {
    const res = await request(BASE_URL)
      .get("/api/product/search"); // no query param

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/keyword is required/i);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBe(0);
  });
});