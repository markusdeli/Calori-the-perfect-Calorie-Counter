/* eslint-env es11 */

import React, { Component } from "react";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    MenuItem,
    Typography,
} from "@material-ui/core";

import AppSelect from "../AppSelect";
import AppTextField from "../AppTextField";
import SportRepository from "../../data/SportRepository";
import { showNotification } from "../../util/snackbar";
import Sport from "../../data/Sport";

/**
 * Card Component zum Hinzufügen von neuen sportlichen Betätigungen
 */
export default class SportAdder extends Component {

    constructor(props) {
        super(props);

        /**
         * @private
         * @type {SportRepository}
         */
        this._sportRepo = SportRepository.getInstance();

        this.state = {
            errorMessage: "",
            date: Math.floor(Date.now() / 1000 /* millisekunden */),
            duration: -1,
            intensity: Sport.INTENSITY_MEDIUM,
            valid: false,
        };

        this.handleDateInputChange = this.handleDateInputChange.bind(this);
        this.handleDurationInputChange = this.handleDurationInputChange.bind(this);
        this.handleIntensityInputChange = this.handleIntensityInputChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    }

    /**
     * Event-Handler für Änderungen am Datums-Input
     *
     * @param {Event} e Das Event
     */
    handleDateInputChange(e) {
        e.persist();

        if (e.target.value) {
            const localDate = new Date(e.target.value);

            // e.target.value (Also der Wert des HTML Date Inputs) ist ein
            // Datestring in lokaler Zeit, wodurch wir erst den Offset der
            // aktuellen Zeitzone abziehen müssen um zur UNIX-Zeit zu gelangen.
            // Ach ja, und getTimezoneOffset() liefert den Offset in *Minuten*
            // relativ zu UTC.
            const timestamp =
                Math.floor(localDate.getTime() / 1000) - localDate.getTimezoneOffset() * 60;
            this.setState(() => ({ date: timestamp }));
        }
    }

    /**
     * Event-Handler für Änderungen an der Dauer der Betätigung
     *
     * @param {Event} e Das Event
     */
    handleDurationInputChange(e) {
        e.persist();

        if (e.target.value) {
            const value = Number.parseInt(e.target.value);

            this.setState(() => ({
                duration: value * 60,
                valid: value > 0 && this.state.intensity > 0,
            }));
        }
    }

    /**
     * Event-Handler für Änderungen am Intensitäts-Dropdown
     *
     * @param {Event} e Das Event
     */
    handleIntensityInputChange(e) {
        e.persist();

        this.setState(() => ({
            intensity: e.target.value,
            valid: this.state.duration > 0 && e.target.value > 0,
        }));
    }

    /**
     * onClick-Callback für den Speichern-Button
     */
    async handleSaveButtonClick() {
        try {
            await this._sportRepo.addSport({
                date: this.state.date,
                duration: this.state.duration,
                intensity: this.state.intensity,
            });
            this.setState(() => ({
                errorMessage: "",
                date: Math.floor(Date.now() / 1000),
                duration: -1,
            }));
            showNotification("success", "Aktivität hinzugefügt");
        } catch (err) {
            this.setState(() => ({ errorMessage: err.message }));
        }
    }

    render() {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        Neue Aktivität hinzufügen
                    </Typography>
                    <AppTextField
                        value={
                            new Date(this.state.date * 1000)
                                .toISOString() // yyyy-mm-ddTHH:MM:SS.sssZ
                                .split(".")[0] //                    ^
                        }
                        label="Datum"
                        type="datetime-local"
                        fullWidth
                        onChange={this.handleDateInputChange}
                    />
                    <AppTextField
                        value={
                            this.state.duration !== -1
                                ? this.state.duration / 60
                                : ""
                        }
                        label="Dauer"
                        type="number"
                        endAdornment="Minuten"
                        fullWidth
                        onChange={this.handleDurationInputChange}
                    />
                    <AppSelect
                        value={this.state.intensity}
                        label="Intensität"
                        onChange={this.handleIntensityInputChange}
                        fullWidth
                    >
                        <MenuItem value={Sport.INTENSITY_HIGH}>hoch</MenuItem>
                        <MenuItem value={Sport.INTENSITY_MEDIUM}>mittel</MenuItem>
                        <MenuItem value={Sport.INTENSITY_LOW}>niedrig</MenuItem>
                    </AppSelect>
                    <Typography color="error">
                        {this.state.errorMessage}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        disabled={!this.state.valid}
                        onClick={this.handleSaveButtonClick}>
                        Speichern
                    </Button>
                </CardActions>
            </Card>
        );
    }

}
