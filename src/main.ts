import { randomBytes } from 'crypto'
import ObjectsToCsv from 'objects-to-csv'
import { BitcoinAddress, EthereumAddress, HDKey, Mnemonic } from 'wallet.ts'

import { BeautifulWallet, beautifulWallets } from './beautifulWallet'

const main = async () => {
    for (let i = 0; ; i++) {
        // Generate seed
        const mnemonic = Mnemonic.generate(randomBytes(32))
        const phrase = mnemonic.phrase
        const seed = mnemonic.toSeed()
        // Build keys
        const masterKey = HDKey.parseMasterSeed(seed)
        const extendedPrivateKey = masterKey.derive("m/44'/60'/0'/0").extendedPrivateKey || ""
        const childKey = HDKey.parseExtendedKey(extendedPrivateKey)
        // Get wallet
        const wallet = childKey.derive("0")
        const walletPublicKey = wallet.publicKey
        const ethAddress = EthereumAddress.from(walletPublicKey).address
        const btcAddress = BitcoinAddress.from(walletPublicKey).address

        var beautiful: BeautifulWallet | undefined
        if (beautiful = beautifulWallets.find(w => w.active && w.addressPattern.exec(ethAddress))) {
            const csv = new ObjectsToCsv([{
                phrase,
                privateKey: wallet.privateKey?.toString("hex"),
                btcAddress: btcAddress,
                ethAddress: EthereumAddress.checksumAddress(ethAddress),
                description: beautiful.description,
            }])
            await csv.toDisk("./wallets.csv", { append: true })
        }
        console.log(`${i}:\t${ethAddress}`)
    }
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})