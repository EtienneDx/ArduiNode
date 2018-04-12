export default [
  {
    name : "Setup",
    inputs : [],
    outputs : [
      {
        type : "Execution",
        name : "exec",
      },
    ],
    needsExecution : false,
    becomes :
`// setup is called once
void setup() {
  /*****Vars setup*****/
  <<vars_setup>>

  /*****Code*****/
  <<outputs:exec>>
}
`,
    isStartupPoint : true,
  },
  {
    name : "Loop",
    inputs : [],
    outputs : [
      {
        type : "Execution",
        name : "exec",
      },
    ],
    needsExecution : false,
    becomes :
`// loop is called over and over
void loop() {
  <<outputs:exec>>
}
`,
    isStartupPoint : true,
  },
  {
    name : "Digital write",
    inputs : [
      {
        type : "Execution",
        name : "exec",
      },
      {
        type : "Pin",
        name : "pin"
      },
      {
        type : "Boolean",
        name : "value"
      }
    ],
    outputs : [
      {
        type : "Execution",
        name : "exec"
      },
    ],
    needsExecution : true,
    becomes :
`digitalWrite(<<inputs:pin>>, <<inputs:value>>);
<<outputs:exec>>`
  },
  {
	name : "Digital read",
	inputs : [
    {
			type : "Pin",
			name : "pin"
		},
	],
	outputs : [
    {
			type : "Boolean",
			name : "value",
		},
	],
  needsExecution : false,
	becomes :
`digitalRead(<<inputs:pin>>)`,
	globalVars : []
},
{
	name : "Delay",
	inputs : [
		{
			type : "Execution",
			name : "exec"
		},
		{
			type : "Int",
			name : "duration"
		},
	],
	outputs : [
		{
			type : "Execution",
			name : "exec"
		},
	],
	needsExecution : true,
	becomes :
`delay(<<inputs:duration>>);
<<outputs:exec>>`
},
]
