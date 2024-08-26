const { QuickDB } = require("quick.db");

module.exports = class Product {

  static #_database = new QuickDB();

  static async add_product(products) {
    const twitter = await Product.#_database.get("product");

    for (const product of products) {
      const isDuplicate = twitter?.some((item) => item.id === product.id);
      if (!isDuplicate) {
        await Product.#_database.push("product", product);
        console.log('Foram adicionados novos itens ao banco de dados,');
      }
    }
  }

  static async delete_product(id) {
    const twitter = await Product.#_database.get("product");

    if (!twitter?.includes(id)) throw new Error("Essa conta não existe.");

    await Product.#_database.pull("twitter", id);
    return "Deletado com sucesso!";
  };

  static products() {
    return new Promise(async (resolve) => {
      const products = await Product.#_database.get('product');
      const bySort = products?.sort((a, b) => b.timestamp - a.timestamp);
      return resolve(bySort);
    });
  };

}