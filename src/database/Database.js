
const { QuickDB } = require("quick.db");

module.exports = class Database {

  static #_user = new QuickDB();

  async add(id) {
    const twitter = await Database.#_user.get("twitter");
    if (twitter?.includes(id)) return "Essa conta já foi adicionada.";

    await Database.#_user.push("twitter", id);
    return "Conta adicionada com sucesso!";
  };

  static get users() {
    return new Promise(async (resolve) => {
      const ids = await Database.#_user.get('twitter');
      return resolve(ids);
    })
  };

  async delete(id) {
    const twitter = await Database.#_user.get("twitter");
    if (!twitter?.includes(id)) throw new Error("Essa conta não existe.");

    await Database.#_user.pull("twitter", id);
    return "Deletado com sucesso!";
  };

}