import { randomBytes } from 'crypto'
import ObjectsToCsv from 'objects-to-csv'
import { BitcoinAddress, EthereumAddress, HDKey, Mnemonic } from 'wallet.ts'

import { BeautifulWallet, beautifulWallets } from './beautifulWallet'

const main = async () => {
    for (let i = 0; ; i++) {
        // Generate seed
        const mnemonic = Mnemonic.generate(randomBytes(32))
        const seed = mnemonic.toSeed()
        // Build keys
        const masterKey = HDKey.parseMasterSeed(seed)
        const extendedPrivateKey = masterKey.derive("m/44'/60'/0'/0").extendedPrivateKey || ""
        const childKey = HDKey.parseExtendedKey(extendedPrivateKey)
        // Get wallet
        const wallet = childKey.derive("0")
        // Addresses
        const ethAddress = EthereumAddress.from(wallet.publicKey).address
        const btcAddress = BitcoinAddress.from(wallet.publicKey).address

        var beautiful: BeautifulWallet | undefined
        if (beautiful = beautifulWallets.find(w => w.active && w.addressPattern.exec(ethAddress))) {
            const csv = new ObjectsToCsv([{
                mnemonicPhrase: mnemonic.phrase,
                privateKey: wallet.privateKey?.toString("hex"),
                bitcoinAddress: btcAddress,
                ethereumAddress: EthereumAddress.checksumAddress(ethAddress),
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