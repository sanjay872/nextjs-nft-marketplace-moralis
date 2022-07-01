import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftAbi from "../constants/BasicNft.json"
import Image from "next/image"
import { useNotification, Card } from "web3uikit"
import { ethers } from "ethers"
import UpdateListingModal from "./UpdateListingModal"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"

const truncateStr = (fullStr, strLen) => {
    if (fullStr.length <= strLen) return fullStr

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

export default function NftCard({ price, nftAddress, tokenId, marketplaceAddress, seller }) {
    const { isWeb3Enabled, account } = useMoralis()
    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const hideModal = () => setShowModal(false)
    const dispatch = useNotification()

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })

    const { runContractFunction: buyItem } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    const handleBuyItemSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!",
            title: "Item Bought",
            position: "topR",
        })
    }

    async function updateUI() {
        //get the tokenURI
        //using the image tag from the tokenURI, get the image
        console.log(price, nftAddress, tokenId, tokenDescription, nftAbi)
        const tokenURI = await getTokenURI()
        console.log(`The token ID : ${tokenURI}`)
        if (tokenURI) {
            //IPFS Gateway: A server that will return IPFS files from a normal url
            //we use this because not all browser supports IPFS
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/") //normal ipfs to http url
            const tokenURIResponse = await await (await fetch(requestURL)).json() //getting the response json
            const imageURI = tokenURIResponse.image //getting the imageURI from the json
            const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/") //converting imageURI to usable imageURL
            setImageURI(imageURIURL) //state change
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) updateUI()
    }, [isWeb3Enabled])

    const isOwnedByUser = seller == account || seller == undefined
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller || "", 15)
    const handleCardClick = () => {
        //if the card is owned by user call update or call buy Item
        isOwnedByUser
            ? setShowModal(true)
            : buyItem({
                  onError: (error) => console.log(error),
                  onSuccess: handleBuyItemSuccess,
              })
    }
    return (
        <div>
            <div>
                {imageURI ? (
                    <div className="m-2">
                        <UpdateListingModal
                            isVisible={showModal}
                            marketplaceAddress={marketplaceAddress}
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            onClose={hideModal}
                        />
                        <Card
                            title={tokenName}
                            description={tokenDescription}
                            onClick={handleCardClick}
                        >
                            <div className="p-2">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic test-sm">
                                        Owned by {formattedSellerAddress}
                                    </div>
                                    <Image
                                        loader={() => imageURI}
                                        src={imageURI}
                                        height="200"
                                        width="200"
                                    ></Image>
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div>Loading......</div>
                )}
            </div>
        </div>
    )
}
