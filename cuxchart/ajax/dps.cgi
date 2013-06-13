#!/bin/tclsh

# dps.cgi
#
# Dieses Script durchsucht alle Logfiles nach vorhandenen Datenpunkten und fragt Infos dazu von der CCU ab
#
# Laufzeit bei vielen Logs viel zu lang, muss anders gelöst werden
#
# 6'2013 hobbyquaker https://github.com/hobbyquaker
#

load tclrega.so

proc list_files {{pat *} {dir .}} {
    set l {}
    foreach f [glob -nocomplain $dir $pat] {
            if {[string match $pat $f]} {
                lappend l $f
            }
    }
    return $l
}

puts "Content-Type: text/json;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
puts ""

# Config ausgeben
set fp [open "/usr/local/addons/cuxd/cuxd.ini" r]
while {[gets $fp line] >= 0} {
    if {[string match "DEV*" $line]} {
        if {[string match "DEVLOGFILE=*" $line]} {
            set cuxfile [string range $line 11 end]
        }
        if {[string match "DEVLOGMOVE=*" $line]} {
            set cuxmove [string range $line 11 end]
            if {[string index $cuxmove end] != "/"} {
                append cuxmove "/"
            }
        }
        #puts $line
    }
    if {[string match "LOGIT*" $line]} {
        #puts $line
    }

}
close $fp

set dps ""

# verschobene Logs auflisten
set cuxfilename  [file tail $cuxfile]
set dir [list_files "${cuxmove}${cuxfilename}.????????-????" ${cuxmove}]
foreach logfile $dir {
   # puts "[lindex $logfile 0]"

    set fp [open $logfile r]
    set file_data [read $fp]
    close $fp

    #  Process data file
    set data [split $file_data "\n"]
    foreach line $data {
        set name [lindex $line 1]
        if {$line != "" && [lsearch $dps $name] == -1} {
          lappend dps $name
         # puts $name
        }
    }


}



set hm_script "var first = true;\nobject o;\nobject ch;\nWrite('{');\n"
set first true
foreach dp $dps {
    append hm_script "o = dom.GetObject('BidCos-RF.$dp');\nif (!o) \{\n"
    append hm_script "o = dom.GetObject('CUxD.$dp');\n if (!o) \{\n"
    append hm_script "o = dom.GetObject('BidCos-Wired.$dp');\n\}\n\}\nif (o) \{\n"
    append hm_script "if (first) \{\nfirst = false;\n\} else \{\nWriteLine(',');\n\}\n"
    append hm_script "Write('\"$dp\":\{');\n"
    append hm_script "Write('\"ValueUnit\":\"' # o.ValueUnit() # '\"');\n"
#    append hm_script "Write('\"ValueType\":\"' # o.ValueType() # '\",');\n"
#    append hm_script "Write('\"ValueSubType\":\"' # o.ValueSubType() # '\",');\n"
#    append hm_script "Write('\"ValueMin\":\"' # o.ValueMin() # '\",');\n"
#    append hm_script "Write('\"ValueMax\":\"' # o.ValueMax() # '\"');\n"
    append hm_script "ch = dom.GetObject(o.Channel());\nif (ch) \{\n"
    append hm_script "Write(',\"ChannelName\":\"' # ch.Name() # '\"');\n"
#    append hm_script "Write('\"ChannelHssType\":\"' # ch.HssType() # '\"');\n"
    append hm_script "\}\nWrite('\}');\n"
    append hm_script "\}\n"


}
append hm_script "WriteLine('\}');\n"
#puts $hm_script
puts [lindex [rega_script $hm_script] 1]
