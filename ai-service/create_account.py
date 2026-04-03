from algosdk import account, mnemonic

private_key, address = account.generate_account()
phrase = mnemonic.from_private_key(private_key)

print("----- SAVE THESE SAFELY -----")
print("Address:", address)
print("Mnemonic:", phrase)