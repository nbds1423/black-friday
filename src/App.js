const express = require('express');
const router = require('./router/router');

class App {

  constructor() {
    this._app = express();
    this.middlewares().routes();
  }

  middlewares() {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: false }))
    return this;
  }

  routes() {
    this._app.use("/", router);
    return this;
  }

}

module.exports = new App()._app;