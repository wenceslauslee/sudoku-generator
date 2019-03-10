const converter = require('./converter');
const double = require('./strategy/double');
const fullHouse = require('./strategy/full-house');
const hiddenSingle = require('./strategy/hidden-single');
const lockedCandidate = require('./strategy/locked-candidate');
const nakedSingle = require('./strategy/naked-single');
// const util = require('util');

const STRATEGIES = [
  fullHouse,
  nakedSingle,
  hiddenSingle,
  lockedCandidate,
  double
];

function solve(puzzle, level) {
  const clues = converter.convert(puzzle);
  const operations = {
    fullHouse: 0,
    nakedSingle: 0,
    hiddenSingle: 0,
    lockedCandidate: 0,
    lockedCandidateSet: new Set(),
    subset: [0, 0, 0],
    subsetSet: [new Set(), new Set(), new Set()]
  };
  const trail = [];

  var oldCount = clues.count + 1;
  var oldPseudoCount = clues.pseudoCount;
  while ((clues.count !== 0 && clues.count !== oldCount) || clues.pseudoCount !== oldPseudoCount) {
    oldCount = clues.count;
    oldPseudoCount = clues.pseudoCount;
    cycleThroughStrategies(puzzle, clues, operations, trail, level);
  }

  return {
    operations: operations,
    trail: trail,
    success: clues.count === 0
  };
}

function cycleThroughStrategies(puzzle, clues, operations, trail, level) {
  const currentCount = clues.count;

  for (var i = 0; i < level; i++) {
    STRATEGIES[i].solve(puzzle, clues, operations, trail);
    if (clues.count !== currentCount) {
      break;
    }
  }
}

module.exports = {
  solve: solve
};
