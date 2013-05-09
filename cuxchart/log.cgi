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
}
close $fp
set fp [open $cuxlog r]
set log_data [read $fp]
close $fp
puts ""
puts $log_data