const _ = require('underscore');
const clone = require('lodash.clonedeep');
const constants = require('../constants');
const utils = require('../utils');

const OFFSET = 2;

function solve(puzzle, clues, operations, trail, subsetSize) {
  const remaining = clues.remaining;

  for (var i1 = 0; i1 < constants.size; i1++) {
    const group = groupBy(remaining.rows[i1], subsetSize);
    const answer = getSubsets(group, subsetSize);
    if (answer != null) {
      for (var j1 in answer.values) {
        utils.removePossibleRowColumnGrid(remaining.rows[j1], answer.keys);
      }
      const operationName = formatOperationName(subsetSize, answer.keys);
      operations.subset[subsetSize - OFFSET]++;
      operations.subsetSet[subsetSize - OFFSET].add(operationName);
      trail.push(operationName);
      clues.psuedoCount++;
    }
  }
}

function getSubsets(group, subsetSize) {
  var answer = null;
  getSubsetInner(group, 0, 0, subsetSize, new Set(), [], answer);

  return answer;
}

function getSubsetInner(group, current, level, subsetSize, subsetKeys, subsetValues, answer) {
  if (level === subsetSize) {
    answer = {
      keys: clone(subsetKeys),
      values: clone(subsetValues)
    };
    return;
  }

  const max = group.keys.length - subsetSize + level;
  for (var i = current; i < max; i++) {
    const key = group.keys[current];
    const newSubsetValues = _.intersection(subsetValues, group.values[key]);
    if (newSubsetValues.length > subsetSize) {
      continue;
    }
    subsetKeys.add(group.keys[i]);
    getSubsetInner(group, i + 1, level + 1, subsetSize, subsetKeys, answer);
    if (answer !== null) {
      return;
    }
    subsetKeys.delete(group.keys[i]);
  }
}

function groupBy(remaining, subsetSize) {
  const values = {};
  for (var i = 0; i < constants.size; i++) {
    if (remaining[i] === null) {
      continue;
    }
    for (var s of remaining[i]) {
      if (values[s] === null) {
        values[s] = [i];
      } else {
        values[s].push(i);
      }
    }
  }

  const keys = [];
  for (var g in values) {
    if (values.g.length <= subsetSize) {
      keys.push(g);
    }
  }

  return {
    keys: keys,
    values: values
  };
}

function formatOperationName(subsetSize, keys) {
  const keysString = _.sortBy(keys, k => k).join('');

  return `SS${subsetSize}:${keysString}`;
}

module.exports = {
  solve: solve
};
