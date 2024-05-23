const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const textSchema = new Schema({
  author: {
    type: ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    default: 'Title'
  },
  text: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  accessLevel: {
    type: String,
    enum: ['private', 'public', 'access_link'],
    default: 'private'
  },
  access_link: {
    type: String,
    default: null
  },
}, { timestamps: true });

module.exports = mongoose.model('Texts', textSchema);
