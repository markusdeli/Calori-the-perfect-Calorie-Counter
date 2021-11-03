/* eslint-env node */

const AbstractRepository = require("./AbstractRepository");

/**
 * Repository für MealTypes
 */
class MealTypeRepository extends AbstractRepository {

    /**
     * Der Typ dieses Repositories
     *
     * @override
     * @readonly
     */
    static get type() {
        return "meal_type";
    }

    /**
     * Löscht den Mahlzeit-Typ mit der angegeben ID aus allen DataSources
     *
     * @param {number} id Die ID
     * @return {Promise<void>}
     */
    async delete(id) {
        for (const ds of this.dataSources) {
            await ds.delete(id);
        }
    }

    /**
     * Gibt den MealType mit der angegebenen ID zurück
     *
     * @param {number} id Die Typ-ID
     * @return {Promise<?MealType>} Der MealType, oder null falls er nicht gefunden wurde
     */
    async findById(id) {
        for (const ds of this.dataSources) {
            const mealType = await ds.findById(id);
            if (mealType !== null) {
                return mealType;
            }
        }

        return null;
    }

    /**
     * Durchsucht alle DataSources nach den MealTypes des angegebenen Nutzers
     *
     * @param {string} userId Die ID des Nutzers dessen MealTypes geholt wewrden sollen
     * @return {Promise<require("./data/MealType")[]>} Alle MealTypes des angegebenen Nutzers, oder
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
module.exports = MealTypeRepository;
