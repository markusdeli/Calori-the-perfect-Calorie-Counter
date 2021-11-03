/* eslint-env node */

/**
 * Abstrakte Basisklasse für alle Datenmodelle
 */
class AbstractModel {

    constructor() {
        this._changedFields = [];
    }

    /**
     * Fügt den angegebenen Feldnamen zur Liste der veränderten Felder hinzu.
     * Darf nur von Child-Klassen in den Settern aufgerufen werden.
     *
     * @protected
     * @param {string} fieldName Der Name des Feldes (also der Property)
     */
    addChangedField(fieldName) {
        if (!(fieldName in this._changedFields)) {
            this._changedFields.push(fieldName);
        }
    }

    /**
     * Leert das changedFields Array.
     * Diese Methode darf ausschließlich von dem Repository aufgerufen werden!
     */
    clearChangedFields() {
        this._changedFields = [];
    }

    /**
     * Gibt eine JSON-Repräsentation dieses Datensatzes zurück, die an den Client
     * geschickt werden kann
     */
    toJSON() {
        throw new Error(`Class ${this.constructor.name} does not implement toJSON()`);
    }

    /**
     * Die Felder die sich seit Erstellen dieses Objekts geändert haben.
     * Wird von den DataSource-Klassen verwendet um das entsprechende SQL-Statement zu bilden.
     *
     * @readonly
     * @type {string[]}
     */
    get changedFields() {
        return this._changedFields;
    }

}
module.exports = AbstractModel;
