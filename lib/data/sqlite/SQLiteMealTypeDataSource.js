/* eslint-env node */

const AbstractMealTypeDataSource = require("../AbstractMealTypeDataSource");
const MealType = require("../model/MealType");

const METRIC = 1000;

/**
 * Implementierung der AbstractMealTypeDataSource für SQLite-Datenbanken
 */
class SQLiteMealTypeDataSource extends AbstractMealTypeDataSource {

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
            CREATE TABLE IF NOT EXISTS meal_types (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                name TEXT,
                calories REAL,
                carbs REAL,
                proteins REAL,
                fat REAL
            )
        `);

        await this._db.run("CREATE INDEX IF NOT EXISTS user_id_index ON meal_types(user_id)");
    }

    /**
     * @inheritdoc
     * @override
     */
    async delete(id) {
        const stmt = await this._db.prepare("DELETE FROM meal_types WHERE id = ?");
        await stmt.bind(id);
        await stmt.run();
        await stmt.finalize();
    }

    /**
     * @inheritdoc
     * @override
     * @param {MealType} mealType Der neue Datensatz
     * @return {Promise<MealType>} Der Datensatz
     */
    async insert(mealType) {
        if (!(mealType instanceof MealType)) {
            throw new TypeError("Parameter is not an instance of MealType");
        }

        await this._db.lockTable("meal_types");

        try {
            const stmt = await this._db.prepare(`
                INSERT INTO meal_types (
                    user_id,
                    name,
                    calories,
                    carbs,
                    proteins,
                    fat
                ) VALUES (?, ?, ?, ?, ?, ?)
            `);
            await stmt.bind(
                mealType.user_id,
                mealType.name,
                mealType.calories,
                mealType.carbs,
                mealType.proteins,
                mealType.fat,
            );
            await stmt.run();
            await stmt.finalize();

            const row = await this._db.get(`
                SELECT DISTINCT last_insert_rowid() AS rowid FROM meal_types
            `);
            mealType._id = row.rowid;

            mealType.clearChangedFields();
            this._db.unlockTable("meal_types");
        } catch (err) {
            this._db.unlockTable("meal_types");
            throw err;
        }

        return mealType;
    }

    /**
     * @inheritdoc
     * @override
     * @param {MealType} mealType Der zu ändernde Datensatz
     * @return {Promise<MealType>} Der Datensatz
     */
    async update(mealType) {
        if (!(mealType instanceof MealType)) {
            throw new TypeError("Parameter is not an instance of MealType");
        }

        const stmt = await this._db.prepare(`
            UPDATE meal_types SET
                name = ?,
                calories = ?,
                carbs = ?,
                proteins = ?,
                fat = ?
            WHERE id = ?
        `);
        await stmt.bind(
            mealType.name,
            mealType.calories,
        );
        await stmt.run();
        await stmt.finalize();

        mealType.clearChangedFields();
        return mealType;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findById(id) {
        const stmt = await this._db.prepare("SELECT * FROM meal_types WHERE id = ?");
        await stmt.bind(id);
        const result = await stmt.get();
        await stmt.finalize();
        if (result !== undefined) {
            return MealType.fromJSON(result);
        }
        return null;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findAllByUser(userId) {
        const stmt = await this._db.prepare("SELECT * FROM meal_types WHERE user_id = ?");
        await stmt.bind(userId);
        const result = await stmt.all();
        await stmt.finalize();

        const types = [];
        for (const row of result) {
            types.push(MealType.fromJSON(row));
        }
        return types;
    }

}
module.exports = SQLiteMealTypeDataSource;
