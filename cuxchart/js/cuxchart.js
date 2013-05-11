/**
 *      CUxD-Highcharts 1.2dev
 *
 *      visualisiert CUxD Geräte-Logs mittels Highcharts
 *
 *      Copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker
 *
 *      Diese Software ist freie Software. Sie können sie unter den Bedingungen der GNU General Public License, wie von
 *      der Free Software Foundation veröffentlicht, weitergeben und/oder modifizieren, gemäß Version 3 der Lizenz. Die
 *      Veröffentlichung dieser Software erfolgt in der Hoffnung, daß sie Ihnen von Nutzen sein wird, aber
 *      OHNE IRGENDEINE GARANTIE, sogar ohne die implizite Garantie der MARKTREIFE oder der VERWENDBARKEIT FÜR EINEN
 *      BESTIMMTEN ZWECK. Details finden Sie in der GNU General Public License.
 *
 *      Die Nutzung dieser Software erfolgt auf eigenes Risiko. Der Author dieser Software kann für eventuell
 *      auftretende Folgeschäden nicht haftbar gemacht werden!
 *
 */

(function($) { $(document).ready(function () {

    $(".version").html(cuxchart.version);

    cuxchart.initHighcharts();

    cuxchart.loadData();

    $("#skip").click(function () {
        cuxchart.cuxdConfig.OLDLOGS = [];
    });

});})(jQuery);


var cuxchart = {
    version: "1.2dev",
    chart: undefined,
    chartOptions: {},
    storageKey: "cuxchart",
    first: "2200-00-00T00:00:00",
    last: "0000-00-00T00:00:00",
    countDp: 0,
    countVal: 0,
    cuxdConfig: {
        ALIASES: {},
        OLDLOGS: []
    },
    dates: {},
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
        console.log("!!!");
        console.log(cuxchart.chartOptions);
        cuxchart.chart = new Highcharts.StockChart(cuxchart.chartOptions);
    },
    initHighcharts: function () {

        Highcharts.setOptions({
            lang: {
                months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
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
                y: 50
            },
            subtitle: {
                text: null
            },
            credits: {
                enabled: false
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
            rangeSelector : {
                buttons : [{
                    type : 'hour',
                    count : 1,
                    text : '1h'
                }, {
                    type : 'day',
                    count : 1,
                    text : '1D'
                }, {
                    type : 'all',
                    count : 1,
                    text : 'Alles'
                }],
                selected : 1,
                inputEnabled : true
            },
            tooltip: {
                shared: false
            },
            series: []
        };
        console.log(cuxchart.chartOptions);
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
                        cuxchart.chartOptions.xAxis["min"] = ts;

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
            for (var dp in cuxchart.dates) {
                cuxchart.addSeries(dp);
            }
            $("#continue").show().click(function () {
                $("#loader").hide();
                cuxchart.renderChart();
            });

            //cuxchart.renderChart();
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
                                cuxchart.cuxdConfig.ALIASES[values[2]] = values[0];
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
        var charttype = "",
            unit = "",
            marker = {},
            factor = undefined,
            charttype = "line",
            step = "left",
            marker = {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            };

        var serie = {
            name: dp,
            type: charttype,
            step: step,
            marker: marker,
            unit: unit,
            visible: true,
            data: cuxchart.dates[dp],
            events: {
                click: function () {

                },
                legendItemClick: function () {
                    setTimeout(function () {
                        cuxchart.saveSettings();
                    }, 250);
                }
            }

        };
        cuxchart.chartOptions.series.push(serie);
        //cuxchart.chart.addSeries(serie);
    }
};
