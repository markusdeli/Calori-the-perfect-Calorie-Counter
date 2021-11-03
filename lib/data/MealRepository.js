/* eslint-env node */

const AbstractRepository = require("./AbstractRepository");

/**
 * Repository für Mahlzeiten
 */
class MealRepository extends AbstractRepository {

    /**
     * Der Typ dieses Repositories
     *
     * @override
     * @readonly
     */
    static get type() {
        return "meal";
    }

    /**
     * Lösche alle Mahlzeiten des angegebenen Typs
     *
     * @param {!number} typeId Die ID des Mahlzeit-Typs
     * @return {Promise<void>}
     */
    async deleteAllOfType(typeId) {
        for (const ds of this.dataSources) {
            await ds.deleteAllOfType(typeId);
        }
    }

    /**
     * Durchsucht alle DataSources nach den Mahlzeiten des angegebenen Typs
     *
     * @param {number} typeId Die Typ-ID
     * @return {Promise<import("./model/Meal")[]>} Alle Mahlzeiten des angegebenen Typs, oder
     *     ein leeres Array falls keine gefunden wurden
     */
    async findAllByType(typeId) {
        for (const ds of this.dataSources) {
            const types = await ds.findAllByType(typeId);
            if (types.length > 0) {
                return types;
            }
        }

        return [];
    }

    /**
     * Durchsucht alle DataSources nach den Mahlzeiten des angegebenen Nutzers
     *
     * @param {string} userId Die ID des Nutzers dessen Mahlzeiten geholt wewrden sollen
     * @return {Promise<import("./data/Meal")[]>} Alle Mahlzeiten des angegebenen Nutzers, oder
     *     ein leeres Array falls keine gefunden wurden
     */
    async findAllByUser(userId) {
        for (const ds of this.dataSources) {
            const types = await ds.findAllByUser(userId);
            if (types.length > 0) {
                return types;
            }
        }

        return [];
    }

}
module.exports = MealRepository;
