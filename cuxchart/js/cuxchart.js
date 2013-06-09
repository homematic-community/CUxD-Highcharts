/**
 *      CUxD-Highcharts
 *
 *      visualisiert CUxD Geräte-Logs mittels Highcharts
 *
 *      Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker
 *
 *      Lizenz: CC BY-NC 3.0 http://creativecommons.org/licenses/by-nc/3.0/de/
 *
 *      Sie dürfen:
 *          das Werk bzw. den Inhalt vervielfältigen, verbreiten und öffentlich zugänglich machen
 *          Abwandlungen und Bearbeitungen des Werkes bzw. Inhaltes anfertigen
 *      Zu den folgenden Bedingungen:
 *          Namensnennung - Sie müssen den Namen des Autors/Rechteinhabers in der von ihm festgelegten Weise nennen.
 *          Keine kommerzielle Nutzung - Dieses Werk bzw. dieser Inhalt darf nicht für kommerzielle Zwecke verwendet
 *          werden.
 *      Wobei gilt:
 *          Verzichtserklärung - Jede der vorgenannten Bedingungen kann aufgehoben werden, sofern Sie die ausdrückliche
 *          Einwilligung des Rechteinhabers dazu erhalten.
 *
 *      Die Veröffentlichung dieser Software erfolgt in der Hoffnung, daß sie Ihnen von Nutzen sein wird, aber
 *      OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN
 *      BESTIMMTEN ZWECK.
 *
 *      Die Nutzung dieser Software erfolgt auf eigenes Risiko. Der Author dieser Software kann für eventuell
 *      auftretende Folgeschäden nicht haftbar gemacht werden!
 *
 */

var cuxchart;

