const path = require('path');

const getResultUpload = ({ user, originalname, dirPath }) => {
  const { _id: id } = user;
  const fileName = `${id}_${originalname}`;
  const resultUpload = path.resolve(...dirPath, fileName);
  return { id, fileName, resultUpload };
};

module.exports = getResultUpload;
