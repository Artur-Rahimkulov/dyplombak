const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  userSettings: {
    type: Object,
    default: {}
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
