const { Router } = require('express');
const Products = require('../../database/Product');
const router = Router();

module.exports = router.get('/', async (req, res) => {
  try {

    const data = await Products.products();

    if (!data) {
      res.status(404).json({ message: "no content" });
      return;
    }

    return res.status(200).json({ data });

  } catch (e) {
    console.log(e)
    return res.status(404).json({ message: "Ocorreu um erro." });
  }
});