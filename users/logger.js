const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
require("winston-daily-rotate-file");

//Label
const CATEGORY = "Log Rotation";

const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const FILE_PATH = 'files/logs'

//DailyRotateFile func()
const fileRotateTransport = new transports.DailyRotateFile({
  filename: `${FILE_PATH}/info-logs-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const errorfileRotateTransport = new transports.DailyRotateFile({
    level: "error",
    filename: `${FILE_PATH}/error-logs-%DATE%.log`,
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d",
  });

const logger = createLogger({
  level: "debug",
  format: combine(label({ label: CATEGORY }), timestamp(), customFormat),
  transports: [fileRotateTransport, errorfileRotateTransport],
});

module.exports = logger;