/* eslint-env es11 */

import { Component } from "react";

/**
 * Ein Tupel aus Event-Name und zugehörigem Listener
 * @typedef {object} EventListenerDef
 * @prop {string} name Der Name des Events, auf das gelauscht werden soll
 * @prop {function} callback Die Callback-Funktion, die beim Eintreten des
 *     Events ausgeführt werden soll
 */

/**
 * Utility-Klasse zum einfacheren Management von Event-Listenern.
 *
 * Diese Klasse bildet einen Wrapper für {@link Component} und kümmert sich
 * zudem noch um das Erstellen und Entfernen von Event-Listenern zur Laufzeit.
 * React verlangt nämlich, dass sämtliche Event-Listener beim Unmounten der
 * Component entfernt werden um Leaks zu vermeiden. Alle Child-Klassen müssen,
 * wenn sie die Methoden {@link #componentDidMount} und
 * {@link #componentWillUnmount} overriden, immer zuerst die Super-Methode
 * aufrufen.
 */
export default class EventListeningComponent extends Component {

    constructor(props) {
        super(props);

        this._eventListeners = {};
        this._isMounted = false;
    }

    /**
     * Ein Array aus allen Events und deren zugehörigen Callbacks, auf die
     * gelauscht werden soll. Jeder Event-Name darf nur ein mal angegeben werden.
     * Der `this`-Wert im Callback ist immer die Instanz dieser Component.
     *
     * @abstract
     * @readonly
     * @type {Array.<EventListenerDef>}
     */
    get events() {
        return [];
    }

    /**
     * @inheritdoc
     * @override
     */
    componentDidMount() {
        this._isMounted = true;

        for (const def of this.events) {
            if (this._eventListeners[def.name]) {
                throw new Error(`Multiple event listeners for event ${def.name}`);
            }

            this._eventListeners[def.name] = (...args) => def.callback.call(this, ...args);
            window.document.addEventListener(def.name, this._eventListeners[def.name]);
        }
    }

    /**
     * @inheritdoc
     * @override
     */
    componentWillUnmount() {
        for (const eventName in this._eventListeners) {
            if (Object.prototype.hasOwnProperty.call(this._eventListeners, eventName)) {
                window.document.removeEventListener(eventName, this._eventListeners[eventName]);
            }
        }
        this._eventListeners = {};

        this._isMounted = false;
    }

    /**
     * Wrapper zum Setzen des States wenn nicht bekannt ist ob die Component
     * aktuell gemountet ist. Das ist vor Allem für asynchrone Operationen
     * von Vorteil. Verhält sich wie `setState()` mit einem Callback als
     * Parameter wenn die Component gemountet ist, und schreibt direkt in das
     * state-Objekt wenn nicht.
     *
     * @param {object} newState Alle Attribute, die am Status geändert werden sollen
     */
    setStateSafe(newState) {
        if (this._isMounted) {
            this.setState(() => newState);
        } else {
            for (const key in newState) {
                if (Object.prototype.hasOwnProperty.call(newState, key)) {
                    // eslint-disable-next-line react/no-direct-mutation-state
                    this.state[key] = newState[key];
                }
            }
        }
    }

}
