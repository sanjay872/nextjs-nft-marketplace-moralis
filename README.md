This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Note
1. Home Page: (/)
    - Show recently listed NFTs
        - If you own the NFT, u can update the list
        - if not, you can by the NFT
2. Sell Page: (/sell-nft)
    - You can list your NFTs on the marketplace

## How to make moralis listen to our contract events
1. connect it to our blockchain
2. which contract, event and what to do if event triggered.
3. install frp for moralis to connect with our localhost blockchain.
4. download the frpc zip for windows.
5. add frpc.exe and frcp.ini to the frp folder of our project.
6. edit frcp.ini with hardhat config
7. run frpc.exe -c frpc.ini and before that ensure localhost blockchain node is running.
8. we access or run this using moralis cli.
9. run yarn global add moralis-admin-cli for getting cli.
10. add new command in script, "moralis:sync":"moralis-admin-cli connect-local-devchain --chain hardhat --moralisSubdomain server-url --frpcPath ./frp/frpc"
11. for this we need CLI API Key,CLI API Secret. so add them in .env file.
12. to create a sync service and it will update the DB by listening to the event trigger.
13. create addEvents.js file for the service.
14. a script for updating the data depend on the deployment of contract so create update-front-end deploy script in contract.
15. contract address will be updated in the networkMapping.json file with in constants.
16. abi will be updated in nftMarketplace.json
17. basicNft.json will have its abi.
18. for deploying the event watch run node addEvents.js.
19. u can test it by running the scripts in nftMarketplace contract.
20. check the database for the moralis app. 
If the node is stop and restarted, make the localchain reset in the moralis app, otherwise the event won't be tracks as we are using new blockchain node.
21. what to do if cancel item happen, so we need to remove that nft from the table and for that we need to use cloud function, it will executed only of certain condtions.
22. we can do it manaually in the moralis site or we can do it by program.
    1. First install the moralis admin cli package globally
        npm install -g moralis-admin-cli

    2. Execute the watch-cloud-file and change to the correct path of your cloud file
    moralis-admin-cli watch-cloud-folder
    --moralisApiKey apikey
    --moralisApiSecret apiSecret
    --moralisSubdomain (subdomain in server url)
    --autoSave 1
    --moralisCloudfolder /path/to/cloud/folder

23. now we can have script in cloud folder that will run as cloud functions.
24. updateActiveItems.js is for creating a new table which will have all the active items in it and if a item is brought or canceled it will be removed from the active table.
