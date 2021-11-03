/* eslint-env node */

const AbstractRoute = require("../AbstractRoute");
const Sport = require("../../data/model/Sport");
const createLoginMiddleware = require("../../middleware/login");

/**
 * Routing-Handler für die Endpoints in `/sport`
 */
class SportRoute extends AbstractRoute {

    constructor(server) {
        super("sport", server);

        this._userRepo = server.getRepo("user");
        this._sportRepo = server.getRepo("sport");
    }

    /**
     * @inheritdoc
     * @override
     */
    get middleware() {
        return {
            get: [ createLoginMiddleware(this._userRepo) ],
            post: [ createLoginMiddleware(this._userRepo) ],
        };
    }

    async get(req, res, next) {
        try {
            const sports = await this._sportRepo.findAllByUser(req.authenticatedUser.id);
            const sportsJSON = [];

            for (const sport of sports) {
                sportsJSON.push(sport.toJSON());
            }

            res.status(200).json({
                err: false,
                sports: sportsJSON,
            });
            return;
        } catch (err) {
            next(err);
        }
    }

    async post(req, res, next) {
        if (!this._validatePostBody(req, res)) {
            return;
        }

        try {
            const sport = await this._sportRepo.insert(new Sport(
                -1,
                req.authenticatedUser.id,
                req.body.date,
                req.body.duration,
                req.body.intensity,
            ));

            res.status(201).json({
                err: false,
                sport: sport.toJSON(),
            });
            return;
        } catch (err) {
            next(err);
        }
    }

    /**
     * Validiert den Body von POST-Anfragen und returnt `true` falls dieser
     * gültig ist. Wenn `false` returnt wird ist die Anfrage bereits mit der
     * entsprechenden Fehlermeldung beantwortet.
     *
     * @param {import("express").Request} req Die Express-Request
     * @param {import("express").Response} res Das Express Response-Objekt
     * @return {boolean} `true` falls der Request Body gültig war
     */
    _validatePostBody(req, res) {
        const body = req.body;

        if (typeof body !== "object" || body === null) {
            res.status(400).json({
                err: true,
                msg: "Keine Daten gesendet",
            });
            return false;
        }

        if (typeof body.date !== "number") {
            res.status(400).json({
                err: true,
                msg: "Datum nicht angegeben",
            });
            return false;
        }

        if (typeof body.duration !== "number") {
            res.status(400).json({
                err: true,
                msg: "Dauer nicht angegeben",
            });
            return false;
        }

        if (typeof body.intensity !== "number") {
            res.status(400).json({
                err: true,
                msg: "Intensität nicht angegeben",
            });
            return false;
        }

        return true;
    }

}
module.exports = SportRoute;
