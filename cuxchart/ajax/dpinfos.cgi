#!/bin/tclsh

# meta.cgi
#
# 5'2013 hobbyquaker https://github.com/hobbyquaker
#

load tclrega.so

puts "Content-Type: text/json;Charset=ISO-8859-1"
puts "Access-Control-Allow-Origin: *"
puts ""

set postdata [string trim [read stdin]]

set dps [split $postdata ";"]
set hm_script "var first = true;\nobject o;\nobject ch;\nWrite('{');\n"
set first true
foreach dp $dps {
    append hm_script "o = dom.GetObject('BidCos-RF.$dp');\nif (!o) \{\n"
    append hm_script "o = dom.GetObject('CUxD.$dp');\n if (!o) \{\n"
    append hm_script "o = dom.GetObject('BidCos-Wired.$dp');\n\}\n\}\nif (o) \{\n"
    append hm_script "if (first) \{\nfirst = false;\n\} else \{\nWriteLine(',');\n\}\n"
    append hm_script "Write('\"$dp\":\{');\n"
    append hm_script "Write('\"ValueUnit\":\"' # o.ValueUnit() # '\",');\n"
    append hm_script "Write('\"ValueType\":\"' # o.ValueType() # '\",');\n"
    append hm_script "Write('\"ValueSubType\":\"' # o.ValueSubType() # '\",');\n"
    append hm_script "Write('\"ValueMin\":\"' # o.ValueMin() # '\",');\n"
    append hm_script "Write('\"ValueMax\":\"' # o.ValueMax() # '\"');\n"
    append hm_script "ch = dom.GetObject(o.Channel());\nif (ch) \{\n"
    append hm_script "Write(',\"ChannelName\":\"' # ch.Name() # '\",');\n"
    append hm_script "Write('\"ChannelHssType\":\"' # ch.HssType() # '\"');\n\}\n"
    append hm_script "Write('\}');\n"
    append hm_script "\}\n"


}
append hm_script "WriteLine('\}');\n"
#puts $hm_script
puts [lindex [rega_script $hm_script] 1]
