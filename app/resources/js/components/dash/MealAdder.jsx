/* eslint-env es11 */

import React from "react";
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
import LinkButton from "../wrapper/LinkButton";
import MealRepository from "../../data/MealRepository";
import EventListeningComponent from "../EventListeningComponent";
import { MEAL_UPDATE } from "../../util/events";
import { showNotification, SEVERITY_SUCCESS } from "../../util/snackbar";

/**
 * Card Component zum Hinzufügen von neuen Mahlzeiten
 */
export default class MealAdder extends EventListeningComponent {

    constructor(props) {
        super(props);

        /**
         * @private
         * @type {MealRepository}
         */
        this._mealRepo = MealRepository.getInstance();

        this.state = {
            errorMessage: "",
            selectedDate: Math.floor(Date.now() / 1000 /* millisekunden */),
            selectedType: { id: -1, UICalories: "" },
            types: null,
        };

        this.fetchMealTypes();

        this.handleTypeInputChange = this.handleTypeInputChange.bind(this);
        this.handleDateInputChange = this.handleDateInputChange.bind(this);
        this.handleSaveButtonClick = this.handleSaveButtonClick.bind(this);
    }

    get events() {
        return [
            {
                name: MEAL_UPDATE,
                callback: this.fetchMealTypes,
            },
        ];
    }

    /**
     * Holt alle MealTypes vom MealRepository und schreibt sie in den state,
     * wodurch diesses Component automatisch aktualisiert wird
     *
     * @return {Promise<void>}
     */
    async fetchMealTypes() {
        try {
            const types = await this._mealRepo.getMealTypes();
            if (types.length === 0) {
                types.push({ id: -1, name: "(Noch nichts hinzugefügt)", UICalories: "" });
            }

            this.setStateSafe({
                types: types,
                selectedType: types[0],
            });
        } catch (err) {
            this.setStateSafe({ errorMessage: err.message });
        }
    }

    /**
     * Event-Handler für Änderungen am Datums-Input
     *
     * @param {Event} e Das Event
     */
    handleDateInputChange(e) {
        e.persist();

        // Alle die bisher der Meinung waren dass JavaScript eine schöne Sprache sei
        // mögen bitte die folgenden Zeilen lesen und dann die Fresse halten.

        if (e.target.value) {
            const localDate = new Date(e.target.value);

            // e.target.value (Also der Wert des HTML Date Inputs) ist ein
            // Datestring in lokaler Zeit, wodurch wir erst den Offset der
            // aktuellen Zeitzone abziehen müssen um zur UNIX-Zeit zu gelangen.
            // Ach ja, und getTimezoneOffset() liefert den Offset in *Minuten*
            // relativ zu UTC.
            const timestamp =
                Math.floor(localDate.getTime() / 1000) - localDate.getTimezoneOffset() * 60;
            this.setState( () => ({ selectedDate: timestamp }) );
        }
    }

    /**
     * Event-Handler für Änderungen am Typ-Select
     *
     * @param {Event} e Das Event
     */
    handleTypeInputChange(e) {
        e.persist();
        let selectedType;
        for (const t of this.state.types) {
            if (t.id === e.target.value) {
                selectedType = t;
                break;
            }
        }

        this.setState( () => ({ selectedType: selectedType }) );
    }

    /**
     * onClick-Callback für den Speichern-Button
     */
    async handleSaveButtonClick() {
        try {
            await this._mealRepo.addMeal({
                typeId: this.state.selectedType.id,
                date: this.state.selectedDate,
            });
            this.setState(() => ({
                errorMessage: "",
                selectedDate: Math.floor(Date.now() / 1000),
            }));
            showNotification(SEVERITY_SUCCESS, "Mahlzeit hinzugefügt");
        } catch (err) {
            this.setState( () => ({ errorMessage: err.message }) );
        }
    }

    render() {
        const typeMenuItems = [];

        if (Array.isArray(this.state.types)) {
            if (this.state.types.length === 0) {
                typeMenuItems[0] = (
                    <MenuItem key="0" value={-1}>
                        <i>Kein Gericht erstellt</i>
                    </MenuItem>
                );
            } else {
                for (const type of this.state.types) {
                    typeMenuItems.push(<MenuItem key={type.id.toString()} value={type.id}>{type.name}</MenuItem>);
                }
            }
        } else {
            typeMenuItems[0] = <MenuItem key="0" value={-1}><i>Laden...</i></MenuItem>;
        }

        return (
            <Card>
                <CardContent>
                    <Typography variant="h5">
                        Neue Mahlzeit hinzufügen
                    </Typography>
                    <AppTextField
                        value={
                            new Date(this.state.selectedDate * 1000)
                                .toISOString() // yyyy-mm-ddTHH:MM:SS.sssZ
                                .split(".")[0] //                    ^
                        }
                        label="Datum"
                        type="datetime-local"
                        fullWidth
                        onChange={this.handleDateInputChange}
                    />
                    <AppSelect
                        value={this.state.selectedType.id}
                        label="Gericht"
                        onChange={this.handleTypeInputChange}
                        fullWidth
                    >
                        {typeMenuItems}
                    </AppSelect>
                    <Typography>
                        {this.state.selectedType.UICalories}
                    </Typography>
                    <Typography color="error">
                        {this.state.errorMessage}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button
                        disabled={this.state.selectedType.id === -1}
                        onClick={this.handleSaveButtonClick}>
                        Speichern
                    </Button>
                    <LinkButton to="/dash/meals">
                        Verwalten
                    </LinkButton>
                </CardActions>
            </Card>
        );
    }

}
