require('dns').setDefaultResultOrder('ipv4first');

const express = require('express');
const routes = require('./routes');
const config = require('./config');
const logger = require('./middleware/logging');

const app = express();

app.use(express.json());
app.use(logger);
app.use(routes);

const { PORT, HOST } = config;

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
