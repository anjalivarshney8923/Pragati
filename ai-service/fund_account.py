import requests

address = "XFH3YTGVZ3HET7Z3Z2K5JB2GCXCA63J2EWRBGOR2N3XPAX3B56ATB2BCNM"

url = f"https://bank.testnet.algorand.network/v1/faucet?address={address}"

response = requests.get(url)

print(response.json())