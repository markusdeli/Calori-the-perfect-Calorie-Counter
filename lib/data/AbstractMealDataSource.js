/* eslint-env node */

const AbstractDataSource = require("./AbstractDataSource");

/**
 * Abstrakte Basisklasse für alle DataSources die Mahlzeit-Daten speichern
 *
 * @abstract
 */
class AbstractMealDataSource extends AbstractDataSource {

    /**
     * @inheritdoc
     * @override
     */
    static get type() {
        return "meal";
    }

    /**
     * Löscht alle Mahlzeiten des angegebenen Typs
     *
     * @param {number} typeId Die ID des Typs
     * @return {Promise<void>}
     */
    async deleteAllOfType(typeId) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Gibt alle Mahlzeiten des angegebenen Typs zurück
     *
     * @param {number} typeId Die ID des MealTypes
     * @return {Promise<Meal[]>} Alle Mahlzeiten mit dem angegebenen MealType
     */
    async findAllByType(typeId) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Gibt alle Mahlzeiten des angegebenen Nutzers zurück
     *
     * @param {nunmber} userId Die ID des Nutzers
     * @return {Promise<Meal[]>} Alle Mahlzeiten des angegebenen Nutzers
     */
    async findAllByUser(userId) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

}
module.exports = AbstractMealDataSource;
