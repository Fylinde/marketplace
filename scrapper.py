from selenium import webdriver
from selenium.webdriver.common.by import By
import os

# Set up the Selenium WebDriver
driver = webdriver.Chrome()  # Make sure you have the correct WebDriver

# Open the target URL
driver.get("https://amazon.com/registration")  # Replace with your target URL

# Wait for the page to load (you can adjust this as per your needs)
driver.implicitly_wait(10)

# Extract the registration form
registration_form = driver.find_element(By.ID, 'registration-form')  # Adjust the selector to match the form's ID or class

# Create the folder to save the extracted files
save_folder = "extracted_files"
if not os.path.exists(save_folder):
    os.makedirs(save_folder)

# Define the path to save the form
save_path = os.path.join(save_folder, "registration_form.html")

# Save the extracted form to the folder
with open(save_path, "w", encoding="utf-8") as file:
    file.write(registration_form.get_attribute('outerHTML'))

print(f"Registration form saved to {save_path}")

# Close the browser when done
driver.quit()
