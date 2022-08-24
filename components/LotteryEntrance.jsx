import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //gives the hex version of the id -> moralis gets it from the connected wallet
    const dispatch = useNotification()
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState(null)

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

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const updateUi = () => {
        if (isWeb3Enabled) {
            //the semi is from the prettier no-semi rule
            ;(async () => {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()
                const recentWinnerFromCall = (await getRecentWinner()).toString()

                setEntranceFee(entranceFeeFromCall)
                setNumberOfPlayers(numberOfPlayersFromCall)
                setRecentWinner(recentWinnerFromCall)
            })()
        }
    }

    useEffect(() => {
        updateUi()
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <>
            {raffleAddress ? (
                <>
                    <button
                        onClick={async () =>
                            await enterRaffle({
                                onSuccess: handleSuccess, //checks if the transaction is sent to MetaMask
                                onError: (error) => console.error(error),
                            })
                        }
                    >
                        Enter Raffle
                    </button>
                    <p>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</p>
                    <p>Number of players: {numberOfPlayers}</p>
                    <p>Recent Winner: {recentWinner}</p>
                </>
            ) : (
                <p>No Raffle Address Detected</p>
            )}
        </>
    )
}

export default LotteryEntrance
