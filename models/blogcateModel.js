const mongoose = require('mongoose');

const blogCateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index : true,
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BlogCategory', blogCateSchema);