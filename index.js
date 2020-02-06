'format cjs';

const engine = require('./engine');
const conventionalCommitTypes = require('./commons/types');
const configLoader = require('commitizen').configLoader;

var config = configLoader.load();
var options = {
  types: conventionalCommitTypes.types,
  defaultType: 'Utilice las teclas de dirección',
  defaultScope: process.env.CZ_SCOPE || config.defaultScope,
  defaultSubject: process.env.CZ_SUBJECT || config.defaultSubject,
  defaultBody: process.env.CZ_BODY || config.defaultBody,
  defaultIssues: process.env.CZ_ISSUES || config.defaultIssues,
  disableScopeLowerCase:
    process.env.DISABLE_SCOPE_LOWERCASE || config.disableScopeLowerCase,
  maxHeaderWidth:
    (process.env.CZ_MAX_HEADER_WIDTH &&
      parseInt(process.env.CZ_MAX_HEADER_WIDTH)) ||
    config.maxHeaderWidth ||
    100,
  maxLineWidth:
    (process.env.CZ_MAX_LINE_WIDTH &&
      parseInt(process.env.CZ_MAX_LINE_WIDTH)) ||
    config.maxLineWidth ||
    100
};

(function(options) {
  try {
    var commitlintLoad = require('@commitlint/load');
    commitlintLoad().then(function(clConfig) {
      if (clConfig.rules) {
        var maxHeaderLengthRule = clConfig.rules['header-max-length'];
        if (
          typeof maxHeaderLengthRule === 'object' &&
          maxHeaderLengthRule.length >= 3 &&
          !process.env.CZ_MAX_HEADER_WIDTH &&
          !config.maxHeaderWidth
        ) {
          options.maxHeaderWidth = maxHeaderLengthRule[2];
        }
      }
    });
  } catch (err) {}
})(options);

module.exports = engine(options);
