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
                name: "A"
            },
            {
                type: "Int",
                name: "B"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> > <<inputs:B>>)`,
        defaultValue : {
          "A" : 0,
          "B" : 0,
        }
    },
    {
        name: "Int >=",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> >= <<inputs:B>>)`,
        defaultValue : {
          "A" : 0,
          "B" : 0,
        }
    },
    {
        name: "Int <",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> < <<inputs:B>>)`,
        defaultValue : {
          "A" : 0,
          "B" : 0,
        }
    },
    {
        name: "Int <=",
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
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> <= <<inputs:B>>)`,
        defaultValue : {
          "A" : 0,
          "B" : 0,
        }
    },
    {
        name: "==",
        inputs: [{
                type: "any",
                name: "A"
            },
            {
                type: "any",
                name: "B"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> == <<inputs:B>>)`,
    },
    {
        name: "!=",
        inputs: [{
                type: "any",
                name: "A"
            },
            {
                type: "any",
                name: "B"
            },
        ],
        outputs: [{
            type: "Boolean",
            name: ""
        }, ],
        needsExecution: false,
        becomes: `(<<inputs:A>> != <<inputs:B>>)`,
    },
]
