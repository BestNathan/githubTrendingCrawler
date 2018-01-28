const { Model } = require("crazy-crawler");
const connection = require("./mongoose-connection/connections");

module.exports = class SelfModel extends Model {
  constructor(field) {
    super(field);
  }
  async save() {
    return await connection.insert(this.field);
  }
};
