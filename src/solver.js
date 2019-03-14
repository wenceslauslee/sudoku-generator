const converter = require('./converter');
const fullHouse = require('./strategy/full-house');
const hiddenSubset = require('./strategy/hidden-subset');
const lockedCandidate = require('./strategy/locked-candidate');
const nakedSubset = require('./strategy/naked-subset');

const STRATEGIES = [
  fullHouse.solve,
  nakedSubset.solveOne,
  hiddenSubset.solveOne,
  lockedCandidate.solve,
  nakedSubset.solveTwo,
  hiddenSubset.solveTwo,
  nakedSubset.solveThree,
  hiddenSubset.solveThree,
  nakedSubset.solveFour,
  hiddenSubset.solveFour
];

function solve(puzzle, level) {
  const clues = converter.convert(puzzle);
  const operations = {
    fullHouse: 0,
    lockedCandidate: 0,
    lockedCandidateSet: new Set(),
    hiddenSubset: [0, 0, 0, 0],
    hiddenSubsetSet: [new Set(), new Set(), new Set(), new Set()],
    nakedSubset: [0, 0, 0, 0],
    nakedSubsetSet: [new Set(), new Set(), new Set(), new Set()]
  };
  const trail = [];

  var oldPseudoCount = clues.pseudoCount - 1;
  while (clues.count !== 0 && clues.pseudoCount !== oldPseudoCount) {
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
  const currentCount = clues.pseudoCount;

  for (var i = 0; i < level; i++) {
    STRATEGIES[i](puzzle, clues, operations, trail);
    if (clues.pseudoCount !== currentCount) {
      break;
    }
  }
}

module.exports = {
  solve: solve
};
