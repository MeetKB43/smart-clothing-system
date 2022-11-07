import requests

url = 'http://localhost:8000/cloth_scanned'
myobj = {'RFID': 1, "uDeviceId" : 0}
x = requests.post(url, json = myobj)
uDeviceId = 1
lstNotRegistered = [
'060090840715',
'840034BD3E33',
'6A003E3A2C42',
'840034D5DDB8',
'6A003E6F556E',
'840034CD324F',
'6A003E61AC99',
'6A003E247E0E',
'6A003E77BD9E',
'840034D6CEA8'
]
lstRegistered = []
lstNotAdded = []
lstAdded = []
bContinue = True
#print the response text (the content of the requested file):
while (bContinue):
    print("lstNotRegistered : ",lstNotRegistered)
    print("lstRegistered : ",lstRegistered)
    print("lstNotAdded : ",lstNotAdded)
    print("lstAdded : ",lstAdded)
    print(" ")
    print("***********")
    print("Select Option:\n")
    print("1. Register Cloth")
    print("2. Put Cloth")
    print("3. Take Cloth")
    choice = input()
    if(choice == '1'):
        #Send Fresh RFID to server for registration
        tag = lstNotRegistered.pop(0)
        lstRegistered.append(tag)
        lstNotAdded.append(tag)
        myobj = {'RFID': tag, "uDeviceId" : uDeviceId}
        x = requests.post(url, json = myobj)
    elif(choice == '2'):
        #choice 2
        tag = lstNotAdded.pop(0)
        lstAdded.append(tag)
        myobj = {'RFID': tag, "uDeviceId" : uDeviceId}
        x = requests.post(url, json = myobj)

    elif(choice == '3'):
        #choice 3
        tag = lstAdded.pop(0)
        lstNotAdded.append(tag)
        myobj = {'RFID': tag, "uDeviceId" : uDeviceId}
        x = requests.post(url, json = myobj)