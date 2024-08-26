const { Router } = require('express');
const Database = require('../../database/Database');
const router = Router();

const database = new Database();

router.get('/', async (req, res) => {
  const data = await Database.users;
  return res.status(200).json({ data });
});

router.post('/', async (req, res) => {

  const { id } = req.body;
  if (!id) return res.status(400).json({
    message: "Adicione um ID válido!"
  })

  const message = await database.add(id.trim());

  return res.status(201).json({ message });
});

router.delete('/:id', async (req, res) => {

  const { id } = req.params;
  try {
    const message = await database.delete(id);
    return res.status(202).json({ message });
  } catch(e) {
    return res.status(404).json({ message: `${id} não existe no banco de dados.` });
  }
});

module.exports = router;