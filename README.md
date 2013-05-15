# CUxD-Highcharts 1.3

Zusatzsoftware für die HomeMatic CCU um CUxD DEVLOGS via Highcharts/Highstock zu visualisieren

## Installation

### Als Zusatzsoftware

Im HomeMatic WebUI cuxchart.tar.gz als Zusatzsoftware installieren. Download über http://homematic-inside.de

### Per FTP/SCP
(Vorteil: kein Zwangsreboot der CCU, Nachteil: die Software taucht nicht in der Liste der installierten Zusatzsoftware auf und lässt sich dort auch nicht deinstallieren)

Den Ordner cuxchart aus [diesem Zip-File](https://github.com/hobbyquaker/CUxD-Highcharts/archive/master.zip) auf die CCU nach /www/addons/ kopieren. Zum deinstallieren einfach löschen.


## Dokumentation

* Wie das Geräte-Logging des CUxD eingerichtet wird ist im CUxD-Handbuch Kapitel 8 beschrieben. Der Parameter DEVTIMEFORMAT muss auf seinem Default-Wert %Y-%m-%dT%X bleiben.
* CUxD-Highcharts liest das Config-File des CUxD aus und findet so das Logfile. Es ist daher keine weitere Konfiguration notwendig.
* Einfach installieren und http://ccu/addons/cuxchart/ aufrufen

### URL-Parameter

Über Parameter in der URL können verschiedene Optionen von CUxD-Highcharts gesteuert werden.

Beispiel:    
    http://homematic/addons/cuxchart/?navigator=false&scrollbar=false&legend=inline&zoom=false&range=24&period=24&dp=CUX0600101:1.MEAN5MINUTES,CUX0600101:1.METER

#### theme

* THEME - Darstellung nach Geschmack aufhübschen ;) Bisher stehen zur Verfügung: grid, skies, dark-green, dark-blue und gray

#### dp

* DATAPOINTS - Eine Komma-getrennte Liste von Datenpunkten die geladen und angezeigt werden sollen

#### range

* HOURS - Setzt Zoomstufe auf HOURS Stunden

#### period

* HOURS - Lädt nur Logeinträge aus den letzten HOURS Stunden

#### loader

* false - blendet die Infos beim Laden aus

#### navigator

* false - Navigations-Bereich unten wird ausgeblendet

#### scrollbar

* false - Scrollbar wird ausgeblendet

#### legend

* false - Legende, Überschrift und Credits werden ausgeblendet
* inline - Legende wird horiziontal oben im Graph angezeigt, Überschrift und Credits werden ausgeblendet

#### zoom

* false - Kein Zoomen möglich

## ToDo / Roadmap

### ASAP

* Fehler beheben: in bestimmten Konstellationen (Browser, Zeitzone, ...?) ist die Beschriftung der X-Achse um 1 oder 2h verschoben
* Maximale Anzahl an Logeinträgen herausexperimentieren :)
* Tooltip bei Graphentyp Scatter (Datenpunkte PRESS_LONG, PRESS_SHORT, MOTION) korrigieren (Zeit-Formatierung)

### 1.4

* Wie mit CUxD Transform-Wrapper-Device Datenpunkten umgehen?
* Config-File oder Config-Dialog um Datenreihen-Optionen individuell anzupassen
* Tooltip erweitern: Anzahl Werte, Zeitpunkt erster und letzter Wert, Anzahl Log-Einträge, Mittel, Median, Min, Max, ...?
* Unter Titel Log-Einträge pro Minute anzeigen

### Vielleicht/irgendwann

* Marker setzen und speichern
* exporting (Highcharts Modul bietet PDF, JPG, SVG usw an)

## Changelog

### 1.3
* Steuerung verschiedener Optionen über URL-Parameter
* Themes
* Datenpunkte in Legende alphabetisch sortiert
* Fehler beim Speichern der ausgewählten Datenreihen behoben
* Caching der alten Logs
* diverse Bugfixes und kleine Verbesserungen

### 1.2
* Verwendung von Highstock
* Unterstützung von DEVLOGMOVE
* Ausgewählte Graphen werden im LocalStorage des Browsers gespeichert und beim nächsten Seitenaufruf autom. wieder ausgewählt
* Statt Datenpunkt-Bezeichnern werden in der Legende nun Kanalnamen gefolgt vom HssType und der Einheit angezeigt
* Lade-Seite mit Möglichkeit das Laden der Logfiles abzubrechen
* Für unterschiedliche Datenpunkttypen werden nun passende Graphen-Typen ausgewählt

### 1.1
* diverse Fehler behoben

### 1.0
* Erstes öffentliches Release



## Verwendete Software

* [jQuery](http://www.jquery.com)
* [loStorage](https://github.com/js-coder/loStorage.js)
* [Highcharts / Highstock - Non-Commercial License - keine kommerzielle Verwendung!](http://www.highcharts.com)

## Copyright, Lizenz, Bedingungen

Copyright (c) 2013 [hobbyquaker](https://github.com/hobbyquaker)   
Lizenz: [CC BY-NC 3.0](http://creativecommons.org/licenses/by-nc/3.0/de/)

Sie dürfen:    
 * das Werk bzw. den Inhalt vervielfältigen, verbreiten und öffentlich zugänglich machen
 * Abwandlungen und Bearbeitungen des Werkes bzw. Inhaltes anfertigen  

Zu den folgenden Bedingungen:   
 * Namensnennung - Sie müssen den Namen des Autors/Rechteinhabers in der von ihm festgelegten Weise nennen.
 * Keine kommerzielle Nutzung — Dieses Werk bzw. dieser Inhalt darf nicht für kommerzielle Zwecke verwendet werden.  

Wobei gilt:    
 * Verzichtserklärung - Jede der vorgenannten Bedingungen kann aufgehoben werden, sofern Sie die ausdrückliche Einwilligung des Rechteinhabers dazu erhalten.


Die Veröffentlichung dieser Software erfolgt in der Hoffnung, daß sie Ihnen von Nutzen sein wird, aber
OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN
BESTIMMTEN ZWECK.

Die Nutzung dieser Software erfolgt auf eigenes Risiko. Der Author dieser Software kann für eventuell
auftretende Folgeschäden nicht haftbar gemacht werden!
