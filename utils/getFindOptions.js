const getFindOptions = ({ defaultOptions, favorite }) => {
  const options = { ...defaultOptions };
  if (favorite === 'true') {
    options.favorite = true;
  }
  if (favorite === 'false') {
    options.favorite = false;
  }
  return options;
};

module.exports = getFindOptions;
