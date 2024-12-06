#!/bin/sh

root_dir=$(pwd)

cd $root_dir/dataset_tools/geonames
python ./create_geonames_subsets.py

cp $root_dir/dataset_tools/geonames/geonames_subsets.ttl $root_dir/staging

cd $root_dir/dataset_tools/wikidata
python ./create_wikidata_subsets.py

cp $root_dir/dataset_tools/wikidata/wikidata_subsets.ttl $root_dir/staging
