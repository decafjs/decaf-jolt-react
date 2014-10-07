decaf-jolt-react
================

React module for decafjs jolt

React is Facebook's "JavaScript Library for Building User Interfaces."  It is fully documented here:

* http://facebook.github.io/react/index.html

## Installation

```
% bower install decaf-jolt-react
```

## How it Works
This module provides a helper, ReactServer, for the Jolt application framework.  This helperwatches a directory
of .jsx files.  The first time a .jsx file is requested, it is transformed from JSX format to pure JavaScript.
The JavaScript is cached by ReactServer so that when the same .jsx file is requested again, the transformed
JavaScript is served, bypassing the transform step.  If you edit the .jsx file on disk, ReactServer will load the
new JSX source, transform it, cache it, and serve that version from then on.

Assume you have created a jsx/ subdirectory in your application root directory.  To serve .jsx files from there, you
will implement something like this in your Jolt main source .js file:

```javascript
// Example Jolt application to demo React integration with DecafJS
var Application = require('decaf-jolt').Application,
    StaticServer = require('decaf-jolt-static').StaticServer,
    StaticFile = require('decaf-jolt-static').StaticFile,
    ReactServer = require('decaf-jolt-react').ReactServer,
    app = new Application();

app.verb('/', new StaticFile('index.html'));
app.verb('bower_components', new StaticServer('bower_components'));
app.verb('hello', new StaticFile('hello1.html'));
app.verb('hello2', new StaticFile('hello2.html'));
app.verb('jsx', new ReactServer('jsx'));

app.listen(9090, '0.0.0.0');
console.log('react demo running at http://0.0.0.0:9090/');
```

The line:
```javascript
app.verb('jsx', new ReactServer('jsx'));
```
creates a jsx verb for Jolt with a ReactServer instance serving from the 'jsx' directory.  This instance of
ReactServer will serve all .jsx files from any aribtary directory structure starting at jsx/.  That is, it will
transform/cache/serve http://localhost:9090/jsx/foo/bar.jsx from ./jsx/foo/bar.jsx.

You may have more than one ReactServer instance for your application, if you desire.

The examples directory contains a fully working demonstration of React integration with DecafJS and Jolt.  Please
refer to the README.md file there for instructions on installing and running the demo.

