const mongoose = require('mongoose');

const dbConfig = () => {
    const { DB_USER, DB_PASS, DB_NAME } = process.env;
    mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.cgrecp3.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
}

module.exports = dbConfig;