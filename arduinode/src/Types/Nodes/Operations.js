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
        defaultValue : {
          "" : true,
        }
    },
    {
        name: "AND",
        inputs: [{
                type: "Boolean",
                name: "A"
            },
            {
                type: "Boolean",
                name: "B"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: "A and B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> && <<inputs:B>>)`,
        defaultValue : {
          A : true,
          B : true,
        }
    },
    {
        name: "OR",
        inputs: [{
                type: "Boolean",
                name: "A"
            },
            {
                type: "Boolean",
                name: "B"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: "A or B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> ¦¦ <<inputs:B>>)`,
        defaultValue : {
          A : true,
          B : true,
        }
    },
    {
        name: "Int x Int",
        inputs: [{
                type: "Int",
                name: "A"
            },
            {
                type: "Int",
                name: "B"
            },
        ],
        outputs: [{
            type: "Int",
            name: "A x B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> * <<inputs:B>>)`,
        defaultValue : {
          A : 0,
          B : 0,
        }
    },
    {
        name: "Int + Int",
        inputs: [{
                type: "Int",
                name: "A"
            },
            {
                type: "Int",
                name: "B"
            },
        ],
        outputs: [{
            type: "Int",
            name: "A + B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> + <<inputs:B>>)`,
        defaultValue : {
          A : 0,
          B : 0,
        }
    },
    {
        name: "Int / Int",
        inputs: [{
                type: "Int",
                name: "A"
            },
            {
                type: "Int",
                name: "B"
            },
        ],
        outputs: [{
            type: "Int",
            name: "A / B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> / <<inputs:B>>)`,
        defaultValue : {
          A : 0,
          B : 0,
        }
    },
    {
        name: "Int - Int",
        inputs: [{
                type: "Int",
                name: "A"
            },
            {
                type: "Int",
                name: "B"
            },
        ],
        outputs: [{
            type: "Int",
            name: "A - B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> - <<inputs:B>>)`,
        defaultValue : {
          A : 0,
          B : 0,
        }
    },
    {
        name: "Int % Int",
        inputs: [{
                type: "Int",
                name: "A"
            },
            {
                type: "Int",
                name: "B"
            },
        ],
        outputs: [{
            type: "Int",
            name: "A % B"
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> % <<inputs:B>>)`,
        defaultValue : {
          A : 0,
          B : 0,
        }
    },
]
