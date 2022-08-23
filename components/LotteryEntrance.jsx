import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //gives the hex version of the id -> moralis gets it from the connected wallet
    const [entranceFee, setEntranceFee] = useState(0)
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    useEffect(() => {
        if (isWeb3Enabled) {
            //the semi is from the prettier no-semi rule
            ;(async () => {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
            })()
        }
    }, [isWeb3Enabled])

    return (
        <>
            {raffleAddress ? (
                <>
                    <button onClick={async () => await enterRaffle()}>Enter Raffle</button>
                    <p>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</p>
                </>
            ) : (
                <p>No Raffle Address Detected</p>
            )}
        </>
    )
}

export default LotteryEntrance
