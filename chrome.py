#!/usr/bin/python

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time
import random
display = Display(visible=0, size=(1280, 720))
display.start()

options = Options()
options.add_argument('--user-data-dir=/root/chromeBotTE')
# options.add_argument('--user-agent="Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"')
mobile_emulation = {
    "deviceMetrics": { "width": 720, "height": 1280, "pixelRatio": 1.0 },
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B411 Safari/600.1.4" }
options.add_experimental_option("mobileEmulation", mobile_emulation)
youtube = webdriver.Chrome(chrome_options = options)
youtube.get('https://www.youtube.com/watch?v=uYRuxz_UIOI&list=PLNFHZ147pUItjKgODlwExeXrfRkHsk4uH')

def playVideo():
    try:
        youtube.find_element_by_css_selector('div[aria-label="Play"]').click()
        print('Started Video - div[aria-label="Play"]')
    except:
        try:
            youtube.find_element_by_css_selector('a[title="Play video"]').click()
            print('Started Video - a[title="Play video"]')
        except:
            print("Error when click Video")

def nextVideo():
    try:
        youtube.find_element_by_css_selector('.ytp-next-button.ytp-button').click()
        print('Nexted Video')
    except:
        try:
            youtube.find_element_by_css_selector('a[title="Next video"]').click()
            print('Nexted Video')
        except:
            print('Error when click Next Video')
def percent():
    if random.uniform(0,100)>20:
        return random.uniform(65,85)/100
    else:
        return random.uniform(20,100)/100
# Fetch playlist length
try:
    listlen = int(youtube.find_element_by_css_selector('div._mpr').text.split(' / ')[1])
except:
    try:
        listlen = int(youtube.find_element_by_css_selector('span#playlist-length').text.split(' ')[0])
    except:
        print('Error when fetch playlist length')
# Loop
for x in xrange(0, listlen):
    print('--------------')
    playVideo()
    time.sleep(3)
    print('Viewing video '+youtube.title)
    print(youtube.current_url)
    try:
        rdper=percent();
        print('Wait view video with rate: '+str(rdper))
        time.sleep(float(youtube.find_element_by_tag_name('video').get_attribute('duration'))*rdper)
        youtube.save_screenshot('screenie.png')
        nextVideo()
    except:
        print('Error when viewing video with rate')
youtube.quit()
display.stop()
print('Stopped Chrome Selenium and Xvfb')