# CUxD-Highcharts 1.2

Zusatzsoftware für die HomeMatic CCU um CUxD DEVLOGS mit Highcharts zu visualisieren

## Installation

### Als Zusatzsoftware

Im HomeMatic WebUI cuxchart.tar.gz als Zusatzsoftware installieren. Download über http://homematic-inside.de

### Per FTP/SCP
(Vorteil: kein Zwangsreboot der CCU, Nachteil: die Software taucht nicht in der Liste der installierten Zusatzsoftware auf und lässt sich dort auch nicht deinstallieren)

Den Ordner cuxchart aus dem [Zip-File](https://github.com/hobbyquaker/CUxD-Highcharts/archive/master.zip) auf die CCU nach /www/addons/ kopieren. Zum deinstallieren einfach löschen.



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

## Verwendete Software

* [jQuery](http://www.jquery.com)
* [loStorage](https://github.com/js-coder/loStorage.js)
* [Highcharts / Highstock](http://www.highcharts.com)

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
