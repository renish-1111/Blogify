const { model, Schema } = require('mongoose')


const blogSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    body: {
        type: String,
        require: true,
    },
    coverImageURL: {
        type: String,
        require: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Blog = model('Blog', blogSchema);

module.exports = Blog;

