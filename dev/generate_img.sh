#!/bin/sh

rm -r tmp
mkdir -p tmp/cuxchart/ajax
mkdir -p tmp/cuxchart/css
mkdir -p tmp/cuxchart/img
mkdir -p tmp/cuxchart/js

cp dev/cuxd-highcharts tmp/
cp -a cuxchart/* tmp/cuxchart
cp -a cuxchart/ajax/* tmp/cuxchart/ajax
cp -a cuxchart/css/* tmp/cuxchart/css
cp -a cuxchart/img/* tmp/cuxchart/img
cp -a cuxchart/js/* tmp/cuxchart/js

cd tmp

tar -czvf ../cuxchart.tar.gz *
