/* eslint-env node */

const AbstractDataSource = require("./AbstractDataSource");

/**
 * Abstrakte Basisklasse für alle Repositories.
 *
 * Ein Repository verwaltet alle DataSources eines bestimmten Datentyps und beantwortet Anfragen der
 * Controller der einzelnen API-Endpunkte mit Daten aus derjenigen DataSource mit der geringsten
 * Metrik. Schlägt diese Anfrage fehl (etwa weil diese DataSource ein Cache der die angefragten
 * Daten noch nicht zwischengespeichert hat), so wird die DataSource mit der nächsthöheren Metrik
 * angefragt. Dieser Vorgang wiederholt sich bis eine erfolgreiche Antwort erhalten wurde oder die
 * DataSources ausgegangen sind. Mit diesem Verfahren lassen sich beisspielsweise auch ein einfaches
 * Failover-System mit zwei redundanten Datenbankservern mit sehr geringem Aufwand implementieren,
 * indem einem Repository zwei identische DataSources mit unterschiedlicher Datenbank-URL
 * hinzugefügt werden.
 */
class AbstractRepository {

    /**
     * Der Typ dieses Repositorys
     *
     * @readonly
     * @type {string}
     */
    static get type() {
        throw new Error(`Class ${this.constructor.name} does not implement the static type getter`);
    }

    /**
     * Erstellt ein neues Repository.
     * Die Child-Klasse muss den statischen {@link #type} getter implementieren.
     */
    constructor() {
        /**
         * @private
         * @type {AbstractDataSource[]}
         */
        this._dataSources = [];
    }

    /**
     * Fügt diesem Repository eine neue DataSource hinzu
     *
     * @param {AbstractDataSource} dataSource Die neue DataSource
     */
    addDataSource(dataSource) {
        if (!(dataSource instanceof AbstractDataSource)) {
            throw new TypeError("Parameter is not of type AbstractDataSource");
        }
        if (dataSource.constructor.type !== this.constructor.type) {
            throw new TypeError(
                `Cannot add DataSource of type "${dataSource.constructor.type}" `
                + `to a repository of type "${this.constructor.type}"`,
            );
        }
        for (const ds of this._dataSources) {
            if (ds === dataSource) {
                throw new Error("DataSource already added");
            }
        }

        this._dataSources.push(dataSource);

        // Alle DataSources nach aufsteigender Metrik neu sortieren
        this._dataSources.sort((a, b) => a.metric - b.metric);
    }

    /**
     * Ein Array mit allen DataSources, aufsteigend sortiert nach deren Metrik
     *
     * @readonly
     * @type {AbstractDataSource[]}
     */
    get dataSources() {
        return this._dataSources;
    }

    /**
     * Fügt einen neuen Datensatz ein
     *
     * @param {AbstractModel} model Der neu einzufügende Datensatz
     * @return {Promise<AbstractModel>} Der neu eingefügte Datensatz
     */
    async insert(model) {
        let lastErr = null;
        let result = null;

        for (const ds of this._dataSources) {
            try {
                result = await ds.insert(model);
                lastErr = null;
                break;
            } catch (err) {
                lastErr = err;
            }
        }

        if (lastErr !== null) {
            throw lastErr;
        }
        return result;
    }

    /**
     * Ändert einen bereits bestehenden Datensatz
     *
     * @param {AbstractModel} model Der zu aktualisierende Datensatz
     * @return {Promise<AbstractModel>} Der neu eingefügte Datensatz
     */
    async update(model) {
        let lastErr = null;
        let result = null;

        for (const ds of this._dataSources) {
            try {
                result = await ds.update(model);
                lastErr = null;
                break;
            } catch (err) {
                lastErr = err;
            }
        }

        if (lastErr !== null) {
            throw lastErr;
        }
        return result;
    }

}
module.exports = AbstractRepository;
