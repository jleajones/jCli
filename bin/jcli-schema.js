#!/usr/bin/env node
require = require('esm')(module /*, options*/);
require('../src/schema').cli(process.argv);
