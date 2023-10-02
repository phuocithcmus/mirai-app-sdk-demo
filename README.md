## Mirai App SDK Demo

Three layer:
- Miraicore: Manage several connections. Init after run app
- MiraiConnect: 1 connection - 1 miraiid account (access_token). Init after user click New connection
- MiraiProvider: Using for request some method. Example: eth_requestAccounts, eth_getBalance,...  
  
Step 
- Open [Mirai App Web](https://mirai-app-sdk-demo.vercel.app/) 
- Click **Login** to use miraiid
- After **Login**, wait for geting new miraiid user and click **New Connection** then **Connect**
- Click **Show QrCode** to choose wallet (on mobile) or scan QRCode to get mirai provider
- After connected, Click **Request** button to use **Mirai Sign Provider** 