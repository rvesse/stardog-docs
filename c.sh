#!/bin/sh

cd sass 
compass compile
cp css/gumby.css files/css/
echo "Copied gumby.css to src/files/css"
