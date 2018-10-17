const express = require('express');
const router = express.Router();

const test = require('./test');
const api = require('./api/api');

router.use(test);
router.use(api);


module.exports = router;