function validate(operations, level) {
  if (level === 2) {
    return operations.nakedSingle >= 20;
  } else if (level === 3) {
    return operations.hiddenSingle > 10 &&
      operations.nakedSingle > 20;
  } else if (level === 4) {
    return operations.lockedCandidate1 >= 1;
  }

  return false;
}

module.exports = {
  validate: validate
};
