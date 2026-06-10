const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, simple, prettyPrint } = format;
require("winston-mongodb");

const logger = createLogger({
  format: combine(timestamp(), prettyPrint()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "log/mixed.log" }),
    new transports.MongoDB({ db: process.env.MONGO_URI }),
  ],
});

module.exports = logger;
