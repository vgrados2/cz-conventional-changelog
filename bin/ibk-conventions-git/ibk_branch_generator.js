#!/usr/bin/env node
const options = require('../../modules/ibk-conventions-git/commons/types-branches');
const assiConventionalGit = require('../../modules/ibk-conventions-git/ibk_branch_generator');
assiConventionalGit.newBranchGenerator(options);
