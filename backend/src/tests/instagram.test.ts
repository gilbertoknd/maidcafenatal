import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { StorageProvider } from "../utils/StorageProvider.js";

// Mock the database pool
vi.mock("../config/db", () => ({
  pool: {
    query: vi.fn(),
    connect: vi.fn(),
  },
}));

// Mock StorageProvider
vi.mock("../utils/StorageProvider.js", () => ({
  StorageProvider: {
    deleteFile: vi.fn(),
  },
}));

// Mock jwt
vi.mock("jsonwebtoken");

describe("Instagram Routes", () => {
  const validToken = "Bearer valid-token";
  const invalidToken = "Bearer invalid-token";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "segredo";
  });

  describe("Security (Authentication)", () => {
    it("should return 401 if token is missing on admin routes", async () => {
      const routes = [
        { method: "get", path: "/api/instagram/admin" },
        { method: "post", path: "/api/instagram" },
        { method: "put", path: "/api/instagram/1" },
        { method: "delete", path: "/api/instagram/1" },
      ];

      for (const route of routes) {
        const response = await (request(app) as any)[route.method](route.path);
        expect(response.status).toBe(401);
      }
    });

    it("should return 401 if token is invalid", async () => {
      (jwt.verify as any).mockImplementation(() => {
        throw new Error("Invalid");
      });

      const response = await request(app)
        .get("/api/instagram/admin")
        .set("Authorization", invalidToken);
      
      expect(response.status).toBe(401);
    });

    it("should allow access with valid token", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get("/api/instagram/admin")
        .set("Authorization", validToken);

      expect(response.status).toBe(200);
    });
  });

  describe("Public Routes", () => {
    it("should return visible instagram posts", async () => {
      const mockPosts = [{ id: 1, imagem_url: "/images/ig1.jpg", link_url: "instagr.am/1", visivel: true }];
      (pool.query as any).mockResolvedValue({ rows: mockPosts });

      const response = await request(app).get("/api/instagram");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPosts);
    });
  });

  describe("Admin CRUD", () => {
    it("should create a post and save image", async () => {
      (jwt.verify as any).mockReturnValue({ id: 1 });
      (pool.query as any).mockResolvedValue({ rows: [{ id: 1, link_url: "link" }] });

      const response = await request(app)
        .post("/api/instagram")
        .set("Authorization", validToken)
        .attach("imagem", Buffer.from("fake-img"), "post.jpg")
        .field("link_url", "https://instagram.com/p/test");

      expect(response.status).toBe(201);
      expect(pool.query).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO instagram_posts"), expect.anything());
    });

    it("should delete post and remove file from disk", async () => {
        (jwt.verify as any).mockReturnValue({ id: 1 });
        const mockPost = { id: 1, imagem_url: "/images/to_delete.jpg" };
        (pool.query as any).mockResolvedValueOnce({ rows: [mockPost] }); // getPostById
        (pool.query as any).mockResolvedValueOnce({ rowCount: 1 }); // delete

        const response = await request(app)
          .delete("/api/instagram/1")
          .set("Authorization", validToken);
  
        expect(response.status).toBe(200);
        expect(StorageProvider.deleteFile).toHaveBeenCalledWith("to_delete.jpg");
      });
  });
});
