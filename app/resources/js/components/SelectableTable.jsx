/* eslint-env es11 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    Checkbox,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TableContainer,
    Toolbar,
    Typography,
} from "@material-ui/core";

/**
 * Speichert alle Daten für eine Spalte
 */
export class Column {

    /**
     * Definiert eine neue Spalte in der Tabelle
     *
     * @param {string} id Die ID dieses Columns, und der Key unter dem die
     *     Daten für diese Spalte in den `valueMap`s der einzelnen `Row`s
     *     gespeichert werden
     * @param {*} label Der Anzeigename dieser Spalte
     * @param {*} numeric `true` falls diese Spalte nummerische (also sortierbare)
     *     Werte enthält
     */
    constructor(id, label, numeric) {
        // Keine extra Getter, weil das hier mehr oder weniger
        // performance-kritisch ist

        /**
         * Die ID dieser Spalte.
         * Das ist gleichzeitig der Key, mit dem sich die Werte aus den
         * `valueMap`s der einzelnen `Row`s holen lassen.
         *
         * @public
         * @readonly
         * @type {string}
         */
        this.id = id;

        /**
         * Der Anzeigename dieser Spalte
         *
         * @public
         * @readonly
         * @type {string}
         */
        this.label = label;

        /**
         * `true` wenn diese Spalte einen nummerischen (sortierbaren) Wert trägt
         *
         * @public
         * @readonly
         * @type {boolean}
         */
        this.numeric = numeric;
    }

}

/**
 * Eine Map bei der der Key die ID eines {@link Column}s und der Wert der
 * Wert des zugehörigen Datensatzes ist. Es empfiehlt sich, hierfür eine Data
 * Model Instanz zu verwenden (zB die Meal oder Sport Klasse) und minimalen
 * Overhead zu erreichen. Dann müssen die IDs der jeweiligen Columns mit den
 * Properties der Data Model Klasse übereinstimmen.
 * @typedef {Object.<string, any>} RowValueMap
 */

/**
 * Repräsentiert einen einzelnen Datensatz und speichert ob dieser aktuell
 * ausgewählt ist
 */
export class Row {

    /**
     * Erstellt eine neue Tabellenzeile
     *
     * @param {RowValueMap} values Ein Key-Value Speicher der einzelnen Spaltenwerte
     * @param {string} keyCol Die Spalte deren ID
     */
    constructor(values, keyCol) {
        /**
         * Eine Map der Spaltenwerte
         *
         * @public
         * @type {RowValueMap}
         */
        this.valueMap = values;
        /**
         * Die Spalte in der der Primärschlüssel gespeichert ist
         *
         * @public
         * @type {strint}
         */
        this.keyCol = keyCol;
        /**
         * Ob diese Zeile aktuell ausgewählt ist
         */
        this.isSelected = false;
    }

}

/**
 * Eine Toolbar die über einer Tabelle angezeigt wird.
 * Wenn mindestens ein Element der Tabelle ausgewählt ist, werden
 * benutzerdefinierte Aktions-Buttons und die Anzahl der ausgewählten Elemente
 * angezeigt.
 */
export class SelectableTableToolbar extends Component {

    render() {
        return (
            <Toolbar>
                {this.props.numSelected > 0 ? (
                    <Typography
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                        style={{ flex: "1 1 100%" }}
                    >
                        {this.props.numSelected} ausgewählt
                    </Typography>
                ) : (
                    <Typography
                        variant="h6"
                        component="div"
                    >
                        {this.props.title}
                    </Typography>
                )}

                {
                    this.props.numSelected > 0 && this.props.selectedToolbarActions
                        ? this.props.selectedToolbarActions
                        : null
                }
            </Toolbar>
        );
    }

}

SelectableTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    selectedToolbarActions: PropTypes.element,
};

// Diese Components sind eine Abwandlung des Beispiels aus
// https://material-ui.com/components/tables/#sorting-amp-selecting

/**
 * Ein Tabellen-Header der die einzelnen Spaltennamen anzeigt.
 * Wird ausschließlich von {@link SelectableTable} verwendet.
 */
