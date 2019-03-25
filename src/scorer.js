function validate(operations, difficulty) {
  if (difficulty === 'simple') {
    return operations.fullHouse >= 15 && operations.nakedSubset[0] >= 20;
  } else if (difficulty === 'easy') {
    return operations.hiddenSubset[0] >= 10 &&
      operations.nakedSubset[0] >= 25;
  } else if (difficulty === 'medium') {
    return operations.hiddenSubset[0] + operations.nakedSubset[0] >= 42;
  } else if (difficulty === 'hard') {
    return operations.fullHouse <= 10;
  } else if (difficulty === 'expert') {
    return operations.fullHouse <= 10;
  }

  return false;
}

module.exports = {
  validate: validate
};
