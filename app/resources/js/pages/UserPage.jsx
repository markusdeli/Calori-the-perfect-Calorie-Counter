/* eslint-env es11 */

import React from "react";
import {
    Button,
    Typography,
} from "@material-ui/core";

import AppTextField from "../components/AppTextField";
import SessionManager from "../util/SessionManager";
import EventListeningComponent from "../components/EventListeningComponent";
import { USER_LOGIN, USER_LOGOUT } from "../util/events";
import {
    showNotification,
    SEVERITY_ERROR,
    SEVERITY_SUCCESS,
} from "../util/snackbar";
import { Redirect } from "react-router-dom";

const REGEX_EMAIL = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9.-]+)*\.[a-zA-Z]{2,}/;

export default class UserPage extends EventListeningComponent {

    constructor(props) {
        super(props);

        this._sessionManager = SessionManager.getInstance();

        this.state = {
            shouldRedirectToIndex: false,
            pwd: "",
            isPwdValid: true,
            pwdRepeat: "",
            isPwdRepeatValid: true,
            email: this._sessionManager.user.email,
            isEmailValid: true,
            weight: this._sessionManager.user.weight,
            isWeightValid: true,
            height: this._sessionManager.user.height,
            isHeightValid: true,
        };

        this.handlePwdInputChange = this.handlePwdInputChange.bind(this);
        this.handlePwdRepeatChange = this.handlePwdRepeatChange.bind(this);
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handleWeightInputChange = this.handleWeightInputChange.bind(this);
        this.handleHeightInputChange = this.handleHeightInputChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    }

    get events() {
        return [
            {
                name: USER_LOGIN,
                callback: () => this.setStateSafe({ shouldRedirectToIndex: false }),
            },
            {
                name: USER_LOGOUT,
                callback: () => this.setStateSafe({ shouldRedirectToIndex: true }),
            },
        ];
    }

    handlePwdInputChange(e) {
        e.persist();

        this.setState(() => ({
            pwd: e.target.value,
            // Wenn Eingabefeld leer, Passwort unverändert lassen
            isPwdValid: e.target.value.length === 0 || e.target.value.length >= 8,
            isPwdRepeatValid: e.target.value.length === 0
                || e.target.value === this.state.pwdRepeat,
        }));
    }

    handlePwdRepeatChange(e) {
        e.persist();

        this.setState(() => ({
            pwdRepeat: e.target.value,
            isPwdRepeatValid: this.state.pwd.length === 0 || e.target.value === this.state.pwd,
        }));
    }

    handleEmailInputChange(e) {
        e.persist();

        this.setState(() => ({
            email: e.target.value,
            isEmailValid: REGEX_EMAIL.test(e.target.value),
        }));
    }

    handleWeightInputChange(e) {
        e.persist();

        const value = e.target.value ? Number.parseFloat(e.target.value) : "";
        this.setState(() => ({
            weight: value,
            isWeightValid: value !== "" && value > 0,
        }));
    }

    handleHeightInputChange(e) {
        e.persist();

        const value = e.target.value ? Number.parseFloat(e.target.value) : "";
        this.setState(() => ({
            height: value,
            isHeightValid: value !== "" && value > 0,
        }));
    }

    async handleSaveButtonClick() {
        const changedData = {
            email: this.state.email,
            height: this.state.height,
            weight: this.state.weight,
        };
        if (this.state.pwd.length > 0) {
            changedData.pwd = this.state.pwd;
        }

        try {
            await this._sessionManager.changeUserData(changedData);

            this.setState(() => ({
                pwd: "",
                pwdRepeat: "",
            }));

            showNotification(SEVERITY_SUCCESS, "Gespeichert");
        } catch (err) {
            showNotification(SEVERITY_ERROR, err.message);
        }
    }

    render() {
        if (this.state.shouldRedirectToIndex) {
            return <Redirect to="/"/>;
        }

        return (
            <div className="page-narrow">
                <Typography variant="h2">Mein Konto</Typography>

                <AppTextField
                    value={this.state.pwd}
                    error={!this.state.isPwdValid}
                    fullWidth
                    label="Neues Passwort"
                    type="password"
                    errorMessage="Mindestens 8 Zeichen"
                    onChange={this.handlePwdInputChange}
                />
                <AppTextField
                    value={this.state.pwdRepeat}
                    error={!this.state.isPwdRepeatValid}
                    fullWidth
                    label="Neues Passwort wiederholen"
                    type="password"
                    errorMessage="Passwörter stimmen nicht überein"
                    onChange={this.handlePwdRepeatChange}
                />
                <AppTextField
                    value={this.state.email}
                    error={!this.state.isEmailValid}
                    fullWidth
                    label="E-Mail"
                    type="email"
                    errorMessage="Ungültige Adresse"
                    onChange={this.handleEmailInputChange}
                />
                <AppTextField
                    value={this.state.weight}
                    error={!this.state.isWeightValid}
                    fullWidth
                    label="Gewicht"
                    type="number"
                    endAdornment="kg"
                    errorMessage="Ungültiges Gweicht"
                    onChange={this.handleWeightInputChange}
                />
                <AppTextField
                    value={this.state.height}
                    error={!this.state.isHeightValid}
                    fullWidth
                    label="Größe"
                    type="number"
                    endAdornment="m"
                    errorMessage="Ungültige Größe"
                    onChange={this.handleHeightInputChange}
                />

                <Button
                    variant="contained"
                    color="primary"
                    disabled={!(
                        this.state.isPwdValid
                            && this.state.isPwdRepeatValid
                            && this.state.isEmailValid
                            && this.state.isWeightValid
                            && this.state.isHeightValid
                    )}
                    onClick={this.handleSaveButtonClick}
                >
                    Speichern
                </Button>
            </div>
        );
    }

}
