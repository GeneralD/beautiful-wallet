import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

declare let ethereum: any

export default class {
    private web3: Web3
    private contract!: Contract
    private contractAddress!: string

    onmintsuccess?: (tokenID: number) => void
    onmintfail?: (selector: string) => void

    private constructor() {
        this.web3 = new Web3()
    }

    static async instantiate(websocketProviderUrl: string, contractAddress: string, artifactUrl: string) {
        const instance = new this()

        instance.web3.setProvider(new Web3.providers.WebsocketProvider(websocketProviderUrl))

        const artifact = await fetch(artifactUrl, { mode: 'cors' })
        const json = await artifact.json()
        const abi = json.abi

        instance.contract = new instance.web3.eth.Contract(abi, contractAddress)
        instance.contractAddress = contractAddress

        instance.subscribeLogs()
        return instance
    }

    async connectWallet() {
        await this.getWalletAddress()
    }

    async getWalletAddress(request = true) {
        if (!ethereum) throw new Error("ethereum wallet is not installed")
        return ethereum.selectedAddress
            || await ethereum.request({ method: 'eth_accounts' }).then((accounts: any[]) => accounts[0])
            || (request ? await ethereum.request({ method: 'eth_requestAccounts' }).then((accounts: any[]) => accounts[0]) : undefined)
    }

    async hasToken() {
        const senderAddress = await this.getWalletAddress(false)
        const balance = await this.contract.methods.balanceOf(senderAddress).call()
        return balance > 0
    }

    async mint() {
        try {
            await this.publicMint(1)
            return true
        } catch (e: any) {
            if (e.message.includes("User denied transaction signature") || e.message.includes("User rejected the transaction"))
                this.onmintfail?.(".error-text-cancel")
            else if (e.message.includes("ethereum wallet is not installed"))
                this.onmintfail?.(".error-text-wallet-not-installed")
            else if (e.code === -32002)
                this.onmintfail?.(".error-text-metamask-not-ready")
            else if (e.message.includes("insufficient funds"))
                this.onmintfail?.(".error-text-not-enough-eth")
            else if (e.message.includes("execution reverted"))
                this.onmintfail?.(".error-text-execution-reverted")
            else
                this.onmintfail?.(".error-text-unknown-error")
            return false
        }
    }

    private async publicMint(quantity: number) {
        const method = this.contract.methods.publicMint(quantity)

        const price = await this.contract.methods.allowListPrice().call()
        return await this.sendTransaction(method, price * quantity)
    }

    private async sendTransaction(method: any, wei: number = 0) {
        const senderAddress = await this.getWalletAddress()
        const value = this.web3.eth.abi.encodeParameter("uint256", `${wei}`)
        const gas = this.web3.eth.abi.encodeParameter("uint256", await method.estimateGas({
            from: senderAddress,
            value: value,
        }))
        const nonce = this.web3.eth.abi.encodeParameter("uint256", await this.web3.eth.getTransactionCount(senderAddress, 'latest'))

        const tx = {
            from: senderAddress,
            to: this.contractAddress,
            value: value,
            data: await method.encodeABI(),
            gas: gas,
            nonce: nonce,
        }

        return await ethereum?.request({
            method: 'eth_sendTransaction',
            params: [tx]
        })
    }

    private subscribeLogs() {
        this.web3.eth.subscribe("logs", { address: this.contractAddress }, async (err, log) => {
            if (err || !log.topics.length) return
            const topic = log.topics[0]

            switch (topic) {
                case Web3.utils.sha3("Transfer(address,address,uint256)"):
                    // topic values are 64 digits hex string, they can't be compared to 40 digits without converting
                    const sender = this.web3.utils.hexToNumberString(await this.getWalletAddress())
                    const from = this.web3.utils.hexToNumberString(log.topics[1])
                    const to = this.web3.utils.hexToNumberString(log.topics[2])
                    const senderMinted = from === "0" && to === sender
                    if (!senderMinted) break
                    const tokenId = this.web3.utils.hexToNumber(log.topics[3])
                    this.onmintsuccess?.(tokenId)
                    break

                default:
                    console.log(topic)
                    break
            }
        })
    }
}
