function validate(operations, level) {
  if (level === 2) {
    return operations.nakedSingle >= 20;
  } else if (level === 3) {
    return operations.hiddenSingle > 10 &&
      operations.nakedSingle > 20;
  } else if (level === 5) {
    return true;
  }

  return false;
}

module.exports = {
  validate: validate
};
