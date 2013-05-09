#!/bin/sh
rm -r tmp
mkdir -p tmp/cuxchart

cp dev/cuxd-highcharts tmp/
cp -a cuxchart/* tmp/cuxchart
cd tmp
tar -czvf ../cuxchart.tar.gz *
