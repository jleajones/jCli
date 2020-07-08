#!/usr/bin/env node
require = require('esm')(module /*, options*/);
require('../src/init').cli(process.argv);
