/* eslint-env es2020 */

import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@material-ui/core";

import AppLink from "../wrapper/AppLink";
import AppTextField from "../AppTextField";
import { OPEN_LOGIN_DIALOG, USER_LOGIN, USER_LOGOUT } from "../../util/events";
import SessionManager from "../../util/SessionManager";
import { Redirect } from "react-router-dom";
import EventListeningComponent from "../EventListeningComponent";

/**
 * Ein Popup zum Anmelden
 */
export default class LoginPopup extends EventListeningComponent {

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            userName: "",
            pwd: "",
            redirectToDash: false,
            errorMessage: "",
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleUserNameInputChange = this.handleUserNameInputChange.bind(this);
        this.handlePwdInputChange = this.handlePwdInputChange.bind(this);

        /**
         * @private
         * @type {SessionManager}
         */
        this._sessionManager = SessionManager.getInstance();
    }

    get events() {
        return [
            {
                name: OPEN_LOGIN_DIALOG,
                callback: () =>this.setState( () => ({ open: true }) ),
            },
            {
                name: USER_LOGIN,
                callback: () => this.setState(() => ({
                    open: false,
                    userName: "",
                    pwd: "",
                    redirectToDash: true,
                })),
            },
            {
                name: USER_LOGOUT,
                callback: () => this.setState(() => ({
                    open: false,
                    redirectToDash: false,
                })),
            },
        ];
    }

    /**
     * Callback zum Schließen des Dialogs
     */
    handleClose() {
        this.setState( () => ({ open: false }) );
    }

    /**
     * Callback zum Senden der Login-Request ans Backend
     */
    async handleLogin() {
        try {
            await this._sessionManager.login(this.state.userName, this.state.pwd);
        } catch (err) {
            this.setState( () => ({ errorMessage: err.message }) );
        }
    }

    /**
     * Event-Handler für Änderungen am Input-Feld des Benutzernamens
     *
     * @param {Event} e Das Event
     */
    handleUserNameInputChange(e) {
        e.persist();
        this.setState( () => ({ userName: e.target.value }) );
    }

    /**
     * Event-Handler für Änderungen am Input-Feld des Passworts
     *
     * @param {Event} e Das Event
     */
    handlePwdInputChange(e) {
        e.persist();
        this.setState( () => ({ pwd: e.target.value }) );
    }

    render() {
        if (this.state.redirectToDash) {
            return <Redirect to="/dash"/>;
        }

        return (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="login-dialog-title"
            >
                <DialogTitle id="login-dialog-title">Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bitte melde Dich an.<br/>
                        Noch kein Konto?
                        <AppLink to="/signup" onClick={this.handleClose}>
                            Jetzt registrieren
                        </AppLink>
                    </DialogContentText>
                    <AppTextField
                        label="Benutzername"
                        type="username"
                        value={this.state.userName}
                        onChange={this.handleUserNameInputChange}
                        fullWidth
                    />
                    <AppTextField
                        label="Passwort"
                        type="password"
                        value={this.state.pwd}
                        onChange={this.handlePwdInputChange}
                        fullWidth
                    />
                    <Typography color="error">
                        {this.state.errorMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="secondary">
                        Abbrechen
                    </Button>
                    <Button onClick={this.handleLogin} color="secondary">
                        Anmelden
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}
