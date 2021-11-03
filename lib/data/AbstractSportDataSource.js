/* eslint-env node */

const AbstractDataSource = require("./AbstractDataSource");

/**
 * Abstrakte Basisklasse für alle DataSources die Sport-Daten zur Verfügung stellen
 */
class AbstractSportDataSource extends AbstractDataSource {

    /**
     * @inheritdoc
     * @override
     */
    static get type() {
        return "sport";
    }

    /**
     * Durchsucht die Datenbank nach allen sportlichen Betätigungen des Nutzers
     *
     * @param {number} userId Die User-ID
     * @return {Promise<import("./model/Sport")[]>} Ein Array aus allen Sport-Einheiten des Nutzers
     */
    async getAllByUser(userId) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

}
module.exports = AbstractSportDataSource;
