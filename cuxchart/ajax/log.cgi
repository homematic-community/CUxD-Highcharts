#!/bin/tclsh

# log.cgi
#
# Dieses Script gibt eine Log-Datei aus
#
# Pfad+Dateiname werden über den Parameter "logfile" übergeben
#
# 5'2013 hobbyquaker https://github.com/hobbyquaker
#


puts "Content-Type: text/plain;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
puts ""

catch {
  set input $env(QUERY_STRING)
  set pairs [split $input &]
  foreach pair $pairs {
    if {0 != [regexp "^(\[^=]*)=(.*)$" $pair dummy varname val]} {
      set $varname $val
    }
  }
}

if {[info exists logfile]} {
    set fp [open $logfile r]
    set log_data [read $fp]
    close $fp
    puts -nonewline $log_data
}