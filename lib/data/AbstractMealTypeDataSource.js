/* eslint-env node */

const AbstractDataSource = require("./AbstractDataSource");

/**
 * Abstrakte Basisklasse für alle DataSources des Typs "meal_type"
 */
class AbstractMealTypeDataSource extends AbstractDataSource {

    /**
     * @inheritdoc
     * @override
     */
    static get type() {
        return "meal_type";
    }

    /**
     * @inheritdoc
     * @override
     */
    constructor(metric) {
        super(metric);
    }

    /**
     * Gibt den MealType mit der angegebenen ID zurück
     *
     * @param {number} id Die ID des gesuchten MealTypes
     * @return {Promise<?MealType>} Der gesuchte MealType, oder null falls er nicht existiert
     */
    async findById(id) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Gibt alle MealTypes die ein bestimmter Nutzer erstellt hat zurück
     *
     * @param {number} userId Die ID des Nutzers
     * @return {Promise<MealType[]>} Alle vom Benutzer erstellten MealTypes
     */
    async findAllByUser(userId) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

}
module.exports = AbstractMealTypeDataSource;
