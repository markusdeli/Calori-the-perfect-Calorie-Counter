/* eslint-env node */

const AbstractRepository = require("./AbstractRepository");

class SportRepository extends AbstractRepository {

    static get type() {
        return "sport";
    }

    /**
     * Holt alle Sport-Einheiten die ein bestimmter Nutzer geleistet hat
     *
     * @param {number} userId Die Nutzer-ID
     * @return {Promise<import("./model/Sport")[]>} Ein Array mit allen Sport-Einheiten des Nutzers
     */
    async findAllByUser(userId) {
        for (const ds of this.dataSources) {
            const results = await ds.findAllByUser(userId);
            if (results.length > 0) {
                return results;
            }
        }

        return [];
    }

}
module.exports = SportRepository;
