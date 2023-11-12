const { Contact } = require('../models/contact');
const { HttpError } = require('../utils');

const isOwner = async (req, res, next) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { owner: ownerId } = await Contact.findById(contactId);
  const isOwner = ownerId.toString() === userId.toString();
  if (!isOwner) {
    next(HttpError({ status: 403 }));
  }

  next();
};

module.exports = isOwner;
