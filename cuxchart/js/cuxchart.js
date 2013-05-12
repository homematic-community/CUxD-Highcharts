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
 *          Namensnennung ? Sie müssen den Namen des Autors/Rechteinhabers in der von ihm festgelegten Weise nennen.
 *          Keine kommerzielle Nutzung ? Dieses Werk bzw. dieser Inhalt darf nicht für kommerzielle Zwecke verwendet
 *          werden.
 *      Wobei gilt:
 *          Verzichtserklärung ? Jede der vorgenannten Bedingungen kann aufgehoben werden, sofern Sie die ausdrückliche
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

var cuxchart = {
    version: "1.2.1",
    chart: undefined,
    chartOptions: {},
    storageKey: "cuxchart",
    cache: {},
    first: "2200-00-00T00:00:00",
    last: "0000-00-00T00:00:00",
    countDp: 0,
    countVal: 0,
    dpInfos: {},
    cuxdConfig: {
        ALIASES: {},
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

        jQuery("#loader_output").append("<span class='ajax-loader'></span> frage Datenpunkt-Infos von CCU ab");
        $.ajax({
            url:    "ajax/dpinfos.cgi",
            type:   "post",
            data:   dps.join(";"),
            success: function (data) {
                //console.log(data);
                cuxchart.dpInfos = data;
                cuxchart.ajaxDone();
                callback();
            },
            error: function () {

            }
        });
    },
    saveSettings: function () {
        //console.log("saveSettings()");
        var visible = [];
        for (var key in cuxchart.chart.series) {
            if (cuxchart.chart.series[key].visible) {
                visible.push(cuxchart.chart.series[key].name);
            }
        }
        //console.log(visible);
    },
    renderChart: function () {
        //console.log("!!!");
        //console.log(cuxchart.chartOptions);
        cuxchart.chart = new Highcharts.StockChart(cuxchart.chartOptions);
    },
    initHighcharts: function () {
        cuxchart.cache = storage.get(cuxchart.storageKey);
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
                useUTC: true
            }
        });
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
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                y: 38
            },
            subtitle: {
                text: null
            },
            credits: {
                enabled: true,
                text: "CUxD-Highcharts copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker - Lizenz: CC BY-NC 3.0 DE http://creativecommons.org/licenses/by-nc/3.0/de/ - Verwendet Highstock http://www.highcharts.com und jQuery http://www.jquery.com",
                href: "https://github.com/hobbyquaker/CUxD-Highcharts",
                position: { align: "left", x: 12 }
            },

            xAxis: {
                ordinal: false,
                type: 'datetime',
                dateTimeLabelFormats: {
                    month: '%e. %b',
                    year: '%Y'
                }
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            navigator: {
                enabled: true,
                series: {
                    type: "line"
                }
            },
            rangeSelector : {
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
            },
            tooltip: {
                shared: false,
                xDateFormat: "%e. %B %Y %H:%M:%S"
            },
            series: []
        };
        //console.log(cuxchart.first);
        //console.log(cuxchart.chartOptions);
        //cuxchart.chart = new Highcharts.StockChart();
    },
    loadLog: function (log, callback) {
        jQuery("#loader_output").append("<span class='ajax-loader'></span> lade "+log+" ");
        jQuery.ajax({
            url: 'ajax/log.cgi?logfile='+log,
            type: 'get',
            success: function (data) {
                var lines = data.split("\n");
                var triple = lines[0].split(" ");
                var ts = triple[0];
                var dp, val;
                if (ts < cuxchart.first) {
                        cuxchart.first = ts;
                        jQuery("#log_first").html(ts.replace(/T/, " "));

                }

                //console.log("first:" + cuxchart.first);
                var tmpArr = {};
                for (var i = 0; i < lines.length; i++) {
                    triple = lines[i].split(" ");
                    if (triple.length === 3) {
                        ts = triple[0];
                        dp = triple[1];
                        val = triple[2];
                        if (!cuxchart.dates[dp]) {
                            cuxchart.dates[dp] = [];
                            cuxchart.countDp += 1;
                            cuxchart.countVal += 1;
                            $("#count_dp").html(cuxchart.countDp);
                        } else {
                            cuxchart.countVal += 1;
                        }
                        if (!tmpArr[dp]) { tmpArr[dp] = []; }
                        var x = parseInt(Date.parse(ts), 10);
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
                    jQuery("#log_last").html(ts.replace(/T/, " "));

                }
                cuxchart.ajaxDone();
                callback();
            }
        });

    },
    loadOldLogs: function (callback) {
        jQuery("#skip").show();
        var log = cuxchart.cuxdConfig.OLDLOGS.pop();
        if (log) {
            cuxchart.loadLog(log, cuxchart.loadOldLogs);
        } else {
            // Keine weiteren Logs vorhanden.
            jQuery("#skip").hide();

            cuxchart.getDpInfos(function () {
                for (var dp in cuxchart.dates) {
                    cuxchart.addSeries(dp);
                }
                cuxchart.chartOptions.navigator.series.data = [[parseInt(Date.parse(cuxchart.first), 10),0],[parseInt(Date.parse(cuxchart.last), 10),0]];

                $("#continue").show().click(function () {
                    $("#loader").hide();
                    cuxchart.renderChart();
                });


                //setTimeout(function () {
                    $("#loader").hide();
                    cuxchart.renderChart();
                //}, 1);


            });


        }

    },
    loadData: function (callback) {
        jQuery("#loader_output").append("<span class='ajax-loader'></span> lade cuxd.ini ");
        jQuery.ajax({
            url: 'ajax/ini.cgi',
            type: 'get',
            success: function (data) {
                var lines = data.split("\n");

                for (var i = 0; i < lines.length; i++) {
                    switch (lines[i].slice(0,6)) {
                        case "DEVLOG":
                            var pair = lines[i].split("=");
                            if (pair[0] == "DEVLOGMOVEDFILE") {
                                cuxchart.cuxdConfig.OLDLOGS.push(pair[1]);
                                break;
                            }
                            cuxchart.cuxdConfig[pair[0]] = pair[1];
                            break;
                        case "LOGIT=":
                            var pair = lines[i].split("=");
                            var values = pair[1].split(" ");
                            if (values[2] && values[2].match(/[^!]+/)) {
                                cuxchart.cuxdConfig.ALIASES[values[2]] = values[0]+"."+values[1];
                            }
                            break;
                        default:
                        /*    if (jQuery.trim(lines[i]) != "") {
                                var triple = lines[i].split(" ");
                                var data_dp = triple[1].slice(0, triple[1].length);
                                if (!cuxchart.dates[data_dp]) {
                                    cuxchart.dates[data_dp] = [];
                                }
                                var ts = parseInt(Date.parse(triple[0]), 10);
                                cuxchart.dates[data_dp].push([ts, parseFloat(triple[2])]);
                            }
                            */
                    }
                    cuxchart.cuxdConfig.OLDLOGS.sort();
                }
                if (!cuxchart.cuxdConfig.DEVLOGFILE || cuxchart.cuxdConfig.DEVLOGFILE == "") {
                    jQuery(".ajax-loader").removeClass("ajax-loader").addClass("ajax-fail");
                    jQuery("#loader_output").append("<br/>\n<b>Fehler: </b>CUxD DEVLOGFILE nicht konfiguriert!");
                    $.error("CUxD DEVLOGFILE nicht konfiguriert!");
                }
                //console.log(cuxchart.cuxdConfig);
                cuxchart.ajaxDone();
                cuxchart.loadLog(cuxchart.cuxdConfig['DEVLOGFILE'], cuxchart.loadOldLogs);


                            //if (callback) { callback(); }
            }
        });
    },
    ajaxDone: function () {
        jQuery(".ajax-loader").removeClass("ajax-loader").addClass("ajax-check");
        jQuery("#loader_output").append("<br/>\n");

    },
    addSeries: function (dp) {
        var visible;
        if (cuxchart.cache && cuxchart.cache.visible.length > 0) {
            if (jQuery.inArray(dp, cuxchart.cache.visible) == -1) {
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
        console.log(dp + " " + visible);
        if (!cuxchart.dpInfos[dp]) {
            console.log("error loading dp "+dp);
        }
        var nameappend = dp.split(".");
        nameappend = " "+nameappend[1];
        if (cuxchart.dpInfos[dp].ValueUnit) {
            nameappend += " ["+jQuery("<div/>").html(cuxchart.dpInfos[dp].ValueUnit).text()+"]";
        }

        var type, step;

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
        var factor = 1;
        var yAxis = 0;

        var dptype = dp.split(".");
        dptype = dptype[1];
        console.log(dptype);

        switch (dptype) {
            case "TEMPERATURE":
            case "HUMIDITY":
            case "MEAN5MINUTES":
            case "BRIGHTNESS":
                type = "spline";
            break;
            case "LEVEL":
                type = "line";
                step = "left";
                unit = "%";
                yAxis = 1;
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
            case "SETPOINT":
                type = "line";
                step = "left";
                marker = {
                    enabled: true
                };
                break;
            default:
                type = "line";
                step = "left";

        }


        var serie = {
            cuxchart: dp,
            name: cuxchart.dpInfos[dp].ChannelName +nameappend,
            type: type,
            step: step,
            marker: marker,
            unit: jQuery("<div/>").html(cuxchart.dpInfos[dp].ValueUnit).text(),
            visible: visible,
            data: cuxchart.dates[dp],
            events: {
                click: function () {

                },
                legendItemClick: function () {

                    setTimeout(function () {
                        console.log(cuxchart.chart.series);
                        var tmpArr = [];
                        for (var i = 0; i < cuxchart.chart.series.length; i++) {
                            if (cuxchart.chart.series[i].visible) {
                                console.log(cuxchart.chart.series[i]);
                                tmpArr.push(cuxchart.chart.series[i].userOptions.cuxchart);
                            }
                        }
                        storage.set(cuxchart.storageKey, {visible: tmpArr});
                        cuxchart.saveSettings();
                    }, 1000);
                }
            }

        };
        cuxchart.chartOptions.series.push(serie);
        //cuxchart.chart.addSeries(serie);
    }
};

(function($) { $(document).ready(function () {

    $(".version").html(cuxchart.version);

    cuxchart.initHighcharts();

    cuxchart.loadData();

    $("#skip").click(function () {
        cuxchart.cuxdConfig.OLDLOGS = [];
    });

});})(jQuery);