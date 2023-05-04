const dotenv = require("dotenv");
const app = require("./config/server.js");
const db = require("./models/index.js");

const logger = require("./utils/logger.js");

dotenv.config();

app.listen(process.env.PORT, async () => {
  await db.mongodb.connect();

  logger.info(`Connected to MongoDB`);

  logger.info(`Server is up and running on port ${process.env.PORT}`);
});
