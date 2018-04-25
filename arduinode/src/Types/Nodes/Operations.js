export default [
    {
        name: "Not",
        inputs: [{
            type: "Boolean",
            name: ""
        }, ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `!<<inputs:>>`,
        globalVars: []
    },
    {
        name: "AND",
        inputs: [{
                type: "Boolean",
                name: ""
            },
            {
                type: "Boolean",
                name: "_"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:>> && <<inputs:_>>)`,
        globalVars: [],
    },
    {
        name: "OR",
        inputs: [{
                type: "Boolean",
                name: ""
            },
            {
                type: "Boolean",
                name: "_"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:>> ¦¦ <<inputs:_>>)`,
        globalVars: [],
    },
    {
        name: "Int x Int",
        inputs: [{
                type: "Int",
                name: "i"
            },
            {
                type: "Int",
                name: "j"
            },
        ],
        outputs: [{
            type: "Int",
            name: "i"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> * <<inputs:j>>)`,
        globalVars: []
    },
    {
        name: "Int + Int",
        inputs: [{
                type: "Int",
                name: "i"
            },
            {
                type: "Int",
                name: "j"
            },
        ],
        outputs: [{
            type: "Int",
            name: "i"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> + <<inputs:j>>)`,
        globalVars: []
    },
    {
        name: "Int / Int",
        inputs: [{
                type: "Int",
                name: "i"
            },
            {
                type: "Int",
                name: "j"
            },
        ],
        outputs: [{
            type: "Int",
            name: "i"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> / <<inputs:j>>)`,
        globalVars: []
    },
    {
        name: "Int - Int",
        inputs: [{
                type: "Int",
                name: "i"
            },
            {
                type: "Int",
                name: "j"
            },
        ],
        outputs: [{
            type: "Int",
            name: "i"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> - <<inputs:j>>)`,
        globalVars: []
    },
    {
        name: "Int % Int",
        inputs: [{
                type: "Int",
                name: "i"
            },
            {
                type: "Int",
                name: "j"
            },
        ],
        outputs: [{
            type: "Int",
            name: "i"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> % <<inputs:j>>)`,
        globalVars: []
    },
]
