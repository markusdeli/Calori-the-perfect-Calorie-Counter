/* eslint-env node */

const jwtUtils = require("../../util/jwt");
const pwdUtils = require("../../util/pwd");

const AbstractRoute = require("../AbstractRoute");
const User = require("../../data/model/User");

/**
 * Router für `/user/signup`
 */
class SignupRoute extends AbstractRoute {

    /**
     * Instanziiert die Signup-Route
     *
     * @param {import("../../AppServer")} server Die AppServer Instanz
     */
    constructor(server) {
        super("signup", server);

        /**
         * @type {import("../../data/UserRepository")}
         * @private
         */
        this._userRepo = server.getRepo("user");
    }

    async post(req, res, next) {
        if (!this._validatePostBody(req, res)) {
            return;
        }

        try {
            if (await this._userRepo.findByName(req.body.userName) !== null) {
                res.status(200).json({
                    err: true,
                    msg: "Benutzername bereits vergeben",
                });
                return;
            }

            if (await this._userRepo.findByEmail(req.body.email) !== null) {
                res.status(200).json({
                    err: true,
                    msg: "E-Mail gehört bereits zu einem anderen Account",
                });
                return;
            }

            const newUser = await this._userRepo.insert(new User(
                -1, // Wird von SQLite automatisch zugewiesen
                req.body.userName,
                await pwdUtils.hash(req.body.pwd),
                req.body.email,
                req.body.firstName,
                req.body.lastName,
                req.body.birthDate,
                req.body.weight,
                req.body.gender,
                req.body.height,
            ));

            res.status(201).json({
                err: false,
                user: newUser.toJSON(),
                token: await jwtUtils.sign(newUser.id),
            });
            return;
        } catch (err) {
            next(err);
        }
    }

    /**
     * Validiert die Daten im Request Body für POST Anfragen an diese Route.
     * Wenn die Daten ungültig sind wird die Request mit einem HTTP-Fehlercode
     * abgelehnt und `false` returnt.
     *
     * @param {import("express").Request} req Die Express-Request
     * @param {import("express").Response} res Die Express-Response
     * @return {boolean} `true` wenn die Daten gültig waren
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

        if (!(/^[a-zA-Z0-9]{3,16}$/.test(body.userName))) {
            res.status(400).json({
                err: true,
                msg: "Ungültiger Benutzername",
            });
            return false;
        }

        if (typeof body.email !== "string") {
            res.status(400).json({
                err: true,
                msg: "Keine Email angegeben",
            });
            return false;
        }

        if (typeof body.pwd !== "string") {
            res.status(400).json({
                err: true,
                msg: "Kein Passwort angegeben",
            });
            return false;
        }

        if (typeof body.firstName !== "string") {
            res.status(400).json({
                err: true,
                msg: "Kein Vorname angegeben",
            });
            return false;
        }

        if (typeof body.lastName !== "string") {
            res.status(400).json({
                err: true,
                msg: "Kein Nachname angegeben",
            });
            return false;
        }

        if (typeof body.birthDate !== "number") {
            res.status(400).json({
                err: true,
                msg: "Kein Geburtsdatum angegeben",
            });
            return false;
        }

        if (typeof body.height !== "number") {
            res.status(400).json({
                err: true,
                msg: "Keine Körpergröße angegeben",
            });
            return false;
        }

        if (typeof body.weight !== "number") {
            res.status(400).json({
                err: true,
                msg: "Kein Gewicht angegeben",
            });
            return false;
        }

        return true;
    }

}
module.exports = SignupRoute;
