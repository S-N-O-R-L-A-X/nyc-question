const gene = require("./findString.js");

module.exports = {
    findInput(PATH, f) {
        const instrumented_code = f;
        const solutions = [];
        let coverage = 0; // record coverage now
        console.log(PATH);
        console.log(global.__coverage__)
        while (global.__coverage__[PATH].b[0].indexOf(0) !== -1) { // do while not all covered
            const param1 = Math.random();
            f(param1);
            const tmp = global.__coverage__[PATH].b[0]; // get coverage of branches
            const covered = [], uncovered = [];

            // get all covered and uncovered branch indices
            tmp.forEach((elem, index) => {
                if (elem > 0) {
                    covered.push(index);
                }
                else {
                    uncovered.push(index);
                }
            })

            /* istanbul ignore next */
            if (covered.length > coverage) { // update solution when coverage increases
                coverage = covered;
                solutions.push([param1]);
            }
            else {

                const modified_function = Function('return ' + instrumented_code)();
                const res = gene.findString("valentine", modified_function);
                f(res);

                solutions.push([res]);
            }
        }
        return solutions;
    }
}