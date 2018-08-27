#!/bin/bash
pgrep reall.sh | grep -v "$$" | xargs kill -9
pkill -9 -f ffmpeg
curl -s https://duclvz.github.io/OpenSans-Bold.ttf -o OpenSans-Bold.ttf
while :
do
url1=$(curl -s --header "User-Agent: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36" http://www.livenewson.com/american/$1.html | grep -oP "(?<=\").*m3u8.*(?=\")")
url2=$(curl -s --header "User-Agent: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36" http://usnewslive.tv/$1/ | grep -oP "(?<=').*m3u8.*(?=')")
ffmpeg -headers "User-Agent: Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"$'\r\n'"Accept: */*"$'\r\n'"Accept-Encoding: gzip, deflate, br"$'\r\n'"Accept-Language: en-US"$'\r\n' -re -async 1 -xerror -i "$url1$url2" -t 600 -vf scale=-1:720,drawtext="fontfile=OpenSans-Bold.ttf:textfile=FT.txt:fontcolor=#ffff7f:fontsize=20:borderw=3:bordercolor=black:x=10:y=3:reload=1" -c:v libx264 -b:v 3000k -preset ultrafast -g 60 -c:a aac -f flv rtmp://a.rtmp.youtube.com/live2/$2 > reall.log 2>&1 < /dev/null
done