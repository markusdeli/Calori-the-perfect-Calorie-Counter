/* eslint-env node */

const AppServer = require("./lib/AppServer.js");

var server;

/*
 * Sicherstellen dass die NODE_ENV Umgebungsvariable
 * auf einen gültigen Wert gesetzt wurde
 */
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "development") {
    console.error("Please set the NODE_ENV environment variable to either 'development' or 'production'.");
    process.exit(1);
}

/**
 * Überprüft ob die Anzahl an Argumenten stimmt. Falls nicht, wird eine kurze
 * Beschreibung der benötigten Argumente ausgegeben und das programm beendet.
 */
function checkArgs() {
    if (process.argv.length < 3) {
        console.error(
`Usage: ${process.argv[0]} ${process.argv[1]} <frontend> [<port>]

If the NODE_ENV environment variable is "production", <frontend> specifies the
directory relative to the current directory.  If it is "development", <frontend>
specifies the address the parcel development server is listening on.

If <port> is unspecified, it defaults to 8000.`
        );
        process.exit(1);
    }
}

/**
 * Starts webserver to serve files from "/app" folder
 */
function init() {
    checkArgs();

    // Access command line parameters from start command (see package.json)
    let clientLocation = process.argv[2]; // folder with client files
    let appPort = process.argv[3]; // port to use for serving static files
    server = new AppServer(clientLocation);
    server.start(appPort);
}

init();
