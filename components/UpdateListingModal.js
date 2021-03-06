import { ethers } from "ethers"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { Modal, Input, useNotification } from "web3uikit"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"

export default function UpdateListingModal({
    nftAddress,
    marketplaceAddress,
    tokenId,
    isVisible,
    onClose,
}) {
    const dispatch = useNotification()
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = async (tx) => {
        //tx is the return data of contract request
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing Updated!",
            title: "Listing updated - please refresh ",
            position: "topR",
        })
    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}
