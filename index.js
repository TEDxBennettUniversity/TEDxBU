require('dotenv').config();
const { app, db } = require('./app');

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database connected');
})

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on Port ${port}`);
})