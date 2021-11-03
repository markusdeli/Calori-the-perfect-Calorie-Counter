/* eslint-env node */

const path = require("path");
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const ApiRoute = require("./routes/ApiRoute");

const MealRepository = require("./data/MealRepository");
const MealTypeRepository = require("./data/MealTypeRepository");
const SportRepository = require("./data/SportRepository");
const UserRepository = require("./data/UserRepository");

const DatabaseWrapper = require("./util/sqlite/DatabaseWrapper");
const SQLiteMealDataSource = require("./data/sqlite/SQLiteMealDataSource");
const SQLiteMealTypeDataSource = require("./data/sqlite/SQLiteMealTypeDataSource");
const SQLiteSportDataSource = require("./data/sqlite/SQLiteSportDataSource");
const SQLiteUserDataSource = require("./data/sqlite/SQLiteUserDataSource");

/**
 * Der Standard-Port auf dem gelauscht werden soll wenn keiner explizit
 * angegeben wird.
 *
 * @type {number}
 */
const DEFAULT_PORT = 8000;

/**
 * Die Hauptklasse zur Verwaltung des Servers
 *
 * @property {Express} app Die Express-Instanz
 * @property {string?} appDir Der content root für alle Client-Dateien
 * @property {Server?} server Der HTTP-Server. Wird beim Aufruf von
 *     {@link #start} erstellt.
 */
class AppServer {

    /**
     * Erstellt einen neuen App-Server der auf localhost lauschen wird.
     * Der Server muss mit {@link #start} gestartet werden.
     *
     * @constructor
     * @param {string} appLocation Wenn `NODE_ENV=production`, dann das
     *     Verzeichnis des vorkompilierten HTML content roots.
     *     Wenn `NODE_ENV=development`, dann die Adresse des Entwicklungsservers
     *     von Parcel (z.B. localhost:1234).
     */
    constructor(appLocation) {
        this._db = new DatabaseWrapper("database.db");

        this._initRepos();

        this.app = express();
        this.app.use(morgan("combined"));
        this.app.use(bodyParser.json());
        this.app.use("/api", new ApiRoute(this).router);

        // Content root für clients
        if (process.env.NODE_ENV === "development") {
            console.log("Initializing in development mode");
            this.app.use("/", require("express-http-proxy")(appLocation));
        } else {
            console.log("Initializing in production mode");
            this.appDir = path.join(__dirname, "../", appLocation);
            this.app.use("/", express.static(this.appDir));
        }

        // Catchall-Handler für alle unerwarteten serverseitigen Fehler
        this.app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
            console.error(err);

            res.status(500).json({
                err: true,
                msg: "Interner Serverfehler",
            });
        });
    }

    /**
     * Returnt das Repository des angegebenen Typs
     *
     * @param {string} type Der Typ des Repositories
     */
    getRepo(type) {
        return this._repos[type];
    }

    /**
     * Startet den Server auf dem angegebenen Port
     *
     * @param {number} [_port=DEFAULT_PORT] Der Port auf dem gelauscht werden
     *     soll. Wenn nicht angegeben, wird standardmäßig Port 8000 verwendet.
     */
    start(_port) {
        /** @type {number} */
        let port = _port;
        if (typeof port !== "number") {
            port = DEFAULT_PORT;
        }

        this.server = this.app.listen(port, function() {
            console.log(
                `AppServer started. Client available at http://localhost:${port},`,
                "API root is /api.",
            );
        });
    }

    /**
     * Stoppt den bereits laufenden Server
     */
    stop() {
        if (this.server === undefined) {
            return;
        }

        this.server.close();
    }

    /**
     * Initialisiert alle Repositories.
     * Muss vor dem Erstellen der Routen aufgerufen werden.
     *
     * @private
     */
    _initRepos() {
        this._repos = {
            meal: new MealRepository(),
            meal_type: new MealTypeRepository(),
            sport: new SportRepository(),
            user: new UserRepository(),
        };

        this._repos.meal.addDataSource(new SQLiteMealDataSource(this._db));
        this._repos.meal_type.addDataSource(new SQLiteMealTypeDataSource(this._db));
        this._repos.sport.addDataSource(new SQLiteSportDataSource(this._db));
        this._repos.user.addDataSource(new SQLiteUserDataSource(this._db));
    }

}
module.exports = AppServer;
