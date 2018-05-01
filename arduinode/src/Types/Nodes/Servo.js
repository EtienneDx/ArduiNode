export default [
{
	name : "Write to servo",
	inputs : [
		{
			type : "Execution",
			name : "exec"
		},
		{
			type : "Servo",
			name : "servo"
		},
		{
			type : "Int",
			name : "rotation"
		},
  ],
	outputs : [
		{
			type : "Execution",
			name : "exec"
		},
  ],
  imports : "<Servo.h>",
	needsExecution : true,
	becomes : `<<inputs:servo>>.write(<<inputs:rotation>>);
<<outputs:exec>>`,
defaultValue : {
	rotation : 0,
}
},
{
	name : "Read servo angle",
	inputs : [
		{
			type : "Servo",
			name : "servo"
		},
  ],
	outputs : [
		{
			type : "Int",
			name : "angle"
		},
  ],
  imports : "<Servo.h>",
	needsExecution : false,
	becomes : `<<inputs:servo>>.read()`,
defaultValue : {}
},
];
