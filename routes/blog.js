const express = require('express')
const router = express.Router()
const multer = require('multer')
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

router.get('/add-blog', (req, res) => {
    res.render('blog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy")
    const comment = await Comment.find({blogId:req.params.id}).populate("createdBy")
    return res.render('viewBlog', {
        user: req.user,
        blog: blog,
        comment: comment,
    })
})

router.post('/', upload.single('coverImageURL'), async (req, res) => {
    const { title, body } = req.body
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/ uploads / ${req.file.filename}`,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${blog._id}`)
}
)
router.post("/comment/:blogId", async (req, res) => {
    const comment = await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    });
    console.log(comment);
    return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router