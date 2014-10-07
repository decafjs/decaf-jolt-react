var Application = require('decaf-jolt').Application,
    StaticServer = require('decaf-jolt-static').StaticServer,
    StaticFile = require('decaf-jolt-static').StaticFile,
    ReactServer = require('decaf-jolt-react').ReactServer,
    app = new Application();

app.verb('/', new StaticFile('index.html'));
app.verb('bower_components', new StaticServer('bower_components'));
app.verb('hello', new StaticFile('helloworld.html'));
app.verb('hello2', new StaticFile('hello2.html'));
app.verb('jsx', new ReactServer('jsx'));

app.listen(9090, '0.0.0.0');
console.log('react demo running at http://0.0.0.0:9090/');
