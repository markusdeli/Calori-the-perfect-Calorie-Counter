/* eslint-env es11 */

import React from "react";
import {
    IconButton,
    Tooltip,
    Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon } from "@material-ui/icons";

import EventListeningComponent from "../components/EventListeningComponent";
import { USER_LOGIN, USER_LOGOUT, MEAL_UPDATE } from "../util/events";
import SessionManager from "../util/SessionManager";
import { Redirect } from "react-router-dom";
import MealRepository from "../data/MealRepository";
import SelectableTable, { Row, Column } from "../components/SelectableTable";
import LinkButton from "../components/wrapper/LinkButton";
import { showNotification, SEVERITY_SUCCESS } from "../util/snackbar";

/**
 * Die Spalten, die angezeigt werden sollen
 */
const columns = [
    new Column("name", "Name", false),
    new Column("calories", "Kalorien", true),
    new Column("carbs", "Kohlenhydrate", true),
    new Column("proteins", "Proteine", true),
    new Column("fat", "Fett", true),
];

/**
 * Page Component zum Verwalten aller Mahlzeit-Typen
 */
export default class MealManagePage extends EventListeningComponent {

    constructor(props) {
        super(props);

        this._sessionManager = SessionManager.getInstance();
        this._mealRepo = MealRepository.getInstance();

        this.state = {
            errorMessage: "",
            shouldRedirectToIndex: !this._sessionManager.isLoggedIn,
            rows: [],
            selectedCount: 0,
        };

        this.handleSelectedRowsChange = this.handleSelectedRowsChange.bind(this);
        this.handleDeleteSelected = this.handleDeleteSelected.bind(this);
        this.fetchData();
    }

    get events() {
        return [
            {
                name: USER_LOGIN,
                callback: () => this.setStateSafe({
                    shouldRedirectToIndex: false,
                    errorMessage: "",
                }),
            },
            {
                name: USER_LOGOUT,
                callback: () => this.setStateSafe({
                    shouldRedirectToIndex: true,
                    errorMessage: "",
                }),
            },
            {
                name: MEAL_UPDATE,
                callback: this.fetchData,
            },
        ];
    }

    /**
     * Holt alle Mahlzeit-Typen aus dem Repository
     */
    async fetchData() {
        try {
            const meals = await this._mealRepo.getSortedMealTypes();
            const mealRows = [];
            for (const meal of meals) {
                mealRows.push(new Row(meal, "id"));
            }
            this.setStateSafe({ rows: mealRows, errorMessage: "" });
        } catch (err) {
            this.setStateSafe({ rows: [], errorMessage: err.message });
        }
    }

    /**
     * Callback für Änderungen an der ANzahl ausgewählter Zeilen.
     * Ob eine Zeile ausgewählt ist wird direkt in die `isSelected` Property der
     * jeweiligen `Row` im Array `this.state.rows` geschrieben.
     */
    handleSelectedRowsChange() {
        let count = 0;
        for (const row of this.state.rows) {
            if (row.isSelected) {
                count++;
            }
        }
        this.setState( () => ({ selectedCount: count }) );
    }

    /**
     * Callback fürs Klicken auf den "Löschen"-Button in der Tabellen-Toolbar
     */
    async handleDeleteSelected() {
        const deletePromises = [];
        for (const row of this.state.rows) {
            if (row.isSelected) {
                deletePromises.push(this._mealRepo.deleteMealType(row.valueMap));
            }
        }

        try {
            await Promise.all(deletePromises);
            showNotification(
                SEVERITY_SUCCESS,
                deletePromises.length === 1 ? "Gericht gelöscht" : "Gerichte gelöscht",
            );
        } catch (err) {
            this.setStateSafe({ errorMessage: err.message });
        }
    }

    render() {
        if (this.state.shouldRedirectToIndex) {
            return <Redirect to="/"/>;
        }

        const selectedToolbarActions = (
            <Tooltip title="Löschen">
                <IconButton color="inherit" onClick={this.handleDeleteSelected} arial-label="löschen">
                    <DeleteIcon/>
                </IconButton>
            </Tooltip>
        );

        return (
            <div className="page-narrow">
                <Typography variant="h2">
                    Gerichte verwalten
                </Typography>
                <Typography color="error">
                    {this.state.errorMessage}
                </Typography>

                <SelectableTable
                    title="Gerichte"
                    columns={columns}
                    orderBy="calories"
                    order="desc"
                    rows={this.state.rows}
                    onSelectedRowsChange={this.handleSelectedRowsChange}
                    selectedToolbarActions={selectedToolbarActions}
                />

                <LinkButton
                    to="/dash"
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "16px" }}
                >
                    Zurück
                </LinkButton>
            </div>
        );
    }

}
