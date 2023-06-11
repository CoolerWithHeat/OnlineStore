from django.test import TestCase
import requests
import string, random

link = 'http://127.0.0.1:8000/GetIcon/mail_icon/'
token_notStaff = 'b297b6ba0ba1e1ff5e30edee66b15173bc634300'
token_Staff = 'c63f10ebea99abd3e42eafdeda7f3540c5e941a3'
headers = {'Authorization': f'Token {token_notStaff}'}
response = requests.get(link, headers=headers)
print(response.json())
# for each in response.json()['response']:
#     print('each')