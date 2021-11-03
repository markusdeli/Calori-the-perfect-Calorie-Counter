/* eslint-env node */

const AbstractRoute = require("../AbstractRoute");
const MealType = require("../../data/model/MealType");
const createLoginMiddleware = require("../../middleware/login");

/**
 * Routing-Handler für die `/meal/type` Route
 */
class MealTypeRoute extends AbstractRoute {

    constructor(server) {
        super("type", server);

        this._mealRepo = server.getRepo("meal");
        this._mealTypeRepo = server.getRepo("meal_type");
        this._userRepo = server.getRepo("user");
    }

    /**
     * @inheritdoc
     * @override
     */
    get middleware() {
        return {
            post: [ createLoginMiddleware(this._userRepo) ],
            delete: [ createLoginMiddleware(this._userRepo) ],
        };
    }

    async post(req, res, next) {
        if (!this._validateMealTypeData(req, res)) {
            return;
        }

        try {
            const newType = await this._mealTypeRepo.insert(new MealType(
                -1,
                req.authenticatedUser.id,
                req.body.name,
                req.body.calories,
                req.body.carbs,
                req.body.proteins,
                req.body.fat,
            ));

            res.status(201).json({
                err: false,
                mealType: newType.toJSON(),
            });
            return;
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        if (typeof req.body !== "object") {
            res.status(400).json({
                err: true,
                msg: "Keine Daten gesendet",
            });
            return;
        }

        if (typeof req.body.id !== "number") {
            res.status(400).json({
                err: true,
                msg: "Keine ID gesendet",
            });
            return;
        }

        try {
            const mealType = await this._mealTypeRepo.findById(req.body.id);
            if (mealType === null || mealType.user_id !== req.authenticatedUser.id) {
                res.status(404).json({
                    err: true,
                    msg: "Mahlzeit-Typ nicht gefunden",
                });
                return;
            }

            await this._mealRepo.deleteAllOfType(mealType.id);
            await this._mealTypeRepo.delete(mealType.id);

            res.status(200).json({ err: false });
            return;
        } catch (err) {
            next(err);
        }
    }

    /**
     * Prüft ob der Request Body zum Erstellen eines neuen Mahlzeit-Typs gültig
     * ist, und lehnt die Request mit einer Fehlermeldung ab wenn dies nicht der
     * Fall ist
     *
     * @param {import("express").Request} req Die Express-Request
     * @param {import("express").Response} res Die Express-Response
     * @return {boolean} true falls der Request Body gültig ist
     */
    _validateMealTypeData(req, res) {
        const body = req.body;

        if (typeof body !== "object" || body === null) {
            res.status(400).json({
                err: true,
                msg: "Keine Daten gesendet",
            });
            return false;
        }

        if (typeof body.name !== "string" || body.name === "") {
            res.status(400).json({
                err: true,
                msg: "Kein Name angegeben",
            });
            return false;
        }

        if (typeof body.calories !== "number") {
            res.satus(400).json({
                err: true,
                msg: "Keine Kalorienzahl angegeben",
            });
            return false;
        }

        if (typeof body.carbs !== "number") {
            res.status(400).json({
                err: true,
                msg: "Keine Kohlenhydratmenge angegeben",
            });
            return false;
        }

        if (typeof body.proteins !== "number") {
            res.status(400).json({
                err: true,
                msg: "Keine Proteinmenge angegeben",
            });
            return false;
        }

        if (typeof body.fat !== "number") {
            res.status(400).json({
                err: true,
                msg: "Keine Fettmenge angegeben",
            });
            return false;
        }

        return true;
    }

}
module.exports = MealTypeRoute;
