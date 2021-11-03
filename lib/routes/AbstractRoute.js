/* eslint-env node */

const express = require("express");

/**
 * Eine Sammlung von Middlewares für jede einzelne HTTP Request Method.
 *
 * @typedef {object} MiddlewareDef
 * @prop {function[]} get Alle Middleware-Handler für GET Anfragen
 * @prop {function[]} post Alle Middleware-Handler für POST Anfragen
 * @prop {function[]} put Alle Middleware-Handler für PUT Anfragen
 * @prop {function[]} delete Alle Middleware-Handler für DELETE Anfragen
 */

/**
 * Abstrakte Basisklasse für alle API-Routen.
 * Jede Instanz dieser Klasse repräsentiert ein einzelnes Pfadsegment im gedachten Baum der
 * API-Pfade. Child-Klassen können über die Definition der Methoden `get`, `post`, `put`
 * und `delete` einzelne Request Handler für ihre Route definieren. Die ihnen voranzustellende(n)
 * Middleware(s) kann/können dann durch Overriding des `middleware` getters definiert werden.
 *
 * @abstract
 */
class AbstractRoute {

    /**
     * Erstellt eine neue Route.
     *
     * Child-Klassen sollten hier ihre einzelnen Children und Endpoints hinzufügen.
     * Der super-Konstruktor muss immer **zuerst** aufgerufen werden.
     *
     * @param {string} name Der Name des Pfadsegments
     * @param {import("../AppServer")} server Die AppServer-Instanz
     */
    constructor(name, server) {
        this._router = express.Router();

        /**
         * Das interne Speicherfeld des Routennamens.
         *
         * @private
         */
        this._name = name;

        /** @private */
        this._server = server;

        setTimeout(() => this._createEndpoints());
    }

    /**
     * @abstract
     * @readonly
     * @type {MiddlewareDef}
     */
    get middleware() {
        return {
            get: [],
            post: [],
            put: [],
            delete: [],
        };
    }

    /**
     * Alle Routen die dieser Route untergeordnet sind
     *
     * @readonly
     * @abstract
     * @type {AbstractRoute[]}
     */
    get children() {
        return [];
    }

    _createEndpoints() {
        for (const childRoute of this.children) {
            this.router.use(`/${childRoute.name}`, childRoute.router);
        }

        const allMiddleware = this.middleware;
        for (const methodName of ["get", "post", "put", "delete"]) {
            if (typeof this[methodName] === "function") {
                let middleware = allMiddleware[methodName];
                if (!Array.isArray(middleware)) {
                    middleware = [];
                }

                this.router[methodName]("/", ...middleware, this[methodName].bind(this));
            }
        }
    }

    /**
     * Der Name dieses Pfadsegments
     *
     * @readonly
     */
    get name() {
        return this._name;
    }

    /**
     * Die Instanz des Express-Routers die von diesem Objekt verwaltet wird
     *
     * @readonly
     * @type {import("express").Router}
     */
    get router() {
        return this._router;
    }

    /**
     * Die AppServer Instanz zum Zugriff auf Repositories
     *
     * @protected
     * @readonly
     * @type {import("../AppServer")}
     */
    get server() {
        return this._server;
    }

}
module.exports = AbstractRoute;
