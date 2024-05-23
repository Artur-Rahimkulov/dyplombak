const Texts = require('../model/Texts');
const Rating = require('../model/Rating');
const { checkAccess } = require('../utils/checkAccess');
const User = require('../model/User');


exports.getUser = async (req, res) => {
  try {
    const user_id = req.user._id;
    const user = await User.findOne({ _id: user_id }).exec();
    return res.json({
      status: true,
      user: { _id: user._id, username: user.username, userSettings: user.userSettings }
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).exec();
    user = await User.updateOne({ _id: req.user._id }, {
      userSettings: req.body.userSettings
    }).exec();
    return res.json({
      status: true,
      user: user
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};