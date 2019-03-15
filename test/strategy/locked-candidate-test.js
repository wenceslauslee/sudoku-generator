const chai = require('chai');
const assert = chai.assert;
const converter = require('../../src/converter');
const lockedCandidate = require('../../src/strategy/locked-candidate');
const testUtils = require('../utils/test-utils');

describe('locked-candidate', () => {
  describe('solve', () => {
    it('should solve a valid puzzle with locked-candidate (type 1)', () => {
      const puzzleString = '984______' +
        '__25___4_' +
        '__19_4__2' +
        '__6_9723_' +
        '__36_2___' +
        '2_9_3561_' +
        '195768423' +
        '427351896' +
        '638__9751';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        lockedCandidate: 0,
        lockedCandidateSet: new Set()
      };
      const trail = [];
      lockedCandidate.solve(puzzle, clues, operations, trail);
      const expectedTrail = [ 'LC:G2xx:5', 'LC:Gx4x:8' ];

      assert.isNotOk(clues.remaining[2][6].has(5));
      assert.strictEqual(clues.count, 32);
      assert.strictEqual(clues.pseudoCount, 2);
      assert.strictEqual(operations.lockedCandidate, 2);
      assert.isOk(operations.lockedCandidateSet.has(expectedTrail[0]));
      assert.isOk(operations.lockedCandidateSet.has(expectedTrail[1]));
      assert.deepStrictEqual(trail, expectedTrail);
    });

    it('should solve a valid puzzle with locked-candidate (type 2)', () => {
      const puzzleString = '318__54_6' +
        '___6_381_' +
        '__6_8_5_3' +
        '864952137' +
        '123476958' +
        '795318264' +
        '_3_5__78_' +
        '_____73_5' +
        '____39641';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      const operations = {
        lockedCandidate: 0,
        lockedCandidateSet: new Set()
      };
      const trail = [];
      lockedCandidate.solve(puzzle, clues, operations, trail);
      const expectedTrail = [ 'LC:Rxx0:7' ];

      assert.isNotOk(clues.remaining[2][1].has(7));
      assert.strictEqual(clues.count, 28);
      assert.strictEqual(clues.pseudoCount, 1);
      assert.strictEqual(operations.lockedCandidate, 1);
      assert.isOk(operations.lockedCandidateSet.has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });
  });
});
