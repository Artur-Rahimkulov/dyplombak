const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const commentSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  text: {
    type: ObjectId,
    ref: 'Texts'
  },
  comment: String,
  parent: {
    type: ObjectId,
    ref: 'Comment',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
