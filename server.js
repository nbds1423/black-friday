const app = require("./src/App");
const Twitter = require("./src/services/Twitter");
require('dotenv').config();

app.listen(process.env.PORT || 3000, async () => {
  console.log('Server is running!');
});

setInterval(async () => {
  new Twitter();
}, 3 * 6 * 10000);