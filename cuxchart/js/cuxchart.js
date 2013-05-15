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

var cuxchart = {
    version: "1.3beta2",
    chart: undefined,
    chartOptions: {},
    queryParams: getUrlVars(),
    storageKey: "cuxchart",
    cache: {
        visible: []
    },
    first: "2200-00-00T00:00:00",
    last: "0000-00-00T00:00:00",
    start: "0000-00-00T00:00:00",
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

        jQuery("#loader_output").append("<span class='ajax-loader'></span> frage Datenpunkt-Infos von CCU ab");
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
                //console.log("*** dpInfos ***");
                //console.log(cuxchart.dpInfos);
                //cuxchart.dpInfos = data;
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

        if (cuxchart.queryParams["theme"]) {
            jQuery.getScript('themes/' + cuxchart.queryParams.theme+".js", function () {
                jQuery("body").css("color", Highcharts.theme.legend.itemStyle.color);
                if (Highcharts.theme.chart.backgroundColor && Highcharts.theme.chart.backgroundColor.stops) { jQuery("body").css("background-color", Highcharts.theme.chart.backgroundColor.stops[0][1]); }
                jQuery(".loader-output").css("border-color", Highcharts.theme.legend.itemStyle.color);

            });


        }



        if (!cuxchart.queryParams["loader"] || cuxchart.queryParams["loader"] != "false") {
                jQuery("#loader").show();

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

        //console.log(cuxchart.queryParams);
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

        var legend, navigator, credits;

        if (cuxchart.queryParams["legend"] == "false") {
                jQuery("#title").hide();
                legend = {
                    enabled: false
                };
                credits = {
                    enabled: false
                }
        } else if (cuxchart.queryParams["legend"] == "inline") {
            jQuery("#title").hide();
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
                    text: "CUxD-Highcharts " + cuxchart.version + " copyright (c) 2013 hobbyquaker https://github.com/hobbyquaker - Lizenz: CC BY-NC 3.0 DE http://creativecommons.org/licenses/by-nc/3.0/de/ - Verwendet Highstock http://www.highcharts.com und jQuery http://www.jquery.com",
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
            yAxis: {
                title: {
                    text: ''
                }
            },
            navigator: navigator,
            tooltip: {
                shared: false,
                xDateFormat: "%e. %B %Y %H:%M:%S"
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
        jQuery("#loader_output").append("<span class='ajax-loader'></span> lade "+log+" ");
        jQuery.ajax({
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
                        jQuery("#log_first").html(ts.replace(/T/, " "));

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
            cuxchart.loadLog(log, cuxchart.loadOldLogs, true);
        } else {
            // Keine weiteren Logs vorhanden.
            jQuery("#skip").hide();

            cuxchart.getDpInfos(function () {
                //console.log("--- cuxchart.dates ---");
                //console.log(cuxchart.dates);
                //console.log("--- cuxchart.dpInfos ---");
                //console.log(cuxchart.dpInfos);
                var tmpArr = [];
                for (var dp in cuxchart.dates) {
                    var tmp = dp.split(".");
                    tmpArr.push(cuxchart.dpInfos[dp].ChannelName + "." + tmp[1]);
                   // cuxchart.addSeries(dp);
                }
                tmpArr.sort();
                //console.log(tmpArr);
                //console.log(cuxchart.revDpInfos);
                 for (var i = 0; i<tmpArr.length; i++) {

                    cuxchart.addSeries(cuxchart.revDpInfos[tmpArr[i]]);
                }
                cuxchart.chartOptions.navigator.series.data = [[parseInt(Date.parse(((cuxchart.start > cuxchart.first) ? cuxchart.start : cuxchart.first)), 10),0],[parseInt(Date.parse(cuxchart.last), 10),0]];

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
                                cuxchart.cuxdConfig.REVALIASES[values[0]+"."+values[1]] = values[2];
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
        //console.log("addSeries("+dp+") ");
        //console.log(cuxchart.dpInfos[dp].ChannelName);
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
        //console.log(dp + " " + visible);

        var name, valueunit, type, step;


        if (cuxchart.dpInfos[dp]) {
            var nameappend = dp.split(".");
            nameappend = " "+nameappend[1];
            if (cuxchart.dpInfos[dp].ValueUnit) {
                nameappend += " ["+jQuery("<div/>").html(cuxchart.dpInfos[dp].ValueUnit).text()+"]";
            }

            name = cuxchart.dpInfos[dp].ChannelName +nameappend;
            valueunit = cuxchart.dpInfos[dp].ValueUnit;

        } else {
            name = cuxchart.cuxdConfig.REVALIASES[dp];
            valueunit = "";
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
        var factor = 1;
        var yAxis = 0;
        var grouping = undefined;


        var dptype = dp.split(".");
        dptype = dptype[1];
        //console.log(dptype);

        switch (dptype) {
            case "METER":
            case "RAIN_CTR":
                type = "column",

                grouping = {
                    approximation: function (data) {
                        var approx = data[data.length-1]-data[0]
                        return (approx ? approx : 0);
                    },
                    enabled: true,
                    forced: true,
                    units: [[
                        'hour',
                        [1,2,3,4,5,6,12]
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
            name: name,
            type: type,
            step: step,
            marker: marker,
            unit: jQuery("<div/>").html(valueunit).text(),
            visible: visible,
            pointWidth: 16,
            dataGrouping: grouping,
            data: cuxchart.dates[dp],
            events: {
                click: function () {

                },
                legendItemClick: function () {

                    setTimeout(function () {
                        //console.log(cuxchart.chart.series);

                        var tmpArr = [];
                        for (var i = 0; i < cuxchart.chart.series.length; i++) {
                            if (cuxchart.chart.series[i].visible && cuxchart.chart.series[i].name && cuxchart.chart.series[i].name != "Navigator") {
                                //console.log(cuxchart.chart.series[i]);

                                tmpArr.push(cuxchart.chart.series[i].userOptions.cuxchart);
                            }
                        }
                        //console.log(tmpArr);
                        //console.log(cuxchart.chart.getSelectedSeries());
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

(function($) { $(document).ready(function () {

    $(".version").html(cuxchart.version);

    cuxchart.initHighcharts();

    cuxchart.loadData();

    $("#skip").click(function () {
        cuxchart.cuxdConfig.OLDLOGS = [];
    });

});})(jQuery);