# Contributing to ArduiNode
When contributing to this project, any help is welcomed, as long as the changes follow the same goal as the project.

Before anything, please follow this simple code of conduct : be respectful and welcomming towards other members or non members of the project.

## Pull request process
* Once your code is written, please ensure to have it commented properly, so that other users can easily understand the changes you made.
* If your code changes anything referenced to in the readme, such as the interface or the user interactions, please change the readme as well.
* <!> Test your code before pushing it <!> Check whether your code passes the tests (npm run test), and whether the application still runs properly. One way to do so is to create a blinking led program, and a program using your feature (in case you added some nodes and or variables types)

Once your code fulfil those criteria, create your pull request, and I'll review it as soon as possible.

## Needed contributions
You can check the files for '// @TODO' comments, which just point out future changes needed to the code, or check the list below :

* Add nodes type - ArduiNode is made as an alternative to traditionnal arduino programming, and therefore requires all possible instructions. You can use the 'NodeTypeCreator.html' to help you, but it's just a quickly made file for now
* Upgrade the NodeTypeCreator.html, to make it work properly and be more ergonomic
* Add var types - Same here, we need all the types that can be used in arduino
* Create a 'VarTypeCreator.html' to help create var types faster
* Add a search bar into the toolbar component to sort the nodes
* Open a floating toolbar (or the classic one) when dragging an input / output to quickly add an already connected node
* Work on the css - That's definitely an important feature to work on
* Make the added nodes appear in the middle of the screen depending on the position and zoom level
* Zoom in-out depending on the mouse pointer instead of the top-left corner
* Edit this list
* Report bugs
