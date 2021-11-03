# Backend

In diesem Ordner befindet sich der gesamte serverseitige Code. Er setzt sich aus drei wesentlichen
Komponenten zusammen:

- Die Request-Handler (in `./routes` und `./middleware`) validieren und beantworten eingehende
  HTTP Requests
- Die Repositories und DataSources (in `./data` bzw. `./data/sqlite`) stellen den Routing-Handlern
  ihre Daten zur Verfügung. Dank einer zweilagigen Abstraktionsebene kann die Anwendung mit
  wenig Aufwand um einen Cache erweitert werden.
- Die Models (in `./data/model`) stellen ein gemeinsames Interface zum Datenaustausch zwischen allen
  Komponenten zur Verfügung

Bis auf Express (aus Gründen der Performance) existiert für jedes eingesetzte Framework mindestens
eine Abstraktionsschicht. Wenn in Zukunft eine Dependency keinen Support mehr erhält oder sich ihre
APIs ändern, sind nur wenige Änderungen im Code notwendig. Die Wrapper befinden sich im Ordner `./util`.

## Fehlerbehandlung

Generell werden `Error`s ohne try-catch Blöcke einfach an die nächsthöhere Schicht weitergegeben.
Da sich die Routing-Handler an oberster Stelle im Datenfluss befinden (sie sind am "nähesten" am
Client und setzen alle tieferliegenden Schichten erst in Gang), sind auch sie für das Auffangen von
Fehlern zuständig. Dafür stellt Express eine eigene Funktion bereit (siehe `AppServer`).

Alle JSON-Antworten die an den Client gesendet werden, egal ob sie mit HTTP/200 oder einem anderen
Code beantwortet werden, besitzen ein Boolean-Feld namens `err`. Ist dieses `true`, so enthält
die Antwort zusätzlich noch ein String-Feld namens `msg`, das eine genauere Fehlermeldung enthält.
Der Client überprüft dieses `err`-Feld und erkennt dadurch, ob eine Fehlermeldung anzuzeigen ist.
