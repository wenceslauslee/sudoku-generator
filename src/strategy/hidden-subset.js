const _ = require('underscore');
const clone = require('lodash').cloneDeep;
const constants = require('../constants');
const utils = require('../utils');

const OFFSET = 1;

function solve(puzzle, clues, operations, trail, subsetSize) {
  const remaining = clues.remaining;

  for (var i1 = 0; i1 < constants.size; i1++) {
    const group1 = groupBy(remaining[i1], subsetSize);
    const answer1 = getSubsets(group1, subsetSize, operations.hiddenSubsetSet[subsetSize - OFFSET], `R${i1}`);

    if (!_.isEmpty(answer1)) {
      for (var j1 of answer1.values) {
        if (subsetSize === 1) {
          utils.update(puzzle, clues, i1, j1, answer1.keys[0]);
        } else {
          utils.removePossibleFromBox(remaining[i1][j1], answer1.keys);
        }
      }
      clues.pseudoCount++;
      operations.hiddenSubset[subsetSize - OFFSET]++;
      trail.push(answer1.operationName);
    }
  }

  for (var i2 = 0; i2 < constants.size; i2++) {
    const newRemaining2 = _.map(remaining, r => r[i2]);
    const group2 = groupBy(newRemaining2, subsetSize);
    const answer2 = getSubsets(group2, subsetSize, operations.hiddenSubsetSet[subsetSize - OFFSET], `C${i2}`);

    if (!_.isEmpty(answer2)) {
      for (var j2 of answer2.values) {
        if (subsetSize === 1) {
          utils.update(puzzle, clues, j2, i2, answer2.keys[0]);
        } else {
          utils.removePossibleFromBox(remaining[j2][i2], answer2.keys);
        }
      }
      clues.pseudoCount++;
      operations.hiddenSubset[subsetSize - OFFSET]++;
      trail.push(answer2.operationName);
    }
  }

  for (var i3 = 0; i3 < constants.size; i3++) {
    const rowStart1 = utils.getStartingRow(i3);
    const colStart1 = utils.getStartingColumn(i3);
    const newRemaining3 = [];
    for (var i4 = rowStart1; i4 < rowStart1 + 3; i4++) {
      for (var i5 = colStart1; i5 < colStart1 + 3; i5++) {
        newRemaining3.push(remaining[i4][i5]);
      }
    }
    const group3 = groupBy(newRemaining3, subsetSize);
    const answer3 = getSubsets(group3, subsetSize, operations.hiddenSubsetSet[subsetSize - OFFSET], `G${i3}`);

    if (!_.isEmpty(answer3)) {
      for (var j3 of answer3.values) {
        const position = utils.convertFromGridInner(j3, i3);
        if (subsetSize === 1) {
          utils.update(puzzle, clues, position.row, position.column, answer3.keys[0]);
        } else {
          utils.removePossibleFromBox(remaining[position.row][position.column], answer3.keys);
        }
      }
      clues.pseudoCount++;
      operations.hiddenSubset[subsetSize - OFFSET]++;
      trail.push(answer3.operationName);
    }
  }
}

function getSubsets(group, subsetSize, usedSet, bound) {
  const answer = {};
  if (group.totalCount !== subsetSize) {
    getSubsetInner(group, 0, 0, subsetSize, [], [], answer, usedSet, bound);
  }

  return answer;
}

function getSubsetInner(group, current, level, subsetSize, subsetKeys, subsetValues, answer, usedSet, bound) {
  if (level === subsetSize) {
    const operationName = formatOperationName(subsetSize, bound, subsetKeys, subsetValues);

    if (usedSet.has(operationName) || checkIfNaked(group, subsetKeys, subsetValues, subsetSize)) {
      return;
    }

    answer.keys = clone(subsetKeys);
    answer.values = clone(subsetValues);
    answer.operationName = operationName;
    usedSet.add(operationName);

    return;
  }

  const max = group.keys.length - subsetSize + level;
  for (var i = current; i <= max; i++) {
    const key = group.keys[i];
    const newSubsetValues = _.union(subsetValues, group.values[key]);
    if (newSubsetValues.length > subsetSize) {
      continue;
    }
    subsetKeys.push(group.keys[i]);
    getSubsetInner(group, i + 1, level + 1, subsetSize, subsetKeys, newSubsetValues, answer, usedSet, bound);
    if (!_.isEmpty(answer)) {
      return;
    }
    subsetKeys.splice(subsetKeys.length - 1, 1);
  }
}

function groupBy(remaining, subsetSize) {
  const values = [];
  var totalCount = 0;
  for (var i = 0; i < constants.size + 1; i++) {
    values.push([]);
  }
  for (var j = 0; j < constants.size; j++) {
    if (remaining[j] === null) {
      continue;
    }
    for (var s of remaining[j]) {
      values[s].push(j);
    }
    totalCount++;
  }

  const keys = [];
  for (var k = 0; k < constants.size + 1; k++) {
    if (values[k].length !== 0 && values[k].length <= subsetSize) {
      keys.push(k);
    }
  }

  return {
    keys: keys,
    values: values,
    totalCount: totalCount
  };
}

function formatOperationName(subsetSize, bound, keys, values) {
  const keysString = _.sortBy(keys, k => k).join('');
  const valuesString = _.sortBy(values, v => v).join('');

  return `HS:${subsetSize}${bound}:${keysString}:${valuesString}`;
}

function checkIfNaked(group, subsetKeys, subsetValues, subsetSize) {
  if (subsetSize === 1) {
    return false;
  }

  const set = new Set(subsetKeys);
  for (var i = 1; i < constants.size + 1; i++) {
    if (set.has(i)) {
      continue;
    }
    if (_.intersection(group.values[i], subsetValues).length !== 0) {
      return false;
    }
  }

  return true;
}

function solveOne(puzzle, clues, operations, trail) {
  return solve(puzzle, clues, operations, trail, 1);
}

function solveTwo(puzzle, clues, operations, trail) {
  return solve(puzzle, clues, operations, trail, 2);
}

function solveThree(puzzle, clues, operations, trail) {
  return solve(puzzle, clues, operations, trail, 3);
}

function solveFour(puzzle, clues, operations, trail) {
  return solve(puzzle, clues, operations, trail, 4);
}

module.exports = {
  solve: solve,
  solveOne: solveOne,
  solveTwo: solveTwo,
  solveThree: solveThree,
  solveFour: solveFour
};
