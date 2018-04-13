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
`,
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
{
	name : "Int x Int",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
		{
			type : "Int",
			name : "j"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	needsExecution : false,
	becomes : `(<<inputs:i>> * <<inputs:j>>)`,
	globalVars : [
	]
},
{
	name : "Int + Int",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
		{
			type : "Int",
			name : "j"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	needsExecution : false,
	becomes : `(<<inputs:i>> + <<inputs:j>>)`,
	globalVars : [
	]
},
{
	name : "Int / Int",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
		{
			type : "Int",
			name : "j"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	needsExecution : false,
	becomes : `(<<inputs:i>> / <<inputs:j>>)`,
	globalVars : [
	]
},
{
	name : "Int - Int",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
		{
			type : "Int",
			name : "j"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	needsExecution : false,
	becomes : `(<<inputs:i>> - <<inputs:j>>)`,
	globalVars : [
	]
},
{
	name : "Int % Int",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
		{
			type : "Int",
			name : "j"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	needsExecution : false,
	becomes : `(<<inputs:i>> % <<inputs:j>>)`,
	globalVars : [
	]
},
{
	name : "Int to Bool",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	outputs : [
		{
			type : "Boolean",
			name : "b"
		},
	],
	needsExecution : false,
	becomes : `<<inputs:i>>`,
	globalVars : [
	]
},
]
