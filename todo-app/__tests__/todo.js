/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
const request = require("supertest");

const db = require("../models/index");
const app = require("../app");

let server, agent;

describe("Todo test suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });
  afterAll(async () => {
    await db.sequelize.close();
    server.close();
  });

  test("responds with json at /todos", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    expect(response.statusCode).toBe(200);
    expect(response.header["content-type"]).toBe(
      "application/json; charset=utf-8"
    );
    const parsedResponse = JSON.parse(response.text);
    expect(parsedResponse.id).toBeDefined();
  });

  test("Fetches the list all todos", async () => {
    await agent.post("/todos").send({
      title: "Go to gym",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    await agent.post("/todos").send({
      title: "Go to shopping",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const response = await agent.get("/todos");
    const parsedResponse = JSON.parse(response.text);

    expect(parsedResponse.length).toBe(3);
    expect(parsedResponse[2].title).toBe("Go to shopping");
  });

  test("Deletes a todo with the given ID", async () => {
    const response = await agent.post("/todos").send({
      title: "Call Aryan",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    const deleteTodoResponse = await agent.delete(`/todos/${todoID}`).send();
    const parsedDeleteResponse = JSON.parse(deleteTodoResponse.text);
    expect(parsedDeleteResponse).toBe(true);

    const deleteFakeTodoResponse = await agent.delete(`/todos/9999`).send();
    const parsedDeleteFakeTodoResponse = JSON.parse(
      deleteFakeTodoResponse.text
    );
    expect(parsedDeleteFakeTodoResponse).toBe(false);
  });

  test("Mark a todo as complete", async () => {
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
    });
    const parsedResponse = JSON.parse(response.text);
    const todoID = parsedResponse.id;

    expect(parsedResponse.completed).toBe(false);

    const markAsCompletedResponse = await agent
      .put(`/todos/${todoID}/markAsCompleted`)
      .send();
    const parsedUpdateResponse = JSON.parse(markAsCompletedResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });
});
