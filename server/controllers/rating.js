const Texts = require('../model/Texts');
const Rating = require('../model/Rating');
const { checkAccess } = require('../utils/checkAccess');


exports.rateText = async (req, res) => {
  try {
    const user_id = req.user._id;
    const text_id = req.params.id;
    const rating = req.params.rating;
    const prepareRating = rating === 'like' ? 1 : 0;
    let text = await Texts.findOne({ _id: text_id }).exec();
    let checkAccessResult = await checkAccess('rate', text, user_id);
    if (!checkAccessResult.status) return res.json({ message: checkAccessResult.message, status: false });

    let rate = await Rating.findOne({ user: user_id, text: text_id }).exec();
    let newLikes = text.likes;
    let newDislikes = text.dislikes;
    let newRating = null;
    if (rate) {
      if (prepareRating === rate.rating) {
        let res = await deleteRate(text, user_id, rate);
        newLikes = res[0];
        newDislikes = res[1];
        newRating = res[2];
      }
      else {
        let res = await changeRate(text, user_id, rate);
        newLikes = res[0];
        newDislikes = res[1];
        newRating = res[2];
      }
    } else {
      newLikes = text.likes + (prepareRating === 1 ? 1 : 0);
      newDislikes = text.dislikes + (prepareRating === 0 ? 1 : 0);
      newRating = prepareRating;
      text = await Texts.updateOne({ _id: text_id }, {
        likes: text.likes + (prepareRating === 1 ? 1 : 0),
        dislikes: text.dislikes + (prepareRating === 0 ? 1 : 0),
      }).exec();
      rate = await Rating.create({
        user: user_id,
        text: text_id,
        rating: prepareRating
      });
    }
    return res.json({
      status: true,
      likes: newLikes,
      dislikes: newDislikes,
      rating: newRating
    });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

const deleteRate = async (text, user_id, rate) => {
  console.log('deleteRate', rate);
  let newLikes = text.likes - (rate.rating === 1 ? 1 : 0);
  let newDislikes = text.dislikes - (rate.rating === 0 ? 1 : 0);
  const newRating = null;
  const deleteRates = await Rating.deleteOne({ _id: rate._id }).exec();
  const newText = await Texts.updateOne({ _id: text._id }, {
    likes: newLikes,
    dislikes: newDislikes
  }).exec();
  return [newLikes, newDislikes, newRating];
};

const changeRate = async (text, user_id, rate) => {
  console.log('changeRate', rate);
  let newLikes = text.likes + (rate.rating === 1 ? -1 : 1);
  let newDislikes = text.dislikes + (rate.rating === 0 ? -1 : 1);
  let newRating = rate.rating === 1 ? 0 : 1;
  const newRate = await Rating.updateOne({ _id: rate._id }, {
    rating: newRating
  }).exec();
  const newText = await Texts.updateOne({ _id: text._id }, {
    likes: newLikes,
    dislikes: newDislikes
  }).exec();
  return [newLikes, newDislikes, newRating];
};
