#!/usr/bin/python

from pyvirtualdisplay import Display
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys

display = Display(visible=0, size=(1280, 720))
display.start()

options = Options()

options.add_argument('--user-data-dir=/root/chromeBotTE')
mobile_emulation = {
    "deviceMetrics": { "width": 360, "height": 640, "pixelRatio": 3.0 },
    "userAgent": "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19" }
options.add_experimental_option("mobileEmulation", mobile_emulation)
driver = webdriver.Chrome(chrome_options = options)

driver.get('http://user-status.meteor.com/')
print driver.title
driver.save_screenshot('screenie.png')
# video = driver.find_element_by_class_name("_mrbc")
# video.click()
# driver.save_screenshot('screenie.png')