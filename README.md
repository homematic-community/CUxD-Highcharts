# CUxD-Highcharts 1.2

Zusatzsoftware für die HomeMatic CCU um CUxD DEVLOGS mit Highcharts zu visualisieren

## Installation

### Als Zusatzsoftware

Im HomeMatic WebUI cuxchart.tar.gz als Zusatzsoftware installieren. Download über http://homematic-inside.de

### Per FTP/SCP (Vorteil: kein Zwangsreboot der CCU!)

Den Ordner cuxchart aus dem Zip-File https://github.com/hobbyquaker/CUxD-Highcharts/archive/master.zip auf die CCU nach /www/addons/ kopieren.

## Verwendung

* http://ccu/addons/cuxchart/ aufrufen

CUxD-Highcharts liest das Config-File des CUxD aus und findet so das Logfile. Es ist daher keine Konfiguration notwendig.

Wie das Geräte-Logging des CUxD eingerichtet wird ist im CUxD-Handbuch Kapitel 8 beschrieben.
Der Parameter DEVTIMEFORMAT muss auf seinem Default-Wert %Y-%m-%dT%X bleiben.

## Changelog

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

## ToDo

* Maximale Anzahl an Logeinträgen herausexperimentieren :)
* Über Querystring steuerbar machen: Anzeigte Datenreihen, Anzeige der Legende, Anzeige des Navigators
* Tooltip bei Graphentyp Scatter (Datenpunkte PRESS_LONG, PRESS_SHORT, MOTION) korrigieren (Zeit-Formatierung)
* Unter Titel durchschn. Log-Einträge pro Minute anzeigen
* Fehler beheben: 1. Datenreihe wird immer wieder selektiert...


## Copyright, Lizenz, Bedingungen

ACHTUNG: Die enthaltene Highcharts-Bibliothek steht unter einer CC-Non-Profit Lizenz! Mehr dazu hier:
http://shop.highsoft.com/faq#non-commercial-redistribution


CUxD-Highcharts

Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!