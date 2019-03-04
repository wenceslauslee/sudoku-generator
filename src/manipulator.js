const _ = require('underscore');
const constants = require('./constants');
const solver = require('./solver');

function remove(puzzle, gridsToRemove, level) {
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

    removeInner(puzzleTemp, level, metadata, original);

    if (metadata.puzzle) {
      return metadata.puzzle;
    }
  }
}

function removeInner(puzzle, level, metadata, original) {
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
    const found = solver.solve(cloned, level);
    if (found) {
      metadata.grids += 1;
      removeInner(puzzle, level, metadata, original);
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

function clone(puzzle) {
  const cloned = [];
  for (var i = 0; i < constants.size; i++) {
    cloned.push(Array.from(puzzle[i]));
  }

  return cloned;
}

module.exports = {
  remove: remove
};
