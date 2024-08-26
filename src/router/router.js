const { Router } = require('express');
const router = Router();

router.use('/', require('./routes/index'));
router.use('/signup', require('./routes/signup'));
module.exports = router;