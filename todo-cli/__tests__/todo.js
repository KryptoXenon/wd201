/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

describe("TodoList Test Suite", () => {
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  let dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );

  beforeAll(() => {
    add({ title: "Submit assignment", dueDate: yesterday, completed: false });
    add({ title: "Pay rent", dueDate: today, completed: true });
    add({ title: "Service Vehicle", dueDate: today, completed: false });
    add({ title: "File taxes", dueDate: tomorrow, completed: false });
    add({ title: "Pay electric bill", dueDate: tomorrow, completed: false });
  });

  test("Check Add New Todo", () => {
    const todoItemsCount = all.length;
    add({ title: "New Todo", dueDate: tomorrow, completed: false });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Mark Todo As Complete ", () => {
    markAsComplete(4);
    expect(all[4]["completed"]).toBe(true);
  });

  test("Check Overdue Items", () => {
    const od = overdue();
    console.log(od);
    expect(od.length).toBe(1);
  });

  test("Check Today Items", () => {
    const dt = dueToday();
    console.log(dt);
    expect(dt.length).toBe(2);
  });

  test("Check Later Items", () => {
    const dl = dueLater();
    expect(dl.length).toBe(3);
  });
});
