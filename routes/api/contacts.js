const express = require('express');
const {
  validateBody,
  isValidId,
  authenticate,
  isOwner,
} = require('../../middlewares');
const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateStatusContact,
} = require('../../controllers/contacts');
const {
  addSchema,
  updateSchema,
  updateStatusContactSchema,
} = require('../../models/contact');

const router = express.Router();

router.get('/', authenticate, getAll);

router.get('/:contactId', authenticate, isOwner, isValidId, getById);

router.post('/', authenticate, isOwner, validateBody(addSchema), add);

router.delete('/:contactId', authenticate, isOwner, isValidId, deleteById);

router.put(
  '/:contactId',
  authenticate,
  isOwner,
  isValidId,
  validateBody(updateSchema),
  updateById
);

router.patch(
  '/:contactId/favorite',
  authenticate,
  isOwner,
  isValidId,
  validateBody(updateStatusContactSchema),
  updateStatusContact
);

module.exports = router;
