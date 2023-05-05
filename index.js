const dotenv = require("dotenv");
const app = require("./config/server.js");
const db = require("./models/index.js");
const { mail } = require("./config/nodemailer.js");

const logger = require("./utils/logger.js");

dotenv.config();

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500);
  res.send({
    status: false,
    enviroment: process.env.NODE_ENV || "production",
    message:
      err.status === 403
        ? err.message
        : process.env.NODE_ENV === "development"
        ? err.message
        : "Error Occoured",
  });
});

app.listen(process.env.PORT, async () => {
  await db.mongoose.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await mail.verify();

  logger.info(`Connected to MongoDB`);
  logger.info(`Nodemailer up and running`);
  logger.info(`Server is up and running on port ${process.env.PORT}`);
});
