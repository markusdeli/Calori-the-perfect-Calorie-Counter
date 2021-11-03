/* eslint-env node */

/**
 * Abstrakte Basisklasse für alle DataSources.
 *
 * Eine DataSource stellt bestimmte Daten von einer bestimmten Quelle, z.B. SQLite, zur Verfügung.
 * Für jede Art von Daten existiert zudem ein Repository, das sich um die Auswahl der "schnellsten"
 * DataSource für die jeweilige Anfrage kümmert. Die Controller der einzelnen Routen holen sich ihre
 * Daten dann von einem solchen Repository. Bei steigenden Nutzerzahlen lässt sich durch diese
 * Abstraktionsschicht bspw. ein Redis-Cache mit relativ wenig Aufwand integrieren, es müsste nur
 * eine weitere DataSource-Klasse geschrieben und dem entsprechenden Repository hinzugefügt werden.
 */
class AbstractDataSource {

    /**
     * Der Typ dieser DataSource
     *
     * @abstract
     * @readonly
     * @type {string}
     */
    static get type() {
        throw new Error(`Class ${this.constructor.name} does not implement the static type getter`);
    }

    /**
     * Erstellt eine neue DataSource.
     * Die Child-Klasse muss den statischen {@link #type} getter implementieren.
     *
     * @param {number} metric Die Metrik dieser DataSource. Je höher der Wert, desto länger dauert
     *     ein Datenzugriff.
     */
    constructor(metric) {
        this._metric = metric;
    }

    /**
     * Erstellt einen Datensatz für ein neu erstelltes Model
     *
     * @param {import("./model/AbstractModel")} model Das neu erstellte Model
     * @return {Promise<import("./model/AbstractModel")>} Das neu eingefügte Model
     */
    async insert(model) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Aktualisiert ein bereits bestehendes, dieser DataSource entstammendes Model
     *
     * @param {import("./model/AbstractModel")} model Das zu aktualisierende Model
     * @return {Promise<import("./model/AbstractModel")>} Das aktualisierte Model
     */
    async update(model) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Die Metrik dieser DataSource.
     * Je höher der Wert, desto länger dauert ein Datenzugriff.
     * Das Repository erstellt eine Prioritätenliste aller ihr hinzugefügten DataSources und wird
     * diejenige mit der geringsten Metrik (wie z.B. ein Cache) bevorzugen.
     *
     * @readonly
     * @type {number}
     */
    get metric() {
        return this._metric;
    }

}
module.exports = AbstractDataSource;
