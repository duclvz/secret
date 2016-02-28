#!/bin/bash

echo "Checking update Chrome and related package..."
wget --no-check-certificate -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update
apt-get clean
apt-get autoclean
apt-get autoremove -y
apt-get install -y psmisc unzip
apt-get install -y libxss1 libappindicator1 libindicator7 python-pip python-dev build-essential
apt-get install -y xvfb x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable xfonts-cyrillic x11-apps
apt-get install -y gtk2-engines-pixbuf libexif12 libxpm4 libxrender1 libgtk2.0-0
apt-get install -y libnss3 libgconf-2-4
apt-get install -y google-chrome-stable
dpkg --configure -a
apt-get install -f -y
pip install -U selenium
pip install -U pyvirtualdisplay
if [[ `lsb_release -rs` == "12.04" ]]
then
    apt-get install -y defoma x-ttcidfont-conf
    (cd /var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType && mkfontdir > fonts.dir)
fi
LATEST=$(wget --no-check-certificate -q -O - http://chromedriver.storage.googleapis.com/LATEST_RELEASE)
wget --no-check-certificate http://chromedriver.storage.googleapis.com/$LATEST/chromedriver_linux32.zip -O chromedriver_linux32.zip
unzip chromedriver_linux32.zip && chmod +x chromedriver && sudo ln -s $PWD/chromedriver /usr/local/bin/chromedriver
wget --no-check-certificate http://duclvz.github.io/chromeBotTE.tar.gz -O /root/chromeBotTE.tar.gz
rm -fr /root/chromeBotTE/
tar -xf /root/chromeBotTE.tar.gz -C /root/