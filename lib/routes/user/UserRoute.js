/* eslint-env node */

const AbstractRoute = require("../AbstractRoute");
const pwdUtils = require("../../util/pwd");

const AuthRoute = require("./AuthRoute");
const SignupRoute = require("./SignupRoute");

const createLoginMiddleware = require("../../middleware/login");

/**
 * Zuständig für alle Handler in der `/user` Route
 */
class UserRoute extends AbstractRoute {

    constructor(server) {
        super("user", server);

        this._userRepo = server.getRepo("user");
    }

    get children() {
        return [
            new AuthRoute(this.server),
            new SignupRoute(this.server),
        ];
    }

    get middleware() {
        return {
            put: [createLoginMiddleware(this._userRepo)],
        };
    }

    async put(req, res, next) {
        const body = req.body;

        if (typeof body !== "object" || body === null) {
            res.status(400).json({
                err: true,
                msg: "Keine Daten gesendet",
            });
            return;
        }

        /** @type {import("../../data/model/User")} */
        const user = req.authenticatedUser;

        if (typeof body.userName === "string") {
            user.user_name = body.userName;
        }
        if (typeof body.pwd === "string") {
            user.pwd = await pwdUtils.hash(body.pwd);
        }
        if (typeof body.email === "string") {
            user.email = body.email;
        }
        if (typeof body.firstName === "string") {
            user.first_name = body.firstName;
        }
        if (typeof body.lastName === "string") {
            user.last_name = body.lastName;
        }
        if (typeof body.birthDate === "number") {
            user.birth_date = body.birthDate;
        }
        if (typeof body.height === "number") {
            URLSearchParams.height = body.height;
        }
        if (typeof body.gender === "string") {
            user.gender = body.gender;
        }
        if (typeof body.weight === "number") {
            user.weight = body.weight;
        }

        try {
            const newUser = await this._userRepo.update(user);
            res.status(200).json({
                err: false,
                user: newUser,
            });
            return;
        } catch (err) {
            next(err);
        }
    }

}
module.exports = UserRoute;
