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
      (items) => items.dueDate.split("-")[2] < new Date().getDate()
    );
    return od;
  };

  const dueToday = () => {
    const dt = all.filter(
      (items) => items.dueDate.split("-")[2] === String(new Date().getDate())
    );
    return dt;
  };

  const dueLater = () => {
    const dl = all.filter(
      (items) => items.dueDate.split("-")[2] > new Date().getDate()
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
