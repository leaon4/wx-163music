const express = require('express');
const router = require('./work_module/router.js');

const app = express();
app.listen(11111);

app.use(router);