/* eslint-env node */

const AbstractDataSource = require("./AbstractDataSource");

/**
 * Abstrakte Basisklasse für alle DataSources vom Typ "user"
 */
class AbstractUserDataSource extends AbstractDataSource {

    /**
     * @inheritdoc
     * @override
     */
    static get type() {
        return "user";
    }

    /**
     * Erstellt eine neue DataSource vom Typ "user"
     *
     * @param {number} metric Die Metrik dieser DataSource
     */
    constructor(metric) {
        super(metric);
    }

    /**
     * Sucht den Nutzer mit der angegebenen ID
     *
     * @abstract
     * @param {number} id Die ID des Nutzers
     * @return {Promise<?User>} Der gesuchte User, oder null wenn er nicht existiert
     */
    async findById(id) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Sucht den Nutzer mit dem angegebenen Nutzernamen
     *
     * @abstract
     * @param {string} userName Der eindeutige Benutzername
     * @return {Promise<?User>} Der gesuchte Nutzer, oder null wenn er nicht existiert
     */
    async findByName(userName) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

    /**
     * Sucht den Nutzer mit der angegebenen Email Adresse
     *
     * @abstract
     * @param {string} email Die E-Mail Adresse
     * @return {Promise<?User>} Der gesuchte Nutzer, oder null wenn er nicht existiert
     */
    async findByEmail(email) { // eslint-disable-line no-unused-vars
        throw new Error("Not implemented");
    }

}
module.exports = AbstractUserDataSource;
