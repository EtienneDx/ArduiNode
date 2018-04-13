# ArduiNode
ArduiNode is a browser visual arduino code editor, inspired by the blueprint system of Unreal Engine 4.
## Getting started
For the time being, the ArduiNode application isn't available online.
You can however run it locally, following these simple steps.

### Prerequisites
The application uses [npm](https://www.npmjs.com) to run.
You therefore need to [get npm](https://www.npmjs.com/get-npm) on your machine.

### Installing
Now that you have npm on your machine, clone the repository, open a command window in the 'arduinode' folder, and type this command :

    npm install

This command will install all the project dependencies. Once this command has finished to run, run another command :

    npm start

This will start the application into your brower, and you'll be good to go.

## Usage
Once you have the application running, you can simply add nodes by clicking on their names in the toolbar on the right panel, and add variables on the left panel.
Variables type and default values can be set by using the 'Details' button.
You can delete nodes / inputs connections by holding the 'Alt' key and clicking on the node / connector.

<!> The setup node is hidden under the loop one when openning the app, this will be solved shortly

Once you're satisfied with your sketch, simply press the 'Generate code' button on the top left on the screen, and the code will be written into the browser console.
To access this console, press 'Ctrl+Shift+J' on windows and linux or 'Command+Options+J' on mac.
You'll then be able to copy the code, paste it into an .ino file, and upload it to any Arduino card, by using the usual IDE.

More details on the [wiki](https://github.com/EtienneDx/ArduiNode/wiki/How-to-use-ArduiNode)

## Contributing
This project is still in development, and I'd therefore like any support you can provide, either from a feedback point of view and bug reporting, or from actual coding.
Please read to the [contributing guide](CONTRIBUTING.md) for more informations about how to contribute.

## Code of conduct
Please respect the [code of conduct](CODE_OF_CONDUCT.md), to keep a good atmosphere on the project.

## Authors
* Etienne Desrousseaux - Initial work

## License
This project is licensed under the MIT License - See [License](LICENSE) file for details.
