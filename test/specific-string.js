/**
 * use this command to run:
 * nyc --reporter=text --report-dir=./nyc_output node specific-string.js
 */
const { findInput } = require("./findInput");

const f = require("./origin");

const PATH = 'E:\\Github\\nyc-question\\test\\origin.js'

const solutions = findInput(PATH, f);

solutions.forEach((item, idx) => {
    console.log(`test ${idx}: ${item}`);
})

