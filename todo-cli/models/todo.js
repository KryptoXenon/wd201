"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      console.log(
        Todo.overdue()
          .map((items) => items.displayableString())
          .join("\n")
      );
      console.log("\n");

      console.log("Due Today");
      console.log(
        Todo.dueToday()
          .map((items) => items.displayableString())
          .join("\n")
      );
      console.log("\n");

      console.log("Due Later");
      console.log(
        Todo.dueLater()
          .map((items) => items.displayableString())
          .join("\n")
      );
    }

    static async overdue() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
    }

    static async dueToday() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
    }

    static async dueLater() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
        },
      });
    }

    static async markAsComplete(id) {
      await Todo.update(
        { completed: true },
        {
          where: { id: id },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";

      const itemDueDate = new Date(this.dueDate).toLocaleDateString("en-CA");
      const todayDate = new Date().toLocaleDateString("en-CA");
      const date = itemDueDate === todayDate ? "" : this.dueDate;

      return `${this.id}. ${checkbox} ${this.title} ${date}`.trim();
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
