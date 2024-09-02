# Selenium Python Login Autotest Using ID

This is a sample automation test script for testing Login with verification.

## Import

This section imports the necessary modules for Selenium WebDriver and other utilities.

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
import time
```

## Main Code

This section contains the main automation script for logging into the SauceDemo website and verifying the login.

```python
options = webdriver.ChromeOptions()
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)
driver = webdriver.Chrome(options=chrome_options)
driver.maximize_window()
driver.get("https://www.saucedemo.com/v1/")

username = driver.find_element(By.ID, "user-name")
username.send_keys("standard_user")

pw = driver.find_element(By.ID, "password")
pw.send_keys("secret_sauce")

login = driver.find_element(By.ID, "login-button")
login.click()

time.sleep(1)

try:
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Products')]")
    )
except:
    print("Login valid - failed")
    driver.quit()
else:
    print("Login valid - success")
    driver.quit()
```

This script performs the following steps:
1. Sets up Chrome WebDriver with options
2. Navigates to the SauceDemo website
3. Enters username and password
4. Clicks the login button
5. Waits for the 'Products' text to appear, indicating successful login
6. Prints the login result and quits the driver
