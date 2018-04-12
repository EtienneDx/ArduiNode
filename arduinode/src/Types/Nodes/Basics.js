export default [
  {
    name : "if",
    inputs : [
      {
        type : "Execution",
        name : "exec"
      },
      {
        type : "Boolean",
        name : "condition",
      },
    ],
    outputs : [
      {
        type : "Execution",
        name : "exec",
      },
      {
        type : "Execution",
        name : "true"
      },
      {
        type : "Execution",
        name : "false"
      },
    ],
    needsExecution : true,
    becomes :
`if(<<inputs:condition>>) {
  <<outputs:true>>
}<<outputs:false?>>
else {
  <<outputs:false>>
}
<</outputs:false?>>
<<outputs:exec>>`,
  },
  {
	name : "Not",
	inputs : [
		{
			type : "Boolean",
			name : ""
		},
	],
	outputs : [
		{
			type : "Boolean",
			name : ""
		},
	],
  needsExecution: false,
	becomes : `!<<inputs:>>`,
	globalVars : [
	]
},
]
