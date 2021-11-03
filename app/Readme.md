# Frontend

Um den Entwicklungsprozess zu beschleunigen wurde beim Frontend React im Zusammenspiel mit dem
(Material-UI Framework)[https://material-ui.com/] verwendet. Dieses enthält bereits vorgefertigte
UI-Komponenten wie Eingabefelder oder Buttons, was einen großteil der CSS-Arbeit abnimmt. Außerdem
hat React den Vorteil dass es vollständig modular ist, wodurch HTML-Code in übersichtlichere
Einzeldateien aufgeteilt werden kann. Die Einzeldateien haben zudem alle eine eigene
JavaScript-Logik, wodurch dem Prinzip der Datenverkapselung treu geblieben wird. Letztlich kann Code
so auch effizient wiederverwendet werden.

## Generelle Ordnerstruktur

_Anm.: Alle Pfade sind relativ zum Ordner `/app/resources/js`, sofern nicht anders angegeben._

Die `MainApp`-Component in `./index.js` ist der Einstiegspunkt der App, sie wird als erstes
Geladen und kümmert sich um das Routing der einzelnen Seiten. Das klassische Routing im Browser
wurde durch JavaScript ersetzt (`react-router-dom`), wodurch Ladezeiten beim Seitenwechsel bis auf
die quasi nicht vorhandenen Performance-Limitierungen des Browsers vollständig wegfallen.

Die einzelnen Seiten sind im Ordner `./pages` und werden erst aktiv, wenn zu ihnen navigiert wird.
Für viele Komponenten aus Material-UI existiert ein Wrapper in `./components/wrapper`, 
um bestimmte Properties mit globalen Standardwerten zu füllen oder spezifische Styles anzuwenden.
Der `./components` Ordner enthält alle wiederverwendbaren Komponenten, wobei er in einzelne logische
Unterbereiche gegliedert ist (die Ordner dash und login enthalden jeweils nur Komponenten die vom
Dashboard bzw. der Login-Prozedur verwendet werden, könnten theoretisch aber überall eingesetzt
werden).

## Login

Die `SessionManager`-Klasse in `./util` ist für das An- und Abmelden sowie das versenden von API
Requests die eine gültige Session benötigen zuständig. Sie speichert das JSON Web Token (ein vom
Backend signierter base64-String der bestätigt dass sich mit einem bestimmten Account angemeldet
wurde) im localStorage, wodurch man auch über Browsersitzungen hinweg angemeldet bleibt.

## Datenverwaltung

Ähnlich wie im Backend gibt es auch auf der Clientseite Repositories, allerdings mit deutlich
weniger Abstraktion um die Ladezeiten nicht zu stark zu beeinflussen. Außerdem gibt es kein extra
Repository für Benutzer, da für diesen Endpoint schon der `SessionManager` zuständig ist.

Um die Performance zu verbessern wird außerdem ein Cache mittels der IndexedDB-API verwendet.
Da diese auf einem relativ niedrigem Level arbeitet wurde zusätzlich das `Dexie`-Framework
eingebaut, um den Entwicklungsprozess weiter zu beschleunigen.

Der Client behält somit steta eine vollständige Kopie aller Datenbestände die auch am Server
gespeichert werden, und muss lediglich die Änderungen übertragen. Das spart Ladezeiten und
serverseitige Ressourcen.

## Datenübermittlung

Jede Data Model Klasse hat eine statische `fromJSON` und eine nicht-statische `toJSON` Methode,
die für die Serialisierung in und Deserialisierung von JSON zuständig ist. Sie implementiert exakt
das vom Backend erwartete Datenformat, wodurch die Übertragung mit wenig Aufwand von Statten gehen
kann und neue Spalten einfach zu den bestehenden Datensätzen hinzugefügt werden können.

## Fehlerbehandlung

Jeder API-Aufruf wird eine der Methoden in `./util/xhr.js` durchlaufen. Sollte das Backend einen
Fehler feststellen, ist in der JSON-Antwort immer das `err`-Feld auf `true` gesetzt und das
`msg`-Feld enthält einen String mit einer konkreten Fehlermeldung. Wenn dies erkannt wird, wirft
die Methode einen `BackendError`, der neben der Fehlermeldung auch noch den HTTP-Statuscode enthält.
Dieser Fehler wird von den UI Components abgefangen, die dann die Fehlermeldung anzeigen.
