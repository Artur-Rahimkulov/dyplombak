const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const recentSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  text: {
    type: ObjectId,
    ref: 'Texts'
  }
}, { timestamps: true });

module.exports = mongoose.model('Recent', recentSchema);
