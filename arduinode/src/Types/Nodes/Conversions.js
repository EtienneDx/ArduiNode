export default [
    {
        name: "Int to Bool",
        inputs: [{
            type: "Int",
            name: "i"
        }, ],
        outputs: [{
            type: "Boolean",
            name: "b"
        }, ],
        needsExecution: false,
        becomes: `<<inputs:i>>`,
        globalVars: []
    },
]
