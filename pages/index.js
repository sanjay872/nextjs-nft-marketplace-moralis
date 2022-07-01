import { useMoralisQuery, useMoralis } from "react-moralis"
import NftCard from "../components/NftCard"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()
    const { data: listedNfts, isFetching: fetchingListedNfts } = useMoralisQuery(
        //table name
        "ActiveItem",
        //function for the query
        (query) => query.limit(10).descending("tokenId")
    )
    console.log(listedNfts)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    fetchingListedNfts ? (
                        <div>Loading..............</div>
                    ) : (
                        listedNfts.map((nft) => {
                            return <NftCard {...nft.attributes}></NftCard>
                        })
                    )
                ) : (
                    <div>Web3 not currently enabled!</div>
                )}
            </div>
        </div>
    )
}
