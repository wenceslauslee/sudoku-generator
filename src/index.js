var _ = require('underscore');

function doSomething () {
  var somethingRandom = _.range(10);

  return somethingRandom;
};

module.exports = {
  doSomething: doSomething
};
