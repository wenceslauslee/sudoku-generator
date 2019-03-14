const _ = require('underscore');
const clone = require('lodash').cloneDeep;
const constants = require('../constants');
const utils = require('../utils');

const OFFSET = 1;

function solve(puzzle, clues, operations, trail, subsetSize) {
  const remaining = clues.remaining;

  for (var i1 = 0; i1 < constants.size; i1++) {
    const group1 = groupBy(remaining[i1], subsetSize);
    const answer1 = getSubsets(group1, subsetSize, operations.nakedSubsetSet[subsetSize - OFFSET], `R${i1}`);

    if (!_.isEmpty(answer1)) {
      if (subsetSize === 1) {
        utils.update(puzzle, clues, i1, answer1.keys[0], answer1.values[0]);
      } else {
        utils.removePossibleFromOtherBoxes(remaining[i1], answer1.keys, answer1.values);
      }
      clues.pseudoCount++;
      operations.nakedSubset[subsetSize - OFFSET]++;
      trail.push(answer1.operationName);
    }
  }

  for (var i2 = 0; i2 < constants.size; i2++) {
    const newRemaining2 = _.map(remaining, r => r[i2]);
    const group2 = groupBy(newRemaining2, subsetSize);
    const answer2 = getSubsets(group2, subsetSize, operations.nakedSubsetSet[subsetSize - OFFSET], `C${i2}`);

    if (!_.isEmpty(answer2)) {
      if (subsetSize === 1) {
        utils.update(puzzle, clues, answer2.keys[0], i2, answer2.values[0]);
      } else {
        utils.removePossibleFromOtherBoxes(newRemaining2, answer2.keys, answer2.values);
      }
      clues.pseudoCount++;
      operations.nakedSubset[subsetSize - OFFSET]++;
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
    const answer3 = getSubsets(group3, subsetSize, operations.nakedSubsetSet[subsetSize - OFFSET], `G${i3}`);

    if (!_.isEmpty(answer3)) {
      if (subsetSize === 1) {
        const position = utils.convertFromGridInner(answer3.keys[0], i3);
        utils.update(puzzle, clues, position.row, position.column, answer3.values[0]);
      } else {
        utils.removePossibleFromOtherBoxes(newRemaining3, answer3.keys, answer3.values);
      }
      clues.pseudoCount++;
      operations.nakedSubset[subsetSize - OFFSET]++;
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
  for (var i = 0; i < constants.size; i++) {
    values.push([]);
  }
  for (var j = 0; j < constants.size; j++) {
    if (remaining[j] === null) {
      continue;
    }
    for (var s of remaining[j]) {
      values[j].push(s);
    }
    totalCount++;
  }

  const keys = [];
  for (var k = 0; k < constants.size; k++) {
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

  return `NS:${subsetSize}${bound}:${keysString}:${valuesString}`;
}

function checkIfNaked(group, subsetKeys, subsetValues, subsetSize) {
  if (subsetSize === 1) {
    return false;
  }

  const set = new Set(subsetKeys);
  for (var i = 0; i < constants.size; i++) {
    if (set.has(i)) {
      continue;
    }
    if (_.intersection(group.values[i], subsetValues).length !== 0) {
      return false;
    }
  }

  return true;
}

module.exports = {
  solve: solve
};
