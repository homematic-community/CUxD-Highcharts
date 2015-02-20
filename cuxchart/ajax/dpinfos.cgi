#!/bin/tclsh

# meta.cgi
#
# 5'2013 hobbyquaker https://github.com/hobbyquaker
# 2'2015 Uwe Langhammer ulangham@gmx.de
#

load tclrega.so

puts "Content-Type: text/json;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
puts ""

set postdata [string trim [read stdin]]

set dps [split $postdata ";"]
set counter 0
foreach dp $dps {
    if { $counter == 0 } {
      set hm_script "object o;\nobject ch;\n"
    }
    incr counter
    if { [string equal -length 3 $dp "CUX"] } {
        append hm_script "o = dom.GetObject('CUxD.$dp');\n"
    } else {
        append hm_script "o = dom.GetObject('BidCos-RF.$dp');\nif (!o) \{\n"
        append hm_script "o = dom.GetObject('BidCos-Wired.$dp');\n\}\n"
    }  
    append hm_script "if (o) \{\n"
    append hm_script "Write('\"$dp\":\{');\n"
    append hm_script "Write('\"ValueUnit\":\"' # o.ValueUnit() # '\"');\n"
#    append hm_script "Write('\"ValueType\":\"' # o.ValueType() # '\",');\n"
#    append hm_script "Write('\"ValueSubType\":\"' # o.ValueSubType() # '\",');\n"
#    append hm_script "Write('\"ValueMin\":\"' # o.ValueMin() # '\",');\n"
#    append hm_script "Write('\"ValueMax\":\"' # o.ValueMax() # '\"');\n"
    append hm_script "ch = dom.GetObject(o.Channel());\nif (ch) \{\n"
    append hm_script "Write(',\"ChannelName\":\"' # ch.Name() # '\"');\n"
#    append hm_script "Write('\"ChannelHssType\":\"' # ch.HssType() # '\"');\n"
    append hm_script "\}\nWriteLine('\},');\n"
    append hm_script "\}\n"
    if { $counter == 50 } {
#puts "query $counter"
#puts $hm_script
        append ret [lindex [rega_script $hm_script] 1]
        set counter 0
    }
}
if { $counter > 0 } {
#puts "last query $counter"
#puts $hm_script
    append ret [lindex [rega_script $hm_script] 1]
}
set retlen [string length $ret]
set retmin [expr { $retlen - 3 }]
puts -nonewline "{"
puts -nonewline [string replace $ret $retmin $retlen]
puts "}"
