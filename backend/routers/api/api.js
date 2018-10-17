const express = require('express');
const router = express.Router();

const api = require('./getMainImage');

router.use(api);

module.exports = router;