;(function ($) {

    cuxchart = {
        version: "1.3.9",
        chart: undefined,
        chartOptions: {},
        queryParams: getUrlVars(),
        storageKey: "cuxchart",
        cache: {
            visible: []
        },
        first: "2038-01-18T00:00:00",
        last: "0000-00-00T00:00:00",
        start: "0000-00-00T00:00:00",
        tzOffset: 60000 * (new Date().getTimezoneOffset()),
        countDp: 0,
        countVal: 0,
        dpInfos: {},
        revDpInfos: {},
        cuxdConfig: {
            ALIASES: {},
            REVALIASES: {},
            OLDLOGS: []
        },
        dates: {},
        getDpInfos: function (callback) {
            var dps = [];
            for (var dp in cuxchart.dates) {
                //console.log("dp " + dp);
                if (!dp.match(/.*:.*\..*/)) {
                    if (cuxchart.cuxdConfig.ALIASES[dp]) {
                        dp = cuxchart.cuxdConfig.ALIASES[dp];
                        //console.log("=> " + dp);

                    }
                }
                dps.push(dp);
            }
            for (dp in cuxchart.dates) {
                if (cuxchart.cuxdConfig.ALIASES[dp]) {
                    var tmp = cuxchart.dates[dp];
                    delete cuxchart.dates[dp];
                    //cuxchart.dates[cuxchart.cuxdConfig.ALIASES[dp]] = tmp;
                    cuxchart.dates[cuxchart.cuxdConfig.ALIASES[dp]] = tmp;
                }
            }

            $("#loader_output2").prepend("<span class='ajax-loader'></span> frage Datenpunkt-Infos von CCU ab");
            $.ajax({
                url:    "ajax/dpinfos.cgi",
                type:   "post",
                data:   dps.join(";"),
                success: function (data) {
                    //console.log(data);
                    for (var i = 0; i < dps.length; i++) {
                        // Kamen Infos zurück?
                        if (data[dps[i]]) {


                            cuxchart.dpInfos[dps[i]] = data[dps[i]];

                            var hsstype = dps[i].split(".");


                            cuxchart.revDpInfos[data[dps[i]].ChannelName + "." + hsstype[1]] = dps[i];
                        } else {
                            if (cuxchart.cuxdConfig.REVALIASES[dps[i]]) {
                                cuxchart.dpInfos[dps[i]] = {
                                    ChannelName: cuxchart.cuxdConfig.REVALIASES[dps[i]],
                                    ValueUnit: ''
                                }
                                cuxchart.revDpInfos[cuxchart.cuxdConfig.REVALIASES[dps[i]]] = dps[i];
                            } else {
                                cuxchart.dpInfos[dps[i]] = {
                                    ChannelName: dps[i],
                                    ValueUnit: ''
                                }
                                cuxchart.revDpInfos[dps[i]] = dps[i];

                            }

                        }


                    }
                    cuxchart.ajaxDone();
                    callback();
                },
                error: function () {

                }
            });
        },
        saveSettings: function () {
            var visible = [];
            for (var key in cuxchart.chart.series) {
                if (cuxchart.chart.series[key].visible) {
                    visible.push(cuxchart.chart.series[key].name);
                }
            }
        },
        renderChart: function () {
            cuxchart.chart = new Highcharts.StockChart(cuxchart.chartOptions);
        },
        initHighcharts: function () {

            if (cuxchart.queryParams["theme"]) {
                $.getScript('themes/' + cuxchart.queryParams.theme+".js", function () {
                    $("body").css("color", Highcharts.theme.legend.itemStyle.color);
                    if (Highcharts.theme.chart.backgroundColor && Highcharts.theme.chart.backgroundColor.stops) { $("body").css("background-color", Highcharts.theme.chart.backgroundColor.stops[0][1]); }
                    $(".loader-output").css("border-color", Highcharts.theme.legend.itemStyle.color);
                });
            }

            if (!cuxchart.queryParams["loader"] || cuxchart.queryParams["loader"] != "false") {
                $("#loader").show();
                $("#loader_small").hide();
            }

            if (cuxchart.queryParams["period"]) {
                var now = new Date().getTime();
                var dateObj = new Date(now - (parseFloat(cuxchart.queryParams["period"]) * 3600000));
                var year = dateObj.getFullYear();
                var month = (dateObj.getMonth() + 1).toString(10);
                month = (month.length == 1 ? "0" + month : month);
                var day = dateObj.getDate().toString(10);
                day = (day.length == 1 ? "0" + day : day);
                var hour = dateObj.getHours().toString(10);
                hour = (hour.length == 1 ? "0" + hour : hour);
                var minute = dateObj.getMinutes().toString(10);
                minute = (minute.length == 1 ? "0" + minute : minute);
                var second = dateObj.getSeconds().toString(10);
                second = (second.length == 1 ? "0" + second : second);
                cuxchart.start = year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second;
            }
            cuxchart.cache = storage.get(cuxchart.storageKey);

            if (cuxchart.queryParams["dp"]) {
                var tmpArr = cuxchart.queryParams["dp"].split(",");
                cuxchart.cache.visible = tmpArr;
            }

            Highcharts.setOptions({
                lang: {
                    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                    shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                    rangeSelectorFrom: 'von',
                    rangeSelectorTo: 'bis',
                    rangeSelectorZoom: 'Bereich'
                },
                global: {
                    useUTC: false
                }
            });

            var legend, navigator, credits;

            if (cuxchart.queryParams["legend"] == "false") {
                $("#title").hide();
                legend = {
                    enabled: false
                };
                credits = {
                    enabled: false
                }
            } else if (cuxchart.queryParams["legend"] == "inline") {
                $("#title").hide();
                legend = {
                    enabled: true,
                    layout: 'horizontal',
                    align: 'center',
                    floating: true,
                    verticalAlign: 'top',
                    y: 38
                };
                credits = {
                    enabled: false
                };


            } else {

                legend = {
                    enabled: true,
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    y: 38
                };
                credits = {
                    enabled: true,
                    text: "CUxD-Highcharts " + cuxchart.version + " copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker - Lizenz: CC BY-NC 3.0 DE http://creativecommons.org/licenses/by-nc/3.0/de/ - Verwendet Highstock http://www.highcharts.com und $ http://www.jquery.com",
                    href: "https://github.com/hobbyquaker/CUxD-Highcharts",
                    position: { align: "left", x: 12 }
                };
            }

            if (cuxchart.queryParams["navigator"] == "false") {
                navigator = {
                    enabled: false,
                    series: {
                        type: "line"
                    }
                };
            } else {

                navigator = {
                    enabled: true,
                    series: {
                        type: "line"
                    }
                };
            }

            cuxchart.chartOptions = {
                chart: {
                    renderTo: 'chart',
                    zoomType: 'xy',
                    events: {

                    }
                },
                title: {
                    text: null
                },
                legend: legend,
                subtitle: {
                    text: null
                },
                credits: credits,

                xAxis: {
                    ordinal: false,
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        month: '%e. %b',
                        year: '%Y'
                    }
                },
                yAxis: [{
                    title: {
                        text: ''
                    }
                }],
                navigator: navigator,
                tooltip: {
                    shared: false,
                    //valueDecimals: 3,
                    //xDateFormat: "%e. %b %Y %H:%M:%S",

                    formatter: function() {
                        var date;
                        //console.log(this);
                        if (this.series.hasGroupedData) {
                            date = "<i>Aggregiert: ";
                            if (this.series.pointRange == 0) {
                               pointRange = this.point.series.closestPointRange;
                               // console.log(Highcharts.dateFormat("%e. %b %Y %H:%M:%S", this.series.processedXData[0]));
                                date += jQuery("<div/>").html("&#x00d8; ").text();
                            } else {
                                pointRange = this.series.pointRange;
                                date += jQuery("<div/>").html("&#x0394; ").text();
                            }
                            var endDate = Highcharts.dateFormat("%H:%M", this.x + pointRange);
                            if (endDate == "00:00") { endDate = "24:00"; }
                            if (pointRange < 3600000) {
                                date += (pointRange / 60000) + " Minuten</i><br/>";

                                date += Highcharts.dateFormat("%e. %b %Y %H:%M", this.x);
                                date += "-";
                                date += endDate;

                            } else if (pointRange < 86400000) {
                                date += (pointRange / 3600000) + " Stunde"+(pointRange > 3600000 ? "n" : "")+"</i><br/>";

                                date += Highcharts.dateFormat("%e. %b %Y %H:%M", this.x);
                                date += "-";
                                date += endDate;

                            } else {
                                date += (pointRange / 86400000) + " Tag"+(pointRange > 86400000 ? "e" : "")+"</i><br/>";

                                date += Highcharts.dateFormat("%e. %b %Y", this.x);

                            }

                        } else {
                            date = Highcharts.dateFormat("%e. %b %Y %H:%M:%S", this.x);
                        }

                        //console.log(Highcharts.dateFormat("%e. %b %Y %H:%M:%S", this.series.groupedData[0].x));
                        var val = parseFloat(this.y).toFixed(this.series.options.valueDecimals);
                        var unit = this.series.options.valueSuffix;
                        if (unit == "100%") {
                            val = val * 100;
                            unit = "%";
                        }
                        return '<b>'+cuxchart.dpInfos[this.series.options.cuxchart].ChannelName + '</b><br>' + this.series.options.cuxchart + '<br>' + // return stored text
                            date + ' - <b>' + val + unit + "</b>";

                    }
                },
                series: []
            };

            if (cuxchart.queryParams["scrollbar"] == "false") {
                cuxchart.chartOptions.scrollbar = {
                    enabled : false
                };
            }
            if (cuxchart.queryParams["range"]) {
                cuxchart.chartOptions.rangeSelector = {
                    enabled: false

                };
                cuxchart.chartOptions.xAxis.range = parseFloat(cuxchart.queryParams["range"]) * 3600 * 1000;
            } else {
                cuxchart.chartOptions.rangeSelector = {
                    inputDateFormat: "%e. %b %Y",
                    buttons : [{
                        type : 'hour',
                        count : 1,
                        text : '1h'
                    }, {
                        type : 'day',
                        count : 1,
                        text : '1D'
                    }, {
                        type : 'week',
                        count : 1,
                        text : '1W'
                    }, {
                        type : 'month',
                        count : 1,
                        text : '1M'
                    }, {
                        type : 'year',
                        count : 1,
                        text : '1J'
                    }],
                    selected : 1,
                    inputEnabled : true
                };
            }
            if (cuxchart.queryParams["zoom"] == "false") {
                cuxchart.chartOptions.chart.zoomType = undefined;
            }
            //console.log(cuxchart.first);
            //console.log(cuxchart.chartOptions);
            //cuxchart.chart = new Highcharts.StockChart();
        },
        loadLog: function (log, callback, cache) {
            $("#loader_output2").prepend("<span class='ajax-loader'></span> lade "+log+" ");
            $.ajax({
                url: 'ajax/log.cgi?logfile='+log+(cache?'&cache=true':''),
                type: 'get',
                cache: (cache ? true : false),
                success: function (data) {
                    var lines = data.split("\n");
                    var triple = lines[0].split(" ");
                    var ts = triple[0];
                    var dp, val;
                    if (ts < cuxchart.first) {
                        cuxchart.first = ts;
                        if (ts < cuxchart.start) {
                            cuxchart.cuxdConfig.OLDLOGS = [];
                        }
                        $("#log_first").html(ts.replace(/T/, " "));

                    }

                    //console.log("first:" + cuxchart.first);
                    var tmpArr = {};
                    for (var i = 0; i < lines.length; i++) {
                        triple = lines[i].split(" ");
                        if (cuxchart.queryParams["dp"]) {
                            if (cuxchart.cache.visible.indexOf(triple[1]) == -1) {
                                continue;
                            }
                        }
                        if (triple.length === 3) {
                            ts = triple[0];
                            if (ts <= cuxchart.start) { continue; }
                            dp = triple[1];
                            val = triple[2];
                            if (!cuxchart.dates[dp]) {
                                cuxchart.dates[dp] = [];
                                cuxchart.countDp += 1;
                                cuxchart.countVal += 1;
                                $("#count_dp").html(cuxchart.countDp.toString(10));
                            } else {
                                cuxchart.countVal += 1;
                            }
                            if (!tmpArr[dp]) { tmpArr[dp] = []; }

                            var x = cuxchart.parseDate(ts);

                            tmpArr[dp].push([x, parseFloat(val)]);
                        }
                    }
                    $("#count_val").html(cuxchart.countVal);
                    for (var tmpDp in tmpArr) {
                        if (!cuxchart.dates[tmpDp]) { cuxchart.dates[tmpDp] = []; }
                        cuxchart.dates[tmpDp] = tmpArr[tmpDp].concat(cuxchart.dates[tmpDp]);
                    }

                    if (ts > cuxchart.last) {
                        cuxchart.last = ts;
                        $("#log_last").html(ts.replace(/T/, " "));

                    }
                    cuxchart.ajaxDone();
                    callback();
                }
            });

        },
        loadOldLogs: function (callback) {
            $("#cuxchart_skip").show();
            var log = cuxchart.cuxdConfig.OLDLOGS.pop();
            if (log) {
                cuxchart.loadLog(log, cuxchart.loadOldLogs, true);
            } else {
                // Keine weiteren Logs vorhanden.
                $("#cuxchart_skip").hide();

                cuxchart.getDpInfos(function () {
                    var tmpArr = [];
                    for (var dp in cuxchart.dates) {
                        var tmp = dp.split(".");
                        if (!tmp[1]) { tmp[1] = ""; } else { tmp[1] = "." + tmp[1]; }
                        tmpArr.push(cuxchart.dpInfos[dp].ChannelName + tmp[1]);
                    }
                    tmpArr.sort();
                    var serie;
                    for (var i = 0; i<tmpArr.length; i++) {
                        if (cuxchart.revDpInfos[tmpArr[i]]) {
                            serie = cuxchart.revDpInfos[tmpArr[i]];
                        } else {
                            serie = tmpArr[i]
                        }
                        cuxchart.addSeries(serie);
                    }



                    // Set empty Navigator (flatline)
                    cuxchart.chartOptions.navigator.series.data = [[cuxchart.parseDate(((cuxchart.start > cuxchart.first) ? cuxchart.start : cuxchart.first)),0],[cuxchart.parseDate(cuxchart.last),0]];

                    //setTimeout(function () {
                    $("#loader").hide();
                    $("#loader_small").hide();

                    cuxchart.renderChart();
                    //}, 1);

                });

            }

        },
        parseDate: function (str) {
            // Verlässt sich darauf das CUxD DEVTIMEFORMAT=%Y-%m-%dT%X gesetzt ist
            var ts = Date.parse(str+"Z") + cuxchart.tzOffset;
            return ts;
        },
        loadData: function () {
            $("#loader_output2").prepend("<span class='ajax-loader'></span> lade cuxd.ini ");
            $.ajax({
                url: 'ajax/ini.cgi',
                type: 'get',
                success: function (data) {
                    var lines = data.split("\n");
                    var logit = 0;
                    // cuxd.ini parsen
                    for (var i = 0; i < lines.length; i++) {
                        switch (lines[i].slice(0,3)) {
                            case "DEV":
                                var pair = lines[i].split("=");
                                if (pair[0] == "DEVLOGMOVEDFILE") {
                                    cuxchart.cuxdConfig.OLDLOGS.push(pair[1]);
                                    break;
                                }
                                cuxchart.cuxdConfig[pair[0]] = pair[1];
                                break;
                            case "LOG":
                                var pair = lines[i].split("=");
                                if (pair[0] == "LOGIT") {
                                    logit += 1;
                                    var values = pair[1].split(" ");
                                    if (values[2] && values[2].match(/[^!]+/)) {
                                        cuxchart.cuxdConfig.ALIASES[values[2]] = values[0]+"."+values[1];
                                        cuxchart.cuxdConfig.REVALIASES[values[0]+"."+values[1]] = values[2];
                                    }
                                }
                                break;
                            default:
                            // Nix
                        }
                        cuxchart.cuxdConfig.OLDLOGS.sort();
                    }
                    if (!cuxchart.cuxdConfig.DEVLOGFILE || cuxchart.cuxdConfig.DEVLOGFILE == "") {
                        $(".ajax-loader").removeClass("ajax-loader").addClass("ajax-fail");
                        $("#loader_output2").prepend("<br/>\n<b>Fehler: </b>CUxD DEVLOGFILE nicht konfiguriert!");
                        $.error("CUxD DEVLOGFILE nicht konfiguriert");
                    }
                    if (!cuxchart.cuxdConfig.DEVTIMEFORMAT || (cuxchart.cuxdConfig.DEVTIMEFORMAT != "%Y-%m-%dT%X" && cuxchart.cuxdConfig.DEVTIMEFORMAT != "'%Y-%m-%dT%X'" && cuxchart.cuxdConfig.DEVTIMEFORMAT != "\"%Y-%m-%dT%X\"")) {
                        $(".ajax-loader").removeClass("ajax-loader").addClass("ajax-fail");
                        $("#loader_output2").prepend("<br/>\n<b>Fehler: </b>CUxD DEVTIMEFROMAT muss auf %Y-%m-%dT%X gesetzt werden!");
                        $.error("CUxD DEVTIMEFORMAT nicht %Y-%m-%dT%X");
                    }
                    if (logit < 1) {
                        $(".ajax-loader").removeClass("ajax-loader").addClass("ajax-fail");
                        $("#loader_output2").prepend("<br/>\n<b>Fehler: </b>keine CUxD LOGIT Zeile gefunden!");
                        $.error("CUxD LOGIT fehlt");
                    }

                    cuxchart.ajaxDone();

                    // Logs laden
                    cuxchart.loadLog(cuxchart.cuxdConfig['DEVLOGFILE'], cuxchart.loadOldLogs);

                }
            });
        },
        ajaxDone: function () {
            $(".ajax-loader").removeClass("ajax-loader").addClass("ajax-check");
            $("#loader_output2").prepend("<br/>\n");

        },
        addSeries: function (dp) {

            var visible;
            if (cuxchart.cache && cuxchart.cache.visible.length > 0) {
                if ($.inArray(dp, cuxchart.cache.visible) == -1) {
                    visible = false;
                } else {
                    visible = true;
                }
            } else {
                if (cuxchart.chartOptions.series.length > 0) {
                    visible = false;
                } else {
                    visible = true;
                }
            }
            var name, valueSuffix, type, step;

            if (cuxchart.dpInfos[dp]) {
                var nameappend = dp.split(".");
                if (nameappend[1]) {
                    nameappend = " "+nameappend[1];
                } else {
                    nameappend = "";
                }
                if (cuxchart.dpInfos[dp].ValueUnit) {
                    nameappend += " ["+$("<div/>").html(cuxchart.dpInfos[dp].ValueUnit).text()+"]";
                }

                name = cuxchart.dpInfos[dp].ChannelName +nameappend;
                valueSuffix = $("<div/>").html(cuxchart.dpInfos[dp].ValueUnit).text();

            } else {
                name = cuxchart.cuxdConfig.REVALIASES[dp];
                valueSuffix = "";
                return false;
            }

            var marker = {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            };
            var step = undefined;
            var unit = "";
            var valueDecimals = 3;
            var factor = 1;
            var yAxis = 0;
            var grouping = undefined;

            var dptype = dp.split(".");
            dptype = dptype[1];

            switch (dptype) {
                case "METER":
                case "RAIN_CTR":
                    type = "column",

                        grouping = {
                            enabled: true,
                            approximation: function (data) {
                                var approx = data[data.length-1]-data[0];
                                return (approx ? approx : 0);
                            },
                            forced: false,
                            groupPixelWidth: 40,
                            units: [[
                                'minute',
                                [30]
                            ], [
                                'hour',
                                [1, 2, 6, 12]
                            ], [
                                'day',
                                [1]
                            ], [
                                'week',
                                [1]
                            ], [
                                'month',
                                [1]
                            ]]

                        }
                    valueDecimals = 3;
                    break;

                case "TEMPERATURE":
                case "HUMIDITY":
                case "HUMIDITYF":
                case "DEW_POINT":
                case "ABS_HUMIDITY":
                case "HUM_MAX_24H":
                case "HUM_MIN_24H":
                case "TEMP_MAX_24H":
                case "TEMP_MIN_24H":
                    valueDecimals = 1;
                    type = "spline";
                    break;
                case "MEAN5MINUTES":
                    valueDecimals = 3;
                    type = "spline";
                    break;
                case "BRIGHTNESS":
                    valueDecimals = 0;
                    type = "spline";
                    break;
                case "LEVEL":
                    type = "line";
                    step = "left";
                    unit = "%";
                    yAxis = 1;
                    valueDecimals = 2;
                    break;

                case "PRESS_SHORT":
                case "PRESS_LONG":
                case "PRESS_OPEN":
                case "MOTION":
                    yAxis = 1,
                        marker = {
                            enabled: true
                        };
                    factor = 5;
                    type = "scatter";
                    break;
                /*case "SETPOINT":
                    marker = {
                        enabled: true
                    };
                    valueDecimals = 1;
                    type = "line";
                    step = "left";
                    grouping = { enabled: false };

                    break;*/
                case "VALVE_STATE":
                    valueDecimals = 0;
                    type = "line";
                    step = "left";
                    grouping = { enabled: false };
                    unit = "%";
                    yAxis = 1;

                    break;
                default:
                    valueDecimals = 3;
                    type = "line";
                    step = "left";

            }

            var serie = {
                cuxchart: dp,
                name: name,
                type: type,
                step: step,
                marker: marker,
                valueDecimals: valueDecimals,
                valueSuffix: valueSuffix,
                visible: visible,
                pointWidth: 16,
                data: cuxchart.dates[dp],
                events: {
                    click: function () {

                    },
                    legendItemClick: function () {

                        setTimeout(function () {
                            // Ausgewählte Datenreihen im LocalStorage sichern
                            var tmpArr = [];
                            for (var i = 0; i < cuxchart.chart.series.length; i++) {
                                if (cuxchart.chart.series[i].visible && cuxchart.chart.series[i].name && cuxchart.chart.series[i].name != "Navigator") {
                                    tmpArr.push(cuxchart.chart.series[i].userOptions.cuxchart);
                                }
                            }
                            storage.set(cuxchart.storageKey, {visible: tmpArr});
                            cuxchart.saveSettings();
                        }, 1000);
                    }
                }

            };
            if (grouping) {
                serie.dataGrouping = grouping;
            } else {
                //
            }

            if (cuxchart.queryParams["grouping"] == "false") {
                console.log("disable grouping");
                serie.dataGrouping = {enabled:false};
            }
            if (cuxchart.queryParams["area"] == "true") {
                if (serie.type == "spline") {
                    serie.type = "areaspline";
                }
            }

            // Serienoptionen
            var tmp = dp.split(".");
            if (cuxchart.config.series[tmp[1]]) {
                serie = $.extend(true, serie, cuxchart.config.series[tmp[1]]);
            }

            if (cuxchart.config.series[dp]) {
                serie = $.extend(true, serie, cuxchart.config.series[dp]);
            }

            cuxchart.chartOptions.series.push(serie);
        },
        init: function () {
            $(".cuxchart-version").html(cuxchart.version);
            $("#cuxchart_skip").click(function () {
                cuxchart.cuxdConfig.OLDLOGS = [];
            });
            cuxchart.initHighcharts();
            cuxchart.loadData();

        }
    };

    function getUrlVars() {
        var vars = {}, hash;
        if (window.location.href.indexOf('?') == -1) { return {}; }
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            if (hash[0] && hash[0] != "") {
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    }

    $(document).ready(function () {
        cuxchart.init();
    });

})(jQuery);
