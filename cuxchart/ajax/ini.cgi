#!/bin/tclsh

# ini.cgi
#
# Dieses Script liest notwendige Informationen aus der cuxd.ini aus und gibt eine Liste aller Logfiles zurück
#
# 5'2013 hobbyquaker https://github.com/hobbyquaker
#

proc list_files {{pat *} {dir .}} {
    set l {}
    foreach f [glob -nocomplain $dir $pat] {
            if {[string match $pat $f]} {
                lappend l $f
            }
    }
    return $l
}

puts "Content-Type: text/plain;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
puts ""

# Config ausgeben
set fp [open "/usr/local/addons/cuxd/cuxd.ini" r]
while {[gets $fp line] >= 0} {
    if {[string match "DEVLOG*" $line]} {
        if {[string match "DEVLOGFILE=*" $line]} {
            set cuxfile [string range $line 11 end]
        }
        if {[string match "DEVLOGMOVE=*" $line]} {
            set cuxmove [string range $line 11 end]
            if {[string index $cuxmove end] != "/"} {
                append cuxmove "/"
            }
        }
        puts $line
    }
    if {[string match "LOGIT*" $line]} {
        puts $line
    }

}
close $fp

# verschobene Logs auflisten
set cuxfilename  [file tail $cuxfile]
set dir [list_files "${cuxmove}${cuxfilename}.????????-????" ${cuxmove}]
foreach logfile $dir {
    puts "DEVLOGMOVEDFILE=[lindex $logfile 0]"
}
