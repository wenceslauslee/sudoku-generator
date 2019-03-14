function validate(operations, difficulty) {
  if (difficulty === 'simple') {
    return operations.nakedSubset[0] >= 20;
  } else if (difficulty === 'easy') {
    return operations.hiddenSubset[0] >= 10 &&
      operations.nakedSubset[0] >= 20;
  } else if (difficulty === 'medium') {
    return operations.hiddenSubset[0] >= 15 &&
      operations.nakedSubset[0] >= 25;
  }

  return false;
}

module.exports = {
  validate: validate
};
