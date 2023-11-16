const getExpectData = (response) => {
  const isObject = typeof response.body.user === 'object';
  const keys = Object.keys(response.body.user);
  const isValidLength = keys.length === 2;
  const isString = typeof keys[0] === 'string' && typeof keys[1] === 'string';
  return { isObject, isValidLength, isString };
};

module.exports = getExpectData;
