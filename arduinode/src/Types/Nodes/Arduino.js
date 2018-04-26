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
`,
    defaultValue : {
      "value" : "true",
    }
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
`,
    defaultValue : {
      "duration" : 500,
    }
},
{
	name : "Delay Microseconds",
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
	becomes : `delayMicroseconds(<<inputs:duration>>);
`,
    defaultValue : {
      "duration" : 500,
    }
},
{
	name : "Analog Write",
	inputs : [
		{
			type : "Execution",
			name : "exec"
		},
		{
			type : "Pin",
			name : "pin"
		},
		{
			type : "Int",
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
	becomes : `analogWrite(<<inputs:pin>>, <<inputs:value>>);
`,
    defaultValue : {
      "value" : 500,
    }
},
{
	name : "Analog Read",
	inputs : [
		{
			type : "Pin",
			name : "pin"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "value"
		},
	],
	needsExecution : false,
	becomes : `analogRead(<<inputs:pin>>)`,
  defaultValue : {
    "value" : 500,
  }
},
{
	name : "Micros",
	inputs : [
	],
	outputs : [
		{
			type : "Int",
			name : "micros"
		},
	],
	needsExecution : false,
	becomes : `micros()`,
},
{
	name : "Millis",
	inputs : [
	],
	outputs : [
		{
			type : "Int",
			name : "millis"
		},
	],
	needsExecution : false,
	becomes : `millis()`,
},
{
	name : "Absolute",
	inputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "i"
		},
	],
	needsExecution : false,
	becomes : `abs(<<inputs:i>>)`,
},
{
	name : "Int Max",
	inputs : [
		{
			type : "Int",
			name : "A"
		},
		{
			type : "Int",
			name : "B"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "max"
		},
	],
	needsExecution : false,
	becomes : `max(<<inputs:A>>, <<inputs:B>>)`,
  defaultValue : {
    "A" : 0,
    "B" : 0,
  }
},
{
	name : "Int Min",
	inputs : [
		{
			type : "Int",
			name : "A"
		},
		{
			type : "Int",
			name : "B"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "min"
		},
	],
	needsExecution : false,
	becomes : `min(<<inputs:A>>, <<inputs:B>>)`,
  defaultValue : {
    "A" : 0,
    "B" : 0,
  }
},
{
	name : "Int Pow",
	inputs : [
		{
			type : "Int",
			name : "A"
		},
		{
			type : "Int",
			name : "B"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "pow"
		},
	],
	needsExecution : false,
	becomes : `pow(<<inputs:A>>, <<inputs:B>>)`,
  defaultValue : {
    "A" : 0,
    "B" : 0,
  }
},
{
	name : "Int Sqrt",
	inputs : [
		{
			type : "Int",
			name : "A"
		},
	],
	outputs : [
		{
			type : "Int",
			name : "sqrt"
		},
	],
	needsExecution : false,
	becomes : `sqrt(<<inputs:A>)`,
  defaultValue : {
    "A" : 0,
  }
},
]
