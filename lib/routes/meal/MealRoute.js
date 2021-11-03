/* eslint-env node */

const AbstractRoute = require("../AbstractRoute");
const MealTypeRoute = require("./MealTypeRoute");

const Meal = require("../../data/model/Meal");

const createLoginMiddleware = require("../../middleware/login");

/**
 * Verwaltet alle Endpoint-Handler für die `/meal` Route
 */
class MealRoute extends AbstractRoute {

    constructor(server) {
        super("meal", server);

        /**
         * @private
         * @type {import("../../data/MealRepository")}
         */
        this._mealRepo = server.getRepo("meal");
        /**
         * @private
         * @type {import("../../data/MealTypeRepository")}
         */
        this._mealTypeRepo = server.getRepo("meal_type");
        /**
         * @private
         * @type {import("../../data/UserRepository")}
         */
        this._userRepo = server.getRepo("user");
    }

    /**
     * @inheritdoc
     * @override
     */
    get children() {
        return [
            new MealTypeRoute(this.server),
        ];
    }

    get middleware() {
        return {
            get: [ createLoginMiddleware(this._userRepo) ],
            post: [ createLoginMiddleware(this._userRepo) ],
            put: [ createLoginMiddleware(this._userRepo) ],
        };
    }

    async get(req, res, next) {
        try {
            const meals = await this._mealRepo.findAllByUser(req.authenticatedUser.id);
            const mealTypes = await this._mealTypeRepo.findAllByUser(req.authenticatedUser.id);

            const mealData = [];
            for (const meal of meals) {
                mealData.push(meal.toJSON());
            }

            const mealTypeData = [];
            for (const mealType of mealTypes) {
                mealTypeData.push(mealType.toJSON());
            }

            res.status(200).json({
                err: false,
                meals: mealData,
                mealTypes: mealTypeData,
            });
        } catch (err) {
            next(err);
        }
    }

    async post(req, res, next) {
        if (!this._validateMealData(req, res)) {
            return;
        }

        try {
            const mealType = await this._mealTypeRepo.findById(req.body.typeId);
            if (mealType === null || mealType.user_id !== req.authenticatedUser.id) {
                res.status(400).json({
                    err: true,
                    msg: "Der Typ der Mahlzeit existiert nicht",
                });
                return;
            }

            const newMeal = await this._mealRepo.insert(new Meal(
                -1,
                mealType.id,
                req.authenticatedUser.id,
                req.body.date,
            ));
            res.status(201).json({
                err: false,
                meal: newMeal.toJSON(mealType),
            });
            return;
        } catch (err) {
            next(err);
        }
    }

    async put(req, res, next) {
        if (!this._validateMealData(req, res)) {
            return;
        }

        try {
            const updatedMeal = this._mealRepo.update(new Meal(
                req.body.id,
                req.body.typeId,
                req.authenticatedUser.id,
                req.body.date,
            ));
            res.status(200).json({
                err: false,
                meal: updatedMeal,
            });
            return;
        } catch (err) {
            next(err);
        }
    }

    /**
     * Prüft ob der Request Body zum Erstellen einer neuen Mahlzeit gültig ist,
     * und lehnt die Request mit einer Fehlermeldung ab wenn dies nicht der
     * Fall ist
     *
     * @param {import("express").Request} req Die Express-Request
     * @param {import("express").Response} res Die Express-Response
     * @return {boolean} true falls der Request Body gültig ist
     */
    _validateMealData(req, res) {
        const body = req.body;

        if (typeof body !== "object" || body === null) {
            res.status(400).json({
                err: true,
                msg: "Keine Daten gesendet",
            });
            return false;
        }

        if (typeof body.typeId !== "number") {
            res.status(400).json({
                err: true,
                msg: "Mahlzeit-Typ fehlt",
            });
            return false;
        }

        if (typeof body.date !== "number") {
            res.statuss(400).json({
                err: true,
                msg: "Kein Datum angegeben",
            });
            return false;
        }

        return true;
    }

}
module.exports = MealRoute;
