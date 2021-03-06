const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

require('./models/User')

const baseConfig = require('./config/baseConfig');


mongoose.connect(baseConfig.mongoUri);

const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
require('./routes/authRoutes')(app);

app.get('/', (requestAnimationFrame, res) => {
    res.send({ message: 'Welcome McMaster Health Sciences!'});
}); 

const PORT = process.env.PORT || 5000;

app.listen(PORT);
