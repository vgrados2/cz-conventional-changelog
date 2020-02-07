'format cjs';

const engine = require('./engine');
const engine2 = require('./engine-branch');
const conventionalCommitTypes = require('./commons/types');
const options = {
  types: conventionalCommitTypes.types
};
module.exports = engine(options);
module.exports.victor = engine2(options);
