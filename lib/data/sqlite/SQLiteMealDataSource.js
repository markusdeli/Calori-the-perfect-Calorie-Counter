/* eslint-env node */

const AbstractMealDataSource = require("../AbstractMealDataSource");
const Meal = require("../model/Meal");

const METRIC = 1000;

/**
 * Implementierung der AbstractMealTypeDataSource für SQLite-Datenbanken
 */
class SQLiteMealDataSource extends AbstractMealDataSource {

    /**
     * @param {import("../../util/sqlite/DatabaseWrapper")} db Die Datenbank
     */
    constructor(db) {
        super(METRIC);

        /**
         * @type {import("../../util/sqlite/DatabaseWrapper")}
         * @private
         */
        this._db = db;

        this._setup();
    }

    async _setup() {
        await this._db.run(`
            CREATE TABLE IF NOT EXISTS meals (
                id INTEGER PRIMARY KEY,
                type_id INTEGER,
                user_id INTEGER,
                date INTEGER
            )
        `);

        await this._db.run("CREATE INDEX IF NOT EXISTS user_id_index ON meals (user_id)");
        await this._db.run("CREATE INDEX IF NOT EXISTS type_id_index ON meals (type_id)");
    }

    /**
     * @inheritdoc
     * @override
     */
    async deleteAllOfType(typeId) {
        const stmt = await this._db.prepare("DELETE FROM meals WHERE type_id = ?");
        await stmt.bind(typeId);
        await stmt.run();
        await stmt.finalize();
    }

    /**
     * @inheritdoc
     * @override
     * @param {Meal} meal Der neue Datensatz
     */
    async insert(meal) {
        if (!(meal instanceof Meal)) {
            throw new TypeError("Parameter is not an instance of Meal");
        }

        await this._db.lockTable("meals");

        try {
            const stmt = await this._db.prepare(`
                INSERT INTO meals (
                    type_id,
                    user_id,
                    date
                ) VALUES (?, ?, ?)
            `);
            await stmt.bind(
                meal.type_id,
                meal.user_id,
                meal.date,
            );
            await stmt.run();
            await stmt.finalize();

            const row = await this._db.get(`
                SELECT DISTINCT last_insert_rowid() AS rowid FROM meals
            `);
            meal._id = row.rowid;

            meal.clearChangedFields();
            this._db.unlockTable("meals");
        } catch (err) {
            this._db.unlockTable("meals");
            throw err;
        }

        return meal;
    }

    /**
     * @inheritdoc
     * @override
     * @param {Meal} meal Der zu aktualisierende Datensatz
     * @return {Promise<Meal>} Der Datensatz
     */
    async update(meal) {
        if (!(meal instanceof Meal)) {
            throw new TypeError("Parameter is not an instance of Meal");
        }

        const stmt = await this._db.prepare(`
            UPDATE meals SET
                type_id = ?,
                date = ?
            WHERE id = ?
        `);
        await stmt.bind(
            meal.type_id,
            meal.date,
            meal.id,
        );
        await stmt.run();
        await stmt.finalize();

        meal.clearChangedFields();
        return meal;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findAllByType(typeId) {
        const stmt = await this._db.prepare("SELECT * FROM meals WHERE type_id = ?");
        await stmt.bind(typeId);
        const result = await stmt.all();
        await stmt.finalize();

        const meals = [];
        for (const row of result) {
            meals.push(Meal.fromJSON(row));
        }
        return meals;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findAllByUser(userId) {
        const stmt = await this._db.prepare("SELECT * FROM meals WHERE user_id = ?");
        await stmt.bind(userId);
        const result = await stmt.all();
        await stmt.finalize();

        const meals = [];
        for (const row of result) {
            meals.push(Meal.fromJSON(row));
        }
        return meals;
    }

}
module.exports = SQLiteMealDataSource;
