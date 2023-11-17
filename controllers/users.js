const { User } = require('../models/user');
const {
  HttpError,
  ctrlWrapper,
  resizeImage,
  getResultUpload,
} = require('../utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const { nanoid } = require('nanoid');
require('dotenv').config();

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const isUser = Boolean(await User.findOne({ email }));
  if (isUser) {
    throw HttpError({ status: 409, message: 'Email in use' });
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const avatarURL = gravatar.url(email, {
    s: '250',
  });
  const verificationToken = nanoid();
  const response = await User.create({
    email,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  res.status(201).json({
    user: {
      email: response.email,
      subscription: response.subscription,
    },
  });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = User.findOne({ verificationToken });
  if (!user) {
    throw HttpError({ status: 404, message: 'User not found' });
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });
  res.status(200).json({ message: 'Verification successful' });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isValidPassword = bcrypt.compareSync(password, user?.password ?? '');
  if (!isValidPassword || !user) {
    throw HttpError({ status: 401, message: 'Email or password is wrong' });
  }
  if (!user.verify) {
    throw HttpError({ status: 401, message: 'Email not verify' });
  }
  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '30d' });
  const response = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );
  res.status(200).json({
    token: response.token,
    user: {
      email: response.email,
      subscription: response.subscription,
    },
  });
};

const logout = async (req, res, next) => {
  const { _id: id } = req.user;
  await User.findByIdAndUpdate(id, { token: null }, { new: true });
  res.status(204).json();
};

const refresh = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const updateSubscription = async (req, res, next) => {
  const { _id: id } = req.user;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  res.status(200).json(user);
};

const updateAvatar = async (req, res, next) => {
  const { path: tempUpload, originalname } = req.file;
  await resizeImage(tempUpload);
  const { id, fileName, resultUpload } = getResultUpload({
    user: req.user,
    dirPath: ['public', 'avatars'],
    originalname,
  });
  try {
    await fs.rename(tempUpload, resultUpload);
  } catch (err) {
    await fs.unlink(tempUpload);
    return next(err);
  }
  const avatarURL = path.join('avatars', fileName);
  const user = await User.findByIdAndUpdate(id, { avatarURL }, { new: true });
  res.status(200).json({ avatarURL: user.avatarURL });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  refresh: ctrlWrapper(refresh),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verifyEmail: ctrlWrapper(verifyEmail),
};
