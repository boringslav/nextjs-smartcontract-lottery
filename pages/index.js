import Head from "next/head"
import Image from "next/image"
import ManualHeader from "../components/ManualHeader"
export default function Home() {
    return (
        <div>
            <Head>
                <title>Smart Contract Lottery</title>
                <meta name="description" content="Decentralized Lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ManualHeader />
        </div>
    )
}
