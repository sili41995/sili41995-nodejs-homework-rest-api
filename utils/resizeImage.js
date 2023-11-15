const jimp = require('jimp');

const resizeImage = async (path) => {
  const image = await jimp.read(path);
  await image.cover(250, 250);
  await image.writeAsync(path);
};

module.exports = resizeImage;
