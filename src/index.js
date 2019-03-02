const generator = require('./generator');
const manipulator = require('./manipulator');
const solver = require('./solver');

const puzzle = generator.generate();
print(puzzle);

const record = {
  set: new Set(),
  list: [],
  answer: []
};
for (var i = 0; i < 20; i++) {
  manipulator.remove(puzzle, record);
}
print(puzzle);

solver.solve(puzzle);
print(puzzle);

function print(puzzle) {
  const newPuzzle = [];
  for (var i = 0; i < 9; i++) {
    const row = [];
    for (var j = 0; j < 9; j++) {
      if (puzzle[i][j] != null) {
        row.push(`${puzzle[i][j]}`);
      } else {
        row.push('N');
      }
    }
    newPuzzle.push(row);
  }

  console.log(newPuzzle);
}
