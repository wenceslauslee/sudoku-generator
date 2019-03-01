const generator = require('./generator');
const solver = require('./solver');

const puzzle = generator.generate();
console.log(puzzle);
solver.solve(puzzle);
