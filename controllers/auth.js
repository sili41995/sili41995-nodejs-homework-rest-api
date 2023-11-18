const { User } = require('../models/user');
const { ctrlWrapper, HttpError } = require('../utils');

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError({ status: 404, message: 'User not found' });
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.status(200).json({ message: 'Verification successful' });
};

module.exports = { verifyEmail: ctrlWrapper(verifyEmail) };
