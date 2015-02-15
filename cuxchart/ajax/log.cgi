#!/bin/tclsh

# log.cgi
#
# Dieses Script gibt eine Log-Datei aus
#
# Pfad+Dateiname werden über den Parameter "logfile" übergeben
#
# 5'2013 hobbyquaker https://github.com/hobbyquaker
# 2'2015 Uwe Langhammer ulangham@gmx.de
#

set logfilter "/usr/local/addons/cuxd/extra/logfilter"

catch {
  set input $env(QUERY_STRING)
  set pairs [split $input &]
  foreach pair $pairs {
    if {0 != [regexp "^(\[^=]*)=(.*)$" $pair dummy varname val]} {
      set $varname $val
    }
  }
}

puts "Content-Type: text/plain;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
if {[info exists cache]} {
  puts "Cache-Control: public, max-age=31536000"
} else {
  puts "Cache-Control: no-cache, max-age=0"
}
puts ""

if {[info exists logfile]} {
  if {[file isfile $logfilter]} {
    puts -nonewline [exec $logfilter $logfile]
  } else {
    set fp [open $logfile r]
    puts -nonewline [read $fp]
    close $fp
  }
}
