#!/usr/bin/env node
require = require('esm')(module /*, options*/);
require('../src/service').cli(process.argv);
