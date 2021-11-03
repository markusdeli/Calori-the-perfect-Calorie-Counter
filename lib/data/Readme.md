In diesem Unterordner befindet sich die Implementierung und Abstraktionsschicht für alle
Datenbankabfragen. Jede Tabelle in der Datenbank wird als eine `DataSource`-Klasse dargestellt
und somit in eine logische Komponente unterteilt. Die `Repository`-Klassen bilden eine weitere
Ebene der Abstraktion, um in Zukunft auch andere Datenquellen als eine Datenbank, wie etwa ein
Cache, mit relativ wenig Aufwand hinzufügen zu können.

Die einzelnen Endpunkte im `routes`-Unterordner greifen dann auf instanzen der jeweiligen
`Repository`-Klasse zu
