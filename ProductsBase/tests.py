from django.test import TestCase
import requests
import string, random


request = requests.get("http://127.0.0.1:8000/GetProducts/all/")
print(request.json()['products'])