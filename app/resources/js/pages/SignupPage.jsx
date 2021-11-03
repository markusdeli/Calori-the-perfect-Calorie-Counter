/* eslint-env es11 */

import React, { Component } from "react";
import { Button, Typography, MenuItem } from "@material-ui/core";

import AppTextField from "../components/AppTextField";
import SessionManager from "../util/SessionManager";
import AppSelect from "../components/AppSelect";

const REGEX_EMAIL = /^[a-zA-Z0-9.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9.-]+)*\.[a-zA-Z]{2,}/;
const REGEX_USER_NAME = /^[a-zA-Z0-9_]{3,20}$/;

/**
 * Page Component zum Erstellen eines Accounts
 */
export default class SignupPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errorMessage: "",
            userName: "",
            isUserNameValid: true,
            pwd: "",
            isPwdValid: true,
            pwdRepeat: "",
            isPwdRepeatValid: true,
            email: "",
            isEmailValid: true,
            firstName: "",
            isFirstNameValid: true,
            lastName: "",
            isLastNameValid: true,
            birthDate: Math.floor(Date.now() / 1000 /* millisekunden */),
            gender: "",
            isGenderValid: false,
            height: 0,
            isHeightValid: true,
            weight: 0,
            isWeightValid: true,
            signupButtonDisableOverride: true,
        };

        this.handleSignup = this.handleSignup.bind(this);
        this.handleUserNameInputChange = this.handleUserNameInputChange.bind(this);
        this.handlePwdInputChange = this.handlePwdInputChange.bind(this);
        this.handlePwdRepeatChange = this.handlePwdRepeatChange.bind(this);
        this.handleEmailInputChange = this.handleEmailInputChange.bind(this);
        this.handleFirstNameInputChange = this.handleFirstNameInputChange.bind(this);
        this.handleLastNameInputChange = this.handleLastNameInputChange.bind(this);
        this.handleBirthDateInputChange = this.handleBirthDateInputChange.bind(this);
        this.handleGenderInputChange = this.handleGenderInputChange.bind(this);
        this.handleHeightInputChange = this.handleHeightInputChange.bind(this);
        this.handleWeightInputChange = this.handleWeightInputChange.bind(this);

        /**
         * @type {SessionManager}
         * @private
         */
        this._sessionManager = SessionManager.getInstance();
    }

    /**
     * onClick Callback für den Registrieren-Button
     */
    async handleSignup() {
        try {
            await this._sessionManager.signup(this.state);
            this.setState( () => ({ errorMessage: "" }) );
        } catch (err) {
            this.setState( () => ({ errorMessage: err.message}) );
        } finally {
            this.setState(() => ({
                pwd: "",
                pwdRepeat: "",
            }));
        }
    }

    /**
     * Event-Handler für Änderungen am Benutzernamen
     *
     * @param {Event} e Das Event
     */
    handleUserNameInputChange(e) {
        e.persist();
        this.setState(() => ({
            userName: e.target.value,
            isUserNameValid: REGEX_USER_NAME.test(e.target.value),
        }));
    }

    /**
     * Event-Handler für Änderungen am Passwort
     *
     * @param {Event} e Das Event
     */
    handlePwdInputChange(e) {
        e.persist();

        this.setState(() => ({
            pwd: e.target.value,
            // Wenn Eingabefeld leer, Passwort unverändert lassen
            isPwdValid: e.target.value.length === 0 || e.target.value.length >= 8,
            isPwdRepeatValid: e.target.value === this.state.pwdRepeat,
        }));
    }

    handlePwdRepeatChange(e) {
        e.persist();

        this.setState(() => ({
            pwdRepeat: e.target.value,
            isPwdRepeatValid: this.state.pwd.length === 0 || e.target.value === this.state.pwd,
        }));
    }

    /**
     * Event-Handler für Änderungen an der Email
     *
     * @param {Event} e Das Event
     */
    handleEmailInputChange(e) {
        e.persist();

        this.setState(() => ({
            email: e.target.value,
            isEmailValid: REGEX_EMAIL.test(e.target.value),
        }));
    }

    /**
     * Event-Handler für Änderungen am Vornamen
     *
     * @param {Event} e Das Event
     */
    handleFirstNameInputChange(e) {
        e.persist();
        this.setState(() => ({
            firstName: e.target.value,
            isFirstNameValid: e.target.value.length > 0,
        }));
    }

    /**
     * Event-Handler für Änderungen am Nachnamen
     *
     * @param {Event} e Das Event
     */
    handleLastNameInputChange(e) {
        e.persist();
        this.setState(() => ({
            lastName: e.target.value,
            isLastNameValid: e.target.value.length > 0,
        }));
    }

    /**
     * Event-Handler für Änderungen am Geburtsdatum
     *
     * @param {Event} e Das Event
     */
    handleBirthDateInputChange(e) {
        e.persist();
        this.setState(() => ({
            birthDate: new Date(e.target.value).getTime() / 1000, // millisekunden
        }));
    }

    /**
     * Event-Handler für Änderungen am Geschlecht
     *
     * @param {Event} e Das Event
     */
    handleGenderInputChange(e) {
        e.persist();
        this.setState(() => ({
            gender: e.target.value,
            isGenderValid: e.target.value !== "",
        }));
    }

    /**
     * Event-Handler für Änderungen an der Größe des Nutzers
     *
     * @param {Event} e Das Event
     */
    handleHeightInputChange(e) {
        e.persist();

        const value = e.target.value ? Number.parseFloat(e.target.value) : "";
        this.setState(() => ({
            height: value,
            isHeightValid: value !== "" && value > 0,
        }));
    }

    /**
     * Event-Handler für Änderungen am Gewicht des Nutzers
     *
     * @param {Event} e Das Event
     */
    handleWeightInputChange(e) {
        e.persist();

        const value = e.target.value ? Number.parseFloat(e.target.value) : "";
        this.setState(() => ({
            weight: value,
            isWeightValid: value !== "" && value > 0,
        }));
    }

    render() {
        return (
            <div className="page-narrow">
                <Typography variant="h2">Account erstellen</Typography>

                <AppTextField
                    label="Benutzername"
                    type="username"
                    fullWidth
                    error={!this.state.isUserNameValid}
                    errorMessage="Ungültiger Benutzername"
                    onChange={this.handleUserNameInputChange}
                />

                <AppTextField
                    label="Passwort"
                    type="password"
                    fullWidth
                    error={!this.state.isPwdValid}
                    errorMessage="Mindestens 8 Zeichen"
                    onChange={this.handlePwdInputChange}
                />

                <AppTextField
                    label="Passwort wiederholen"
                    type="password"
                    fullWidth
                    error={!this.state.isPwdRepeatValid}
                    errorMessage="Passwörter stimmen nicht überein"
                    onChange={this.handlePwdRepeatChange}
                />

                <AppTextField
                    label="E-Mail"
                    type="email"
                    fullWidth
                    error={!this.state.isEmailValid}
                    errorMessage="Ungültige E-Mail Adresse"
                    onChange={this.handleEmailInputChange}
                />

                <AppTextField
                    label="Vorname"
                    type="text"
                    fullWidth
                    error={!this.state.isFirstNameValid}
                    errorMessage="Vorname erforderlich"
                    onChange={this.handleFirstNameInputChange}
                />

                <AppTextField
                    label="Nachname"
                    type="text"
                    fullWidth
                    error={!this.state.isLastNameValid}
                    errorMessage="Nachname erforderlich"
                    onChange={this.handleLastNameInputChange}
                />

                <AppTextField
                    label="Geburtsdatum"
                    type="date"
                    value="1970-01-01"
                    fullWidth
                    onChange={this.handleBirthDateInputChange}
                />

                <AppSelect
                    value={this.state.gender}
                    label="Geschlecht"
                    onChange={this.handleGenderInputChange}
                    fullWidth
                    error={!this.state.isGenderValid}
                    errorMessage="Geschlechtsangabe erforderlich"
                >
                    <MenuItem value="male">männlich</MenuItem>
                    <MenuItem value="female">weiblich</MenuItem>
                </AppSelect>

                <AppTextField
                    label="Größe"
                    type="number"
                    fullWidth
                    error={!this.state.isHeightValid}
                    errorMessage="Ungültige Größe"
                    endAdornment="m"
                    onChange={this.handleHeightInputChange}
                />

                <AppTextField
                    label="Gewicht"
                    type="number"
                    fullWidth
                    error={!this.state.isWeightValid}
                    errorMessage="Ungültiges Gewicht"
                    endAdornment="kg"
                    onChange={this.handleWeightInputChange}
                />

                <Typography color="error">
                    {this.state.errorMessage}
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSignup}
                    disabled={!(
                        this.state.isUserName !== ""
                            && this.state.pwd !== ""
                            && this.state.pwdRepeat === this.state.pwd
                            && this.state.email !== ""
                            && this.state.firstName !== ""
                            && this.state.lastName !== ""
                            && this.state.isGenderValid
                            && this.state.height > 0
                            && this.state.weight > 0
                    )}
                >
                    Registrieren
                </Button>
            </div>
        );
    }

}
