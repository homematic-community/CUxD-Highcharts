#!/bin/tclsh

# log.cgi
#
# Dieses Script gibt die CUxD DEVLOGS aus
#
# 5'2013 hobbyquaker https://github.com/hobbyquaker
#

load tclrega.so

puts "Content-Type: text/plain;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
puts ""

set fp [open "/usr/local/addons/cuxd/cuxd.ini" r]
while {[gets $fp line] >= 0} {
    if {[string match "DEVLOG*" $line]} {
        if {[string match "DEVLOGFILE=*" $line]} {
            set cuxlog [string range $line 11 end]
        }
        puts $line
    }
    if {[string match "LOGIT*" $line]} {
        regexp {LOGIT=([^ ]+) ([^ ]+) (.*)} $line matched sub1 sub2 sub3
        set unit ""
        if {[string match "TEMPERATURE" $sub2]} {
            set unit "°C"
        }
        if {[string match "HUMIDITY" $sub2]} {
            set unit "%"
        }

        set script "var dp = '${sub1}.${sub2}';"
        append script {
            object o = dom.GetObject('BidCos-RF.' # dp);
            if (o) {
                Write(dom.GetObject(o.Channel()).Name());
            } else {
                o = dom.GetObject('BidCos-Wir.' # dp);
                if (o) {
                    Write(dom.GetObject(o.Channel()).Name());
                } else {
                    o = dom.GetObject('CUxD.' # dp);
                  if (o) {
                    Write(dom.GetObject(o.Channel()).Name());
                  }
                }
            }
        }
        set res [lindex [rega_script $script] 1]
        puts "$line $unit $res"
    }
}
close $fp
set fp [open $cuxlog r]
set log_data [read $fp]
close $fp
puts ""
puts $log_data