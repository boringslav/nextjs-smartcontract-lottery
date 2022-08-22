import React from "react"
import { useMoralis } from "react-moralis"

const ManualHeader = () => {
    const { enableWeb3, account } = useMoralis()

    return (
        <div>
            {account ? (
                <div>Connected to {account}</div>
            ) : (
                <button onClick={async () => await enableWeb3()}>Connect</button>
            )}
        </div>
    )
}

export default ManualHeader
