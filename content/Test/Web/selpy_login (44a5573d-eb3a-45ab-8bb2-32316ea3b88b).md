# Selenium Python Login autotest using ID #

This is a sample automation test script for testing Login with verification. The script uses Selenium WebDriver with Python to automate the login process on a demo website and verify the successful login.

## Import #

This section imports the necessary modules for the automation script. The special characters in the description are maintained for demonstration purposes.

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

## Main Code #

This section contains the main automation script that performs the login test.

```python
# Set up Chrome options
options = webdriver.ChromeOptions()
chrome_options = Options()
chrome_options.add_experimental_option("detach", True)

# Initialize the Chrome driver
driver = webdriver.Chrome(options=chrome_options)
driver.maximize_window()

# Navigate to the login page
driver.get("https://www.saucedemo.com/v1/")

# Find and fill in the username field
username = driver.find_element(By.ID, "user-name")
username.send_keys("standard_user")

# Find and fill in the password field
pw = driver.find_element(By.ID, "password")
pw.send_keys("secret_sauce")

# Find and click the login button
login = driver.find_element(By.ID, "login-button")
login.click()

# Wait for a short time to allow the page to load
time.sleep(1)

try:
    # Wait for the 'Products' text to appear, indicating successful login
    element = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Products')]"))
    )
    print("Login valid - success")
except:
    print("Login valid - failed")
finally:
    # Close the browser
    driver.quit()
```

This script does the following:

1. Sets up Chrome options for the WebDriver.
2. Initializes the Chrome driver and maximizes the window.
3. Navigates to the SauceDemo login page.
4. Finds and fills in the username and password fields.
5. Clicks the login button.
6. Waits for the 'Products' text to appear, indicating a successful login.
7. Prints a success or failure message based on the login result.
8. Closes the browser.
