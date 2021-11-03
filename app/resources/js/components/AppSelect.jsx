/* eslint-env es11 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { InputLabel, Select, FormControl } from "@material-ui/core";

let count = 0;

/**
 * Ein einfaches Dropdown-Auswahlmenü
 */
export default class AppSelect extends Component {

    constructor(props) {
        super(props);

        this._countId = count++;
    }

    render() {
        return (
            <FormControl
                style={{
                    display: this.props.fullWidth ? "block" : undefined,
                    margin: "12px",
                }}
            >
                <InputLabel id={`app-select-input-label-${this._countId}`}>
                    {this.props.label}
                </InputLabel>
                <Select
                    labelId={`app-select-input-label-${this._countId}`}
                    id={`app-input-${this._countId}`}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    fullWidth={this.props.fullWidth}
                >
                    {this.props.children}
                </Select>
            </FormControl>
        );
    }

}

AppSelect.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element),
    ]),
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
};
