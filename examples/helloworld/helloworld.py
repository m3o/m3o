import requests
import json
import os

url = 'https://api.m3o.com/v1/helloworld/Call'
req = {'name': 'Alice'}
hdr = {'Authorization': 'Bearer ' +  os.environ['M3O_API_TOKEN']}

res = requests.post(url, data = json.dumps(req), headers = hdr)

print(res.content)
