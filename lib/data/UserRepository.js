/* eslint-env node */

const AbstractRepository = require("./AbstractRepository");

class UserRepository extends AbstractRepository {

    /**
     * Der Typ dieses Repositories
     *
     * @override
     * @readonly
     */
    static get type() {
        return "user";
    }

    /**
     * Durchsucht alle DataSources nach dem Nutzer mit dem angegebenen Nutzernamen
     *
     * @param {string} userName Der Nutzername
     * @return {Promise<require("./data/User")>} Der User, oder null wenn er nicht existiert
     */
    async findByName(userName) {
        for (const ds of this.dataSources) {
            const user = await ds.findByName(userName);
            if (user !== null) {
                return user;
            }
        }

        return null;
    }

    /**
     * Durchsucht alle DataSources nach dem Nutzer mit der angegebenen ID
     *
     * @param {number} id Die Nutzer-ID
     * @return {Promise<?User>} Der gesuchte Nutzer, oder null wenn er nicht existiert
     */
    async findById(id) {
        for (const ds of this.dataSources) {
            const user = await ds.findById(id);
            if (user !== null) {
                return user;
            }
        }

        return null;
    }

    /**
     * Durchsucht alle DataSources nach dem Nutzer mit der angegebenen Email
     *
     * @param {string} email Die E-Mail Adresse
     * @return {Promise<?User>} Der gesuchte Nutzer, oder null wenn er nicht gefuden wurde
     */
    async findByEmail(email) {
        for (const ds of this.dataSources) {
            const user = await ds.findByEmail(email);
            if (user !== null) {
                return user;
            }
        }

        return null;
    }

}
module.exports = UserRepository;
