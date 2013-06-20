#!/bin/sh

rm -r tmp
mkdir -p tmp/cuxchart

cp dev/cuxd-highcharts tmp/
cp dev/update_script tmp/
cp -a cuxchart/* tmp/cuxchart

awk '/cuxchart.js/{gsub(/cuxchart.js/, "cuxchart.min.js")};{print}' cuxchart/index.html > tmp/cuxchart/index.html
awk '/cuxchart.js/{gsub(/cuxchart.js/, "cuxchart.min.js")};{print}' cuxchart/menu.html > tmp/cuxchart/menu.html
java -jar dev/yuicompressor-2.4.7.jar --charset ISO-8859-1 cuxchart/js/cuxchart.js >> tmp/cuxchart/js/cuxchart.min.js

cd tmp
rm cuxchart/js/cuxchart.js

tar -czvf ../cuxchart.tar.gz *