export class SelectableTableHead extends Component {

    render() {
        const createSortHandler = colId => event => this.props.onRequestSort(event, colId);

        return (
            <TableHead>
                <TableRow>
                    <TableCell padding="checkbox">
                        <Checkbox
                            indeterminate={
                                this.props.numSelected > 0
                                && this.props.numSelected < this.props.numRows
                            }
                            checked={
                                this.props.numRows > 0
                                && this.props.numSelected === this.props.numRows
                            }
                            onChange={this.props.onSelectAllClick}
                            inputProps={{ "aria-label": "Alle Gerichte auswählen" }}
                        />
                    </TableCell>
                    {this.props.columns.map(col => (
                        <TableCell
                            key={col.id}
                            align={col.numeric ? "right" : "left"}
                            sortDirection={this.props.orderBy === col.id ? this.props.order : false}
                        >
                            <TableSortLabel
                                active={this.props.orderBy === col.id}
                                direction={this.props.orderBy === col.id ? this.props.order : "asc"}
                                onClick={createSortHandler(col.id)}
                            >
                                {col.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }

}

SelectableTableHead.propTypes = {
    numRows: PropTypes.number.isRequired,
    numSelected: PropTypes.number.isRequired,
    columns: PropTypes.arrayOf(PropTypes.instanceOf(Column)).isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    onRequestSort: PropTypes.func.isRequired,
};

/**
 * Eine Tabelle bei der einzelne Zeilen ausgewählt werden können.
 *
 * Die zwei wichtigsten Properties für diese Component sind `cols` und `rows`.
 * Sie müssen ein Array aus Objekten der Klassen {@link Column} respektive
 * {@link Row} sein und geben an, welche Daten wie dargestellt werden.
 * Jedes `Column` beschreibt eine einzelne Spalte in der Tabelle. `Row`s
 * speichern die Werte ihrer Spalten in der `valueMap`.
 *
 * Damit eine `SelectableTable` diese Spaltenwerte nun korrekt rendern kann,
 * benötigt sie folgende Informationen:
 *
 * - die Spaltennamen,
 * - unter welchem Index die Werte dieser Spalten in der `valueMap` der
 *   einzelnen `Row`s gespeichert sind,
 * - die Reihenfolge der Spalten, sowie
 * - welche Spalten sortiert werden können.
 *
 * Die Spaltennamen werden einfach als die `label` Property in den `Column`s
 * gespeichert. Die `id` der Columns ist nicht nur eine einfache ID, sondern
 * muss auch exakt mit den Keys in der `valueMap` der einzelnen `Row`s
 * übereinstimmen; sie wird nämlich auch genau für das verwendet. Die Reihenfolge
 * der Spalten ergibt sich aus der Reihenfolge der einzelnen `Column`s im Array.
 * Letztlich hat `Column` auch noch eine bool'sche `numeric`-Property. Diese
 * gibt an, ob eine bestimmte Spalte sortiert werden kann.
 */
export default class SelectableTable extends Component {

    constructor(props) {
        super(props);

        this.state = {
            order: this.props.order,
            orderBy: this.props.orderBy || "",
            numSelected: 0,
        };

        /**
         * Interne "Halb"-Kopie (s. Kommentar in {@link #render}) der Rows.
         * Wird fürs Sortieren verwendet.
         *
         * @private
         * @type {Row[]}
         */
        this._rows = this.props.rows;
        /**
         * Zuverlässiger Zähler für die Anzahl an ausgewählten Spalten, weil
         * setState() asynchron arbeitet
         *
         * @private
         * @type {number}
         */
        this._numSelected = 0;

        this._numberFormat = new Intl.NumberFormat();

        this.handleRequestSort = this.handleRequestSort.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    }

    handleRequestSort(event, colId) {
        event.persist();

        const isAsc = this.state.orderBy === colId && this.state.order === "asc";
        this.setState(() => ({
            order: isAsc ? "desc" : "asc",
            orderBy: colId,
        }));
    }

    /**
     * Callback wenn in der {@link SelectableTableHead} Component auf die
     * "alles auswählen"-Checkbox geklickt wurde
     *
     * @param {Event} e Das Event
     */
    handleSelectAllClick(e) {
        e.persist();

        for (const row of this.props.rows) {
            row.isSelected = e.target.checked;
        }
        this.setState(() => ({
            numSelected: e.target.checked ? this.props.rows.length : 0,
        }));
    }

    /**
     * Callback für Klicks auf eine bestimmte Tabellenzeile
     *
     * @param {Event} event Das Event
     * @param {*} row Die Tabellenzeile, auf die geklickt wurde
     */
    handleClick(event, row) {
        event.persist();

        row.isSelected = !row.isSelected;
        this._numSelected += row.isSelected ? 1 : -1;

        this.setState(() => ({
            numSelected: this._numSelected,
        }));
        if (typeof this.props.onSelectedRowsChange === "function") {
            this.props.onSelectedRowsChange(event);
        }
    }

    render() {
        /**
         * Kleiner Wrapper um event Handler für das Klicken auf eine bestimmte
         * Tabellenzeile einfacher zu erstellen
         *
         * @param {Row} row Die Tabellenzeile, auf die geklickt wurde
         */
        const createOnClickHandler = row => event => this.handleClick(event, row);

        // Zeilen neu aus den Properties klonen, falls sie sich seit dem
        // letzten Rendern geändert haben. Das ist bewusst kein Deep Copy,
        // wodurch wir uns das Kopieren der tatsächlichen Datensätze
        // (also den ValueMaps) sparen. Das hat den schönen Nebeneffekt, dass
        // sich deren isSelected Property auch in der Component die die
        // Daten zur Verfügung stellt ändert, wodurch sie bei onSelectedRowsChange
        // nicht erneut kopiert werden müssen.
        this._rows = this.props.rows.slice();
        if (this.state.orderBy) {
            this._rows.sort((a, b) => {
                if (this.state.order === "desc") {
                    return a.valueMap[this.state.orderBy] - b.valueMap[this.state.orderBy];
                }
                return b.valueMap[this.state.orderBy] - a.valueMap[this.state.orderBy];
            });
        }

        return (
            <Paper>
                <SelectableTableToolbar
                    title={this.props.title}
                    numSelected={this.state.numSelected}
                    selectedToolbarActions={this.props.selectedToolbarActions}
                />
                <TableContainer>
                    <Table>
                        <SelectableTableHead
                            columns={this.props.columns}
                            numSelected={this.state.numSelected}
                            numRows={this._rows.length}
                            order={this.state.order}
                            orderBy={this.state.orderBy}
                            onRequestSort={this.handleRequestSort}
                            onSelectAllClick={this.handleSelectAllClick}
                        />

                        <TableBody>
                            {this._rows.map(row => (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    key={row.valueMap[row.keyCol]}
                                    selected={row.isSelected}
                                    onClick={createOnClickHandler(row)}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={row.isSelected}/>
                                    </TableCell>

                                    {this.props.columns.map(col => (
                                        <TableCell
                                            component={col.id === row.keyCol ? "th" : undefined}
                                            align={col.numeric ? "right" : "left"}
                                            scope="row"
                                            key={`${row.valueMap[row.keyCol]}-${col.id}`}
                                        >
                                            {
                                                col.numeric
                                                    ? this._numberFormat.format(row.valueMap[col.id])
                                                    : row.valueMap[col.id]
                                            }
                                        </TableCell>
                                    ))}

                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Paper>
        );
    }

}

SelectableTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.instanceOf(Column)).isRequired,
    order: PropTypes.oneOf(["asc", "desc"]),
    orderBy: PropTypes.string,
    onOrderByChange: PropTypes.func,
    onSelectedRowsChange: PropTypes.func,
    rows: PropTypes.arrayOf(PropTypes.instanceOf(Row)).isRequired,
    title: PropTypes.string.isRequired,
    selectedToolbarActions: PropTypes.element,
};
