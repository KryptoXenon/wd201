/* eslint-disable comma-dangle */
/* eslint-disable semi */
/* eslint-disable quotes */
const app = require("./app");

app.createServer().listen(3000, () => {
  console.log("Started express at port 3000");
});
