/*global require */

"use strict";

var JSXTransformer = require('react/JSXTransformer'),
    Semaphore = require('Threads').Semaphore,
    File = require('File');

function getScript(me, path) {
    me.semaphore.lock();
    try {
        var cache = me.cache,
            file;

        var script = cache[path];
        if (!script) {
            file = new File(path);
            if (file.isDirectory()) {
                file = new File(path + '/index.jsx');
                if (!file.exists) {
                    return 403;
                }
            }
            else if (!file.exists()) {
                file = new File(path + '.jsx');
                if (!file.exists()) {
                    return 404;
                }
            }
            cache[path] = script = {
                file: file,
                lastModified: 0
            };
        }
        else {
            file = script.file;
        }
        var lastModified = file.lastModified();
        if (lastModified > script.lastModified) {
            script.source = file.readAll();
            script.compiled = JSXTransformer.transform(script.source);
            script.lastModified = lastModified;
        }
        return script;
    }
    finally {
        me.semaphore.unlock();
    }
}

function runScript(me, req, res) {
    var script = getScript(me, me.path + '/' + req.args.join('/'));
    if (!script.fn) {
        return script;
    }
    res.compiled = script.compiled;
    res.source = script.source;
    res.writeHead({ 'Content-Type' : 'application/javascript'});
    res.end(res.compiled);
}

/**
 * Jolt verb to serve React JSX files from a directory tree.
 *
 * Typical usage is going to be something like:
 *
 *      app.verb('route', new ReactServer('path/to/jsx/files');
 *
 * @constructor
 * @param {string} path path in file system to serve .jsx files from
 * @returns {Object} config suitable for use with Application.verb()
 */
function ReactServer(path) {
    return {
        path: path,
        semaphore: new Semaphore(),
        cache: {},
        handler: function(me, req, res) {
            return runScript(me, req, res);
        }
    };
}

decaf.extend(ReactServer.prototype, {

});

decaf.extend(exports, {
    ReactServer: ReactServer
});
