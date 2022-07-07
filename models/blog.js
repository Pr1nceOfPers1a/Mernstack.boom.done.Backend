const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//schemas dictate how docs are formatted
//this schema makes sure my blogs have a title snippet and body and also makes sure that data is type:string
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
