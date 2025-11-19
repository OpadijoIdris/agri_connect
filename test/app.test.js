import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../src/app.js";
import bcrypt from "bcrypt"
import User from "../src/model/usermodel.js";

describe("API Tests", () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
    });
    afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    await User.deleteMany({})
});
    
    it("should register a new user successfully", async () => {
        let user = {
            name: "user name",
            email: "user@gmail.com",
            password: "user password",
            phoneNumber: "8028383",
            location: "user location",
            role: "Farmer"
        }
        const res = await request(app).post("/api/auth/register")
        .send(user);

        expect(res.status).toBe(201);
        expect(res.body.name).toBe(user.name)
        expect(res.body.email).toBe(user.email)
        expect(res.body.phoneNumber).toBe(user.phoneNumber)
        expect(res.body.location).toBe(user.location)
        expect(res.body.role).toBe(user.role)
        expect(res.body.password).not.toBe(user.name)
    });


   it("should login successfully", async () => {
    const hashedPassword = await bcrypt.hash("userPassword", 10);
    await User.create({
        name: "Test User",
        email: "user@email.com",
        password: hashedPassword,
        phoneNumber: "09012345678",
        role: "Farmer",
        location: "Lagos"
    });

    let loginData = {
        email: "user@email.com",
        password: "userPassword"
    }
    const res = await request(app).post("/api/auth/login").send(loginData);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(loginData.email);
    expect(res.body).toHaveProperty("token");
   });

   describe("User CRUD operations", () => {
        let testUser;

        beforeEach(async () => {
            const user = {
                name: "CRUD User",
                email: "crud@example.com",
                password: "password",
                phoneNumber: "1234567890",
                location: "CRUD Location",
                role: "Buyer"
            };
            testUser = await User.create(user);
        });

        it("should get all users", async () => {
            const res = await request(app).get("/api/user");
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
        });

        it("should get a user by ID", async () => {
            const res = await request(app).get(`/api/user/${testUser._id}`);
            expect(res.status).toBe(200);
            expect(res.body.email).toBe(testUser.email);
        });

        it("should return 404 for non-existent user", async () => {
            const invalidId = new mongoose.Types.ObjectId();
            const res = await request(app).get(`/api/user/${invalidId}`);
            expect(res.status).toBe(404);
        });

        it("should update a user by ID", async () => {
            const updates = { name: "Updated Name" };
            const res = await request(app).put(`/api/user/${testUser._id}`).send(updates);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe("Updated Name");
        });

        it("should delete a user by ID", async () => {
            const res = await request(app).delete(`/api/user/${testUser._id}`);
            expect(res.status).toBe(200);
            const foundUser = await User.findById(testUser._id);
            expect(foundUser).toBeNull();
        });
   });

   it("should delete all users", async () => {
        await User.create({ name: "User 1", email: "u1@a.com", password: "p" });

        const res = await request(app).delete("/api/user/all");
        expect(res.status).toBe(200);

        const users = await User.find();
        expect(users.length).toBe(0);
   });

   it("should create a user via /api/user", async () => {
        const newUser = {
            name: "Direct Create",
            email: "direct@example.com",
            password: "password",
            phoneNumber: "5555555555",
            location: "Direct Location",
            role: "Farmer"
        };
        const res = await request(app).post("/api/user").send(newUser);
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(newUser.email);
   });
});



