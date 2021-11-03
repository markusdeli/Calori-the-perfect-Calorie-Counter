/* eslint-env es11 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { FormControl, FormHelperText, Input, InputLabel } from "@material-ui/core";

let elementCount = 0;

/**
 * Kein echter Wrapper im klassischen Sinne, ist aber weitgehend mit der
 * TextField Component aus material-ui kompatibel und enthält einige Anpassungen
 * in Bezug auf Design
 */
export default class AppTextField extends Component {

    constructor(props) {
        super(props);

        this._elementNo = elementCount++;
    }

    render() {
        return (
            <FormControl
                style={{
                    display: this.props.fullWidth ? "block" : undefined,
                    margin: "12px",
                }}
                error={this.props.error}
            >
                <InputLabel
                    id={`InputField-${this._elementNo}-label`}
                    htmlFor={`InputField-${this._elementNo}-input`}
                    color="secondary"
                >
                    {this.props.label}
                </InputLabel>
                <Input
                    id={`InputField-${this._elementNo}-input`}
                    color="secondary"
                    onChange={this.props.onChange}
                    startAdornment={this.props.startAdornment}
                    endAdornment={this.props.endAdornment}
                    type={this.props.type || "text"}
                    value={this.props.value}
                    required={this.props.required}
                    placeholder={this.props.placeholder}
                    fullWidth={this.props.fullWidth}
                    inputProps={{"aria-label": this.props.label}}
                    aria-describedby={`InputField-${this._elementNo}-label`}
                />
                {this.props.error ? (
                    <FormHelperText>{this.props.errorMessage}</FormHelperText>
                ) : null}
            </FormControl>
        );
    }

}

AppTextField.propTypes = {
    startAdornment: PropTypes.element,
    endAdornment: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    fullWidth: PropTypes.bool,
    label: PropTypes.string,
    value: PropTypes.any,
    type: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
};
