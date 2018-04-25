export default [
    {
        name: "For Loop",
        inputs: [{
                type: "Execution",
                name: "exec"
            },
            {
                type: "Int",
                name: "from"
            },
            {
                type: "Int",
                name: "until"
            },
        ],
        outputs: [{
                type: "Execution",
                name: "loop"
            },
            {
              type: "Int",
              name: "index",
              becomes: `i`,
            },
            {
                type: "Execution",
                name: "then"
            },
        ],
        needsExecution: true,
        becomes: `for(int i = <<inputs:from>>; i < <<inputs:until>>; i++)
{
    <<outputs:loop>>
}
<<outputs:then>>`,
        globalVars: [],
    },
    {
        name: "Inverse For Loop",
        inputs: [{
                type: "Execution",
                name: "exec"
            },
            {
                type: "Int",
                name: "from"
            },
            {
                type: "Int",
                name: "until"
            },
        ],
        outputs: [{
                type: "Execution",
                name: "loop"
            },
            {
              type: "Int",
              name: "index",
              becomes: `i`,
            },
            {
                type: "Execution",
                name: "then"
            },
        ],
        needsExecution: true,
        becomes: `for(int i = <<inputs:from>>; i > <<inputs:until>>; i--)
{
    <<outputs:loop>>
}
<<outputs:then>>`,
        globalVars: [],
    },
    {
        name: "While Loop",
        inputs: [{
                type: "Execution",
                name: "exec"
            },
            {
                type: "Boolean",
                name: "condition"
            },
        ],
        outputs: [{
                type: "Execution",
                name: "loop"
            },
            {
                type: "Execution",
                name: "then"
            },
        ],
        needsExecution: true,
        becomes: `while(<<inputs:condition>>)
{
    <<outputs:loop>>
}
<<outputs:then>>`,
        globalVars: [],
    },
    {
        name: "Do While Loop",
        inputs: [{
                type: "Execution",
                name: "exec"
            },
            {
                type: "Boolean",
                name: "condition"
            },
        ],
        outputs: [{
                type: "Execution",
                name: "loop"
            },
            {
                type: "Execution",
                name: "then"
            },
        ],
        needsExecution: true,
        becomes: `do
{
    <<outputs:loop>>
} while(<<inputs:condition>>);
<<outputs:then>>`,
        globalVars: [],
    },
    {
        name: "Break Loop",
        inputs: [{
            type: "Execution",
            name: "exec"
        }, ],
        outputs: [],
        needsExecution: true,
        becomes: `break;`,
        globalVars: [],
    },
    {
        name: "Continue Loop",
        inputs: [{
            type: "Execution",
            name: "exec"
        }, ],
        outputs: [],
        needsExecution: true,
        becomes: `continue;`,
        globalVars: [],
    },
]
