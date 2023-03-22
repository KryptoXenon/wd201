/* eslint-disable */
const db = require("../models");

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Pass number of days as an integer");
  }
  const today = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  return new Date(today.getTime() + days * oneDay);
};

describe("todo.js tests", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("overdue() should return all tasks which are overdue", async () => {
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(-2),
      completed: false,
    });
    const items = await db.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("dueToday() should return all tasks that are due today", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(0),
      completed: false,
    });
    const items = await db.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  test("dueLater() should return all tasks due in future date", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo = await db.Todo.addTask({
      title: "This is a sample item",
      dueDate: getJSDate(2),
      completed: false,
    });
    const items = await db.Todo.dueLater();
    expect(items.length).toBe(dueLaterItems.length + 1);
  });

  test("markAsComplete() must change the completed parameter of the todo to true", async () => {
    const overdueItems = await db.Todo.overdue();
    const todo_a = overdueItems[0];
    expect(todo_a.completed).toBe(false);
    await db.Todo.markAsComplete(todo_a.id);
    await todo_a.reload();

    expect(todo_a.completed).toBe(true);
  });

  test("displayableString must return the todo list in a proper format", async () => {
    const overdueItems = await db.Todo.overdue();
    const todo_a = overdueItems[0];
    expect(todo_a.completed).toBe(true);
    const displayValue = todo_a.displayableString();
    expect(displayValue).toBe(
      `${todo_a.id}. [x] ${todo_a.title} ${todo_a.dueDate}`
    );
  });

  test("specific format for items due in future", async () => {
    const dueLaterItems = await db.Todo.dueLater();
    const todo_a = dueLaterItems[0];
    expect(todo_a.completed).toBe(false);
    const displayValue = todo_a.displayableString();
    expect(displayValue).toBe(
      `${todo_a.id}. [ ] ${todo_a.title} ${todo_a.dueDate}`
    );
  });

  test("specific format for incomplete items due today", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo_a = dueTodayItems[0];
    expect(todo_a.completed).toBe(false);
    const displayValue = todo_a.displayableString();
    expect(displayValue).toBe(`${todo_a.id}. [ ] ${todo_a.title}`);
  });

  test("specific format for completed items due today", async () => {
    const dueTodayItems = await db.Todo.dueToday();
    const todo_a = dueTodayItems[0];
    expect(todo_a.completed).toBe(false);
    await db.Todo.markAsComplete(todo_a.id);
    await todo_a.reload();
    const displayValue = todo_a.displayableString();
    expect(displayValue).toBe(`${todo_a.id}. [x] ${todo_a.title}`);
  });
});
