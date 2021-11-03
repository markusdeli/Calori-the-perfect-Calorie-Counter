/* eslint-env node */

const AbstractSportDataSource = require("../AbstractSportDataSource");
const Sport = require("../model/Sport");

const METRIC = 1000;

class SQLiteSportDataSource extends AbstractSportDataSource {

    constructor(db) {
        super(METRIC);

        /**
         * @private
         * @type {import("../../util/sqlite/DatabaseWrapper")}
         */
        this._db = db;
        this._setup();
    }

    async _setup() {
        await this._db.run(`
            CREATE TABLE IF NOT EXISTS sports (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                date INTEGER,
                duration INTEGER,
                intensity INTEGER
            )
        `);

        await this._db.run("CREATE INDEX IF NOT EXISTS user_id_index ON sports(user_id)");
    }

    /**
     * @inheritdoc
     * @override
     * @param {Sport} sport Der neue Datensatz
     * @return {Promise<Sport>} Der neu eingefügte Datensatz
     */
    async insert(sport) {
        if (!(sport instanceof Sport)) {
            throw new TypeError("Parameter is not an instance of Sport");
        }

        await this._db.lockTable("sports");

        try {
            const stmt = await this._db.prepare(`
                INSERT INTO sports (
                    user_id,
                    date,
                    duration,
                    intensity
                ) VALUES (?, ?, ?, ?)
            `);
            await stmt.bind(
                sport.user_id,
                sport.date,
                sport.duration,
                sport.intensity,
            );
            await stmt.run();
            await stmt.finalize();

            const row = await this._db.get(`
                SELECT DISTINCT last_insert_rowid() AS rowid FROM sports
            `);
            sport._id = row.rowid;
            sport.clearChangedFields();
            this._db.unlockTable("sports");
        } catch (err) {
            this._db.unlockTable("sports");
            throw err;
        }

        return sport;
    }

    /**
     * @inheritdoc
     * @override
     * @param {Sport} sport Der zu ändernde Datensatz
     * @return {Promise<Sport>} Der aktualisierte Datensatz
     */
    async update(sport) {
        if (!(sport instanceof Sport)) {
            throw new TypeError("Parameter is not an instance of Sport");
        }

        const stmt = await this._db.prepare(`
            UPDATE sports SET
                date = ?,
                duration = ?,
                intensity = ?
            WHERE id = ?
        `);
        await stmt.bind(
            sport.date,
            sport.duration,
            sport.intensity,
        );
        await stmt.run();
        await stmt.finalize();

        sport.clearChangedFields();
        return sport;
    }

    /**
     * @inheritdoc
     * @override
     * @param {number} userId Die Nutzer-ID
     * @return {Promise<Sport[]>} Ein Array mit allen Sport-Einheiten des Nutzers
     */
    async findAllByUser(userId) {
        const stmt = await this._db.prepare(`
            SELECT * FROM sports WHERE user_id = ?
        `);
        await stmt.bind(userId);
        const resultRows = await stmt.all();
        await stmt.finalize();

        const sports = [];
        for (const row of resultRows) {
            sports.push(Sport.fromJSON(row));
        }

        return sports;
    }

}
module.exports = SQLiteSportDataSource;
