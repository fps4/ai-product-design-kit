#!/usr/bin/env node
// whosigns — executable entry point; the commands live in main.ts.

import { main } from './main.js';

main(process.argv.slice(2)).then((code) => process.exit(code));
