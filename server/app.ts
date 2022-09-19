import express from "express";
import  bodyParser from "body-parser";
import Users, { User } from "./users/store";
import morgan from "morgan";
import calendarRoutes from "./calendar/routes"


const path = require('path');

export const app = express();

export const users = new Users()
users.add(new User("Eng Test User", "host_user_1"))

const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');

app.get('/', (req, res) => {
    res.sendFile(HTML_FILE);
  });

// Logs requests
app.use(morgan(':remote-addr :url :method HTTP/:http-version :user-agent', {
  // https://github.com/expressjs/morgan#immediate
  immediate: true,
  stream: {
    write: (message) => {
      console.info(`REQUEST => ${message.trim()}`);
    }
  }
}));

// Logs responses
app.use(morgan(':remote-addr :url :method :status :res[content-length] :response-time ms', {
  stream: {
    write: (message) => {
      console.info(`RESPONSE => ${message.trim()}`);
    }
  }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(DIST_DIR));
app.use(calendarRoutes);