import MongodbMemoryServer from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import User from "./user.model";

describe("/api/auth (users) tests", () => {
	const mongod = new MongodbMemoryServer();

	beforeAll(async () => {
		const uri = await mongod.getConnectionString();
		await mongoose.connect(uri, { useNewUrlParser: true });
	});

	afterAll(async () => {
		await mongoose.disconnect();
		await mongod.stop();
	});

	afterEach(async () => {
		await User.remove({});
	});

	it("should register user", async () => {
		const postResponse = await request(app).post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: "password"
		});
		expect(postResponse.status).toBe(200);
		expect(postResponse.body.status).toBe(true);
	});

	it("should not register user - empty or no password", async () => {
		const postResponse1 = await request(app).post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: "",
		});
		expect(postResponse1.status).toBe(422);
		expect(postResponse1.body.status).toBe(false);

		const postResponse2 = await request(app).post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: undefined,
		});
		expect(postResponse2.status).toBe(422);
		expect(postResponse2.body.status).toBe(false);
	});

	it("should login user", async () => {
		const postResponse1 = await request(app).post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: "password"
		});
		expect(postResponse1.status).toBe(200);
		expect(postResponse1.body.status).toBe(true);

		const postResponse2 = await request(app).post("/api/auth/login").send({
			email: "test@test.com",
			password: "password"
		});
		expect(postResponse2.status).toBe(200);
		expect(postResponse2.body.status).toBe(true);
	});

	it("should not login user - wrong password", async () => {
		const postResponse1 = await request(app).post("/api/auth/login").send({
			email: "test@test.com",
			password: "password"
		});
		expect(postResponse1.status).toBe(401);
	});

	it("should not login user - no email", async () => {
		const postResponse1 = await request(app).post("/api/auth/login").send({
			password: "password"
		});
		expect(postResponse1.status).toBe(400);
	});

	it("should not login user - no password", async () => {
		const postResponse1 = await request(app).post("/api/auth/login").send({
			email: "test@test.com"
		});
		expect(postResponse1.status).toBe(400);
	});

	it("get user profile", async () => {
		const req_agent = request.agent(app);

		const postResponse1 = await req_agent.post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: "password"
		});
		expect(postResponse1.status).toBe(200);
		expect(postResponse1.body.status).toBe(true);

		const postResponse2 = await req_agent.get("/api/auth/user").send();
		expect(postResponse2.status).toBe(200);
		expect(postResponse2.body.status).toBe(true);
	});

	it("get user profile should not work - unauthenticated", async () => {
		const postResponse1 = await request(app).get("/api/auth/user").send();
		expect(postResponse1.status).toBe(401);
		expect(postResponse1.body.status).toBe(false);
	});

	it("logout user should not work - unauthenticated", async () => {
		const postResponse1 = await request(app).get("/api/auth/logout").send();
		expect(postResponse1.status).toBe(401);
		expect(postResponse1.body.status).toBe(false);
	});

	it("logout user", async () => {
		const req_agent = request.agent(app);

		const postResponse1 = await req_agent.post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: "password"
		});
		expect(postResponse1.status).toBe(200);
		expect(postResponse1.body.status).toBe(true);

		const postResponse2 = await req_agent.get("/api/auth/logout").send();
		expect(postResponse2.status).toBe(200);
		expect(postResponse2.body.status).toBe(true);
	});

	it("get user profile should not work after logout", async () => {
		const req_agent = request.agent(app);

		const postResponse1 = await req_agent.post("/api/auth/register").send({
			firstName: "test",
			lastName: "test",
			email: "test@test.com",
			role: "user",
			password: "password"
		});
		expect(postResponse1.status).toBe(200);
		expect(postResponse1.body.status).toBe(true);

		const postResponse2 = await req_agent.get("/api/auth/logout").send();
		expect(postResponse2.status).toBe(200);
		expect(postResponse2.body.status).toBe(true);

		const postResponse3 = await req_agent.get("/api/auth/logout").send();
		expect(postResponse3.status).toBe(401);
		expect(postResponse3.body.status).toBe(false);
	});
});
