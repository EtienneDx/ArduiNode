export default [
    {
        name: "Int to Bool",
        inputs: [{
            type: "Int",
            name: "int"
        }, ],
        outputs: [{
            type: "Boolean",
            name: "bool"
        }, ],
        needsExecution: false,
        becomes: `<<inputs:int>>`,
        defaultValue : {
          "int" : 0,
        }
    },
]
