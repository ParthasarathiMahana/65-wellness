const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    subcategory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategories'
        }
    ]
});

const Courses = mongoose.model('Courses', courseSchema);
module.exports = Courses;