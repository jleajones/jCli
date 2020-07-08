#!/usr/bin/env node
require = require('esm')(module /*, options*/);
require('../src/model').cli(process.argv);
