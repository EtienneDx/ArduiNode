export default [{
        name: "if",
        inputs: [{
                type: "Execution",
                name: "exec"
            },
            {
                type: "Boolean",
                name: "condition",
            },
        ],
        outputs: [{
                type: "Execution",
                name: "exec",
            },
            {
                type: "Execution",
                name: "true"
            },
            {
                type: "Execution",
                name: "false"
            },
        ],
        needsExecution: true,
        becomes: `if(<<inputs:condition>>) {
  <<outputs:true>>
}<<outputs:false?>>
else {
  <<outputs:false>>
}
<</outputs:false?>>
`,
    },
    {
        name: "Int >",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> > <<inputs:j>>)`,
    },
    {
        name: "Int >=",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> >= <<inputs:j>>)`,
    },
    {
        name: "Int <",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> < <<inputs:j>>)`,
    },
    {
        name: "Int <=",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> <= <<inputs:j>>)`,
    },
    {
        name: "==",
        inputs: [{
                type: "any",
                name: "i"
            },
            {
                type: "any",
                name: "j"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> == <<inputs:j>>)`,
    },
    {
        name: "!=",
        inputs: [{
                type: "any",
                name: "i"
            },
            {
                type: "any",
                name: "j"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:i>> != <<inputs:j>>)`,
    },
]
