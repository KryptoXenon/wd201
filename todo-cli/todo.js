/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    const od = all.filter(
      (items) =>
        items.dueDate.split("-")[2] <
        new Date().toISOString().split("T")[0].split("-")[2]
    );
    return od;
  };

  const dueToday = () => {
    const dt = all.filter(
      (items) =>
        items.dueDate.split("-")[2] ===
        String(new Date().toISOString().split("T")[0].split("-")[2])
    );
    return dt;
  };

  const dueLater = () => {
    const dl = all.filter(
      (items) =>
        items.dueDate.split("-")[2] >
        new Date().toISOString().split("T")[0].split("-")[2]
    );
    return dl;
  };

  const toDisplayableList = (list) => {
    const result = list.map((items) => {
      const checkBox = items.completed === true ? "[x]" : "[ ]";
      const displayDate =
        items.dueDate.split("-")[2] === String(new Date().getDate())
          ? ""
          : items.dueDate;
      return `${checkBox} ${items.title} ${displayDate}`;
    });
    return result.join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
