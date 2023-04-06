const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
    categoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    },
    subcategoryName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
});

const Subcategories = mongoose.model('Subcategories', subcategorySchema);
module.exports = Subcategories;