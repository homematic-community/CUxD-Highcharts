# CUxD-Highcharts 1.1

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

## ToDo

* Unterstützung von CUxD DEVLOGMOVE (Highcharts "lazy loading"?)
* Maximale Anzahl an Logeinträgen herausexperimentieren :)
* Abfrage von Kanalnamen
* Zuordnung von Units
* Anpassung des Graphentyps (Stufen, Punkte, Faktoren, ...)



## Copyright, Lizenz, Bedingungen

CUxD-Highcharts

Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker

This software is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
Version 3 as published by the Free Software Foundation.

http://www.gnu.org/licenses/gpl.html

Please keep this Readme File when redistributing this Software!

This software comes without any warranty, use it at your own risk!