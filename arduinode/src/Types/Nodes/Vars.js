export default [
  {
    name : "Get",
    inputs : [
    ],
    outputs : [
      {
        type : "Pin",
        name : "value"
      },
    ],
    needsExecution : false,
    becomes : `<<var>>`
  },
  {
	name : "Set",
	inputs : [
		{
			type : "Execution",
			name : "exec"
		},
		{
			type : "Bool",
			name : "value"
		},
	],
	outputs : [
		{
			type : "Execution",
			name : "exec"
		},
	],
	needsExecution : true,
	becomes : `<<var>> = <<inputs:value>>;
`
},
]
