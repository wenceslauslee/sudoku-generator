const _ = require('underscore');
const clone = require('lodash').cloneDeep;
const constants = require('./constants');
const scorer = require('./scorer');
const solver = require('./solver');

function remove(puzzle, gridsToRemove, level, difficulty) {
  const original = clone(puzzle);
  for (var i = 0; i < constants.retryShuffleThreshold; i++) {
    const puzzleTemp = clone(original);
    const list = getRandomList();
    const metadata = {
      grids: 0,
      gridsToRemove: gridsToRemove,
      list: list,
      failCount: 0
    };

    removeInner(puzzleTemp, level, difficulty, metadata, original);

    if (metadata.puzzle) {
      // printOperations(metadata.operations);
      return {
        puzzle: metadata.puzzle,
        operations: metadata.operations
      };
    }
  }
}

function removeInner(puzzle, level, difficulty, metadata, original) {
  if (metadata.grids === metadata.gridsToRemove) {
    metadata.puzzle = clone(puzzle);
    return;
  }

  // Run down same ancestor node three times max
  for (var i = 0; i < constants.retryBranchThreshold; i++) {
    if (metadata.failCount === constants.solveFailureThreshold) {
      break;
    }

    var value = getRandomValue(metadata.list);
    puzzle[value.y][value.x] = null;
    const cloned = clone(puzzle);
    const result = solver.solve(cloned, level);
    if (result.success) {
      metadata.grids += 1;
      metadata.operations = result.operations;

      // Validate puzzle to make sure it adheres to difficulty
      if (metadata.grids === metadata.gridsToRemove && !scorer.validate(result.operations, difficulty)) {
        metadata.failCount += 1;
        // printOperations(metadata.operations);
      } else {
        removeInner(puzzle, level, difficulty, metadata, original);
      }
    } else {
      metadata.failCount += 1;
    }
    metadata.grids -= 1;
    value = putBackValue(metadata.list);
    puzzle[value.y][value.x] = original[value.y][value.x];

    if (metadata.puzzle) {
      break;
    }
  }
}

function getRandomList() {
  var list = [];
  for (var i = 0; i < constants.size; i++) {
    for (var j = 0; j < constants.size; j++) {
      list.push(`${i}${j}`);
    }
  }
  list = _.shuffle(list);

  return {
    list: list,
    size: list.length,
    end: list.length
  };
}

function getRandomValue(list) {
  const random = Math.floor(Math.random() * list.size);
  const value = list.list[random];

  list.size -= 1;
  list.end -= 1;
  const temp = list.list[random];
  list.list[random] = list.list[list.end];
  list.list[list.end] = temp;

  return {
    y: parseInt(value.substring(0, 1)),
    x: parseInt(value.substring(1))
  };
}

function putBackValue(list) {
  const value = list.list[list.end];
  list.size += 1;
  list.end += 1;

  return {
    y: parseInt(value.substring(0, 1)),
    x: parseInt(value.substring(1))
  };
}

/* function printOperations(operations) {
  console.log(`FH: ${operations.fullHouse}`);
  console.log(`NS: ${operations.nakedSubset}`);
  console.log(`HS: ${operations.hiddenSubset}`);
  console.log(`LC: ${operations.lockedCandidate}`);
} */

module.exports = {
  remove: remove
};
