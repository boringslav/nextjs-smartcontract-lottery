import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"

const ManualHeader = () => {
    const { enableWeb3, deactivateWeb3, account, isWeb3Enabled, Moralis } = useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }

        console.log("Is web3 enabled: ", isWeb3Enabled)
    }, [isWeb3Enabled, enableWeb3])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log("Account changed to: ", account)
            if (account === null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Disconnected..")
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>Connected to {account}</div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.setItem("connected", "injected ")
                        }
                    }}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader
