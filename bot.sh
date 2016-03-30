#!/bin/bash
if [ `ps -e | grep -c bot.sh` -gt 2 ]; then echo "Already running, i'm killing old process!"; pkill -9 -o chrome; killall -9 chrome; pkill -9 -o chromium; killall -9 chromium; pkill -9 -o chromium-browser; killall -9 chromium-browser; killall -9 Xvfb; pkill -9 -o bot.sh; fi
usage() { echo -e "Usage: $0 -t <Timer to restart chrome (seconds)>] -o \"account,password\" -l <Separate traffic exchange links with space delimiter(in quote)>\nExample: $0 -t 3600 -l http://22hit...\nExample: $0 -t 3600 -l \"http://22hit... http://247webhit... http://...\"\nExample: $0 -t 3600 -o \"otohit_account,otohits_password\" -l \"http://22hit...\"\nExample: $0 -t 3600 -o \"otohit_account,otohits_password\"" 1>&2; exit 1; }
[ $# -eq 0 ] && usage
otolink=""
google=false
while getopts ":ht:l:o:g-:" arg; do
    case $arg in
        t)
            timer=${OPTARG}
            ;;
        l)
            links=${OPTARG}
            ;;
        o)
            IFS=', ' read -r -a otohits <<< ${OPTARG}
            otolink="http://www.otohits.net/account/wfautosurf"
            ;;
        g)
            google=true
            ;;
        h | *)
            usage
            exit 1
            ;;
    esac
done
if [ -z "${timer}" ]; then
    usage
fi
echo "Checking update Chrome/Chromium and related package..."
echo "Killing old chrome/chromium and virtual X display..."
killall apt-get
killall dpkg
apt-get update
apt-get clean
apt-get autoclean
apt-get autoremove -y
apt-get install -y psmisc lsb-release
pkill -9 -o chrome
killall -9 chrome
pkill -9 -o chromium
killall -9 chromium
pkill -9 -o chromium-browser
killall -9 chromium-browser
killall -9 Xvfb
killall -9 sleep
sync && sysctl -w vm.drop_caches=3
apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable xfonts-cyrillic x11-apps
apt-get install -y gtk2-engines-pixbuf libexif12 libxpm4 libxrender1 libgtk2.0-0
apt-get install -y libnss3 libgconf-2-4
apt-get install -y libxss1 libappindicator1 libindicator7
if $google
then
    ARCH=$(uname -m | sed 's/x86_//;s/i[3-6]86/32/')
    wget http://duclvz.github.io/google-chrome-$ARCH.deb -O google-chrome-$ARCH.deb
    dpkg -i google-chrome-*.deb
    browser="google-chrome"
else
    if [[ `lsb_release -si` == "Debian" ]]
    then
        apt-get install -y chromium
        browser="chromium"
    fi
    if [[ `lsb_release -si` == "Ubuntu" ]]
    then
        apt-get install -y chromium-browser
        browser="chromium-browser"
    fi
fi
if [ -z "${browser}" ]; then
    echo "Sorry, this script does not support your OS, please use Ubuntu/Debian Linux OS!"
    exit 1
fi
#apt-get install -y pepperflashplugin-nonfree
#update-pepperflashplugin-nonfree --install
dpkg --configure -a
apt-get install -f -y
if [[ `lsb_release -rs` == "12.04" ]]
then
    apt-get install -y defoma x-ttcidfont-conf
    (cd /var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType && mkfontdir > fonts.dir)
fi
desktopAgents=("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36 Edge/12.0" "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240" "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:25.0) Gecko/20100101 Firefox/43.0" "Mozilla/5.0 (Windows NT 5.1; rv:31.0) Gecko/20100101 Firefox/44.0" "Mozilla/5.0 (Windows NT 6.3; rv:36.0) Gecko/20100101 Firefox/45.0" "Mozilla/5.0 (Windows NT 6.2; WOW64; rv:39.0) Gecko/20100101 Firefox/44.0" "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:40.0) Gecko/20100101 Firefox/40.0" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/22.0.1207.1 Safari/537.1" "Mozilla/5.0 (Windows NT 6.2; rv:20.0) Gecko/20121202 Firefox/44.0" "Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00" "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10" "Mozilla/5.0 (Windows NT 6.2; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36" "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.67 Safari/537.36" "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36" "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36" "Mozilla/5.0 (Windows NT 6.1; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36 OPR/31.0.1889.174" "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.19.4 (KHTML, like Gecko) Version/5.0.2 Safari/533.18.5" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:40.0) Gecko/20100101 Firefox/45.0" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36 OPR/29.0.1795.41" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_2; en-us) AppleWebKit/531.21.8 (KHTML, like Gecko) Version/4.0.4 Safari/531.21.10" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_5; de-de) AppleWebKit/534.15  (KHTML, like Gecko) Version/5.0.3 Safari/533.19.4" "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-us) AppleWebKit/533.20.25 (KHTML, like Gecko) Version/5.0.4 Safari/533.20.27" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.13+ (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/536.26.17 (KHTML like Gecko) Version/6.0.2 Safari/536.26.17" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.78.1 (KHTML like Gecko) Version/7.0.6 Safari/537.78.1" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11) AppleWebKit/601.1.56 (KHTML, like Gecko) Version/9.0 Safari/601.1.56" "Mozilla/5.0 (X11; Linux i686 (x86_64)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36" "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/33.0.1750.152 Chrome/49.0.2623.87 Safari/537.36" "Mozilla/5.0 (X11; Linux i686; rv:43.0) Gecko/20100101 Firefox/45.0")
RANDOM=$$$(date +%s)
while :
do
    echo "Downloading chrome user data dir profile..."
    wget --no-check-certificate http://duclvz.github.io/chromeTE.tar.gz -O /root/chromeTE.tar.gz
    echo "Recreating/extracting chrome user data dir..."
    rm -fr /root/chromeTE/
    tar -xzf /root/chromeTE.tar.gz -C /root/
    echo "Starting virtual X display..."
    Xvfb :2 -screen 1 1024x768x16 -nolisten tcp & disown
    echo "Starting chrome TE viewer..."
    echo "Open link $links"
    if [ ! -z "${otohits}" ]
    then
        sed -i "s/otoacc/${otohits[0]}/g" /root/chromeTE/Default/Extensions/jikpgdfgobpifoiiojdngpekpacflahh/1.0_0/account.json
        sed -i "s/otopass/${otohits[1]}/g" /root/chromeTE/Default/Extensions/jikpgdfgobpifoiiojdngpekpacflahh/1.0_0/account.json
    fi
    DISPLAY=:2.1 ${browser} --no-sandbox --user-data-dir="/root/chromeTE" --user-agent=\"${desktopAgents[$RANDOM % ${#desktopAgents[@]}]}\" --disable-popup-blocking --incognito ${otolink} ${links} & disown
    browserPID=$!
    sleep ${timer}
    timeplus=$(shuf -i 10-100 -n 1)
    sleep ${timeplus}
    echo "Kill browser PID $browserPID"
    kill $browserPID
    echo "Killing virtual X display..."
    killall -9 Xvfb
    echo "Restart TE bots after $((${timer}+${timeplus})) seconds."
done