#!/usr/bin/python

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time
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
time.sleep(3)
youtube.execute_script('if (document.getElementsByClassName("_mrbc _mjib").length>0) { document.getElementsByClassName("_mrbc _mjib")[0].click() } else if(document.getElementsByClassName("_mno").length>0) { document.getElementsByClassName("_mno")[0].click() }')
print youtube.title
# video = driver.find_element_by_class_name("_mrbc")
# video.click()
# driver.save_screenshot('screenie.png')
try:
    if youtube.find_element_by_tag_name('video').get_attribute('paused')=='true':
        youtube.find_element_by_css_selector('._mrbc._mjib').click()
        youtube.find_element_by_css_selector('._mno').click()
    else:
        print "Da chay Video"
except:
    print "Da chay Video"
Số video playlist
._mzr 1 / 4
playlist-length 329 videos

try:
    youtube.find_element_by_css_selector('.ytp-next-button.ytp-button').click()
    youtube.find_element_by_css_selector('._maw._mch').click()
except:
    print "Da next Video"
        
