const babelParser = require('@babel/parser');
const traverse = require("@babel/traverse");
const types = require('@babel/types');
const generator = require('@babel/generator');
const template = require('@babel/template')

// define a variable to get branch info
const get_branches = [];

// define a statistics template
let instrumented_statisticsTemplate = `
    instrumented_statistics.left=LEFT;
    instrumented_statistics.right=RIGHT;
`;

// 创建模板
const temp = template.default(instrumented_statisticsTemplate);

module.exports = {
    transform(func) {
        const code = func.toString();
        const ast = babelParser.parse(code);
        traverse.default(ast, {
            FunctionDeclaration(path) {
                path.node.body.body.unshift(types.assignmentExpression("=", types.identifier("instrumented_statistics"), types.objectExpression([])));
                path.node.body.body.push(types.returnStatement(types.objectExpression([])));
            },
            ReturnStatement(path) {
                path.node.argument = types.objectExpression([types.objectProperty(types.stringLiteral("ret"), path.node.argument), types.objectProperty(types.stringLiteral("instrumented_statistics"), types.identifier("instrumented_statistics"))]);
            },
            IfStatement(path) {
                get_branches.push(path.node);

                // add what we need before an if statement
                /* istanbul ignore next */
                const needed_arguments = {
                    LEFT: path.node.test.left,
                    RIGHT: path.node.test.right,
                };

                // 通过temp创建所需语句的AST节点
                const newNode = temp(needed_arguments);

                path.insertBefore(newNode);
            }
        });

        const instrumented_code = generator.default(ast).code;
        return {
            instrumented_code, get_branches
        };
    }
}