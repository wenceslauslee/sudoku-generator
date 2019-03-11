const chai = require('chai');
const assert = chai.assert;
const converter = require('../../src/converter');
const subsets = require('../../src/strategy/subsets');
const testUtils = require('../utils/test-utils');

describe('subsets', () => {
  describe('solve', () => {
    it('should solve a valid puzzle with subsets (1 hidden)', () => {
      const puzzleString = '_28__7___' +
        '_16_83_7_' +
        '____2_851' +
        '13729____' +
        '___73____' +
        '____463_7' +
        '29__7____' +
        '___86_14_' +
        '___3__7__';
      const puzzle = testUtils.convertStringToPuzzle(puzzleString);
      const clues = converter.convert(puzzle);
      console.log(clues);
      const operations = {
        subset: 0,
        subsetSet: new Set()
      };
      const trail = [];
      subsets.solve(puzzle, clues, operations, trail);
      const expectedTrail = [ 'LC:G2xx:5', 'LC:Gx4x:8' ];

      assert.strictEqual(puzzle[2][3], 6);
      assert.isNotOk(clues.possible.rows[2].has(6));
      assert.isNotOk(clues.possible.columns[3].has(6));
      assert.isNotOk(clues.possible.grids[1].has(6));
      assert.isNull(clues.remaining[2][3]);
      assert.isAtMost(clues.count, 48);
      assert.isAtLeast(clues.pseudoCount, 1);
      assert.isAtLeast(operations.subset, 1);
      assert.isOk(operations.subsetSet.has(expectedTrail[0]));
      assert.deepStrictEqual(trail, expectedTrail);
    });
  });
});
