/* eslint-env node */

const AbstractUserDataSource = require("../AbstractUserDataSource");
const User = require("../model/User");

const METRIC = 1000;

/**
 * Die SQLite-Implementation der UserDataSource
 */
class SQLiteUserDataSource extends AbstractUserDataSource {

    constructor(db) {
        super(METRIC);

        /**
         * @private
         * @type {import("../../util/sqlite/DatabaseWrapper")}
         */
        this._db = db;

        this._setup();
    }

    /**
     * Interne Methode zum erstmaligen Einrichten der Datenbank
     *
     * @private
     */
    async _setup() {
        await this._db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                user_name TEXT,
                pwd TEXT,
                email TEXT,
                first_name TEXT,
                last_name TEXT,
                birth_date INTEGER,
                weight REAL,
                gender TEXT,
                height REAL
            )
        `);
        await this._db.run("CREATE UNIQUE INDEX IF NOT EXISTS user_name_index ON users(user_name)");
    }

    /**
     * @inheritdoc
     * @override
     */
    async insert(user) {
        if (!(user instanceof User)) {
            throw new TypeError("Parameter is not an instance of User");
        }

        await this._db.lockTable("users");

        try {
            const stmt = await this._db.prepare(`
                INSERT INTO users (
                    user_name,
                    pwd,
                    email,
                    first_name,
                    last_name,
                    birth_date,
                    weight,
                    gender,
                    height
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            await stmt.bind(
                user.user_name,
                user.pwd,
                user.email,
                user.first_name,
                user.last_name,
                user.birth_date,
                user.weight,
                user.gender,
                user.height,
            );
            await stmt.run();
            await stmt.finalize();

            const row = await this._db.get(`
                SELECT DISTINCT last_insert_rowid() AS rowid FROM users
            `);
            user._id = row.rowid;

            user.clearChangedFields();
            this._db.unlockTable("users");
        } catch (err) {
            this._db.unlockTable("users");
            throw err;
        }

        return user;
    }

    /**
     * @inheritdoc
     * @override
     */
    async update(user) {
        if (!(user instanceof User)) {
            throw new TypeError("Parameter is not an instance of User");
        }

        const stmt = await this._db.prepare(`
            UPDATE users SET
                user_name = ?,
                pwd = ?,
                email = ?,
                first_name = ?,
                last_name = ?,
                birth_date = ?,
                weight = ?,
                gender = ?,
                height = ?
            WHERE id = ?
        `);
        await stmt.bind(
            user.user_name,
            user.pwd,
            user.email,
            user.first_name,
            user.last_name,
            user.birth_date,
            user.weight,
            user.gender,
            user.height,
            user.id,
        );
        await stmt.run();
        await stmt.finalize();

        user.clearChangedFields();
        return user;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findById(id) {
        const stmt = await this._db.prepare("SELECT * FROM users WHERE id = ?");
        await stmt.bind(id);
        const data = await stmt.get();
        await stmt.finalize();
        if (data !== undefined) {
            return User.fromJSON(data);
        }
        return null;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findByName(userName) {
        const stmt = await this._db.prepare("SELECT * FROM users WHERE user_name = ? COLLATE NOCASE");
        await stmt.bind(userName);
        const data = await stmt.get();
        await stmt.finalize();
        if (data !== undefined) {
            return User.fromJSON(data);
        }
        return null;
    }

    /**
     * @inheritdoc
     * @override
     */
    async findByEmail(email) {
        const stmt = await this._db.prepare("SELECT * FROM users WHERE email = ? COLLATE NOCASE");
        await stmt.bind(email);
        const data = await stmt.get();
        await stmt.finalize();
        if (data !== undefined) {
            return User.fromJSON(data);
        }
        return null;
    }

}
module.exports = SQLiteUserDataSource;
