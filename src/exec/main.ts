import ObjectsToCsv from 'objects-to-csv'

import CryptoWallet from '../CryptoWallet'
import BeautifulWallet from '../BeautifulWallet'
import { beautifulWallets } from './beautifulWallet'

const main = async () => {
    for (let i = 0; ; i++) {
        const wallet = new CryptoWallet()

        var beautiful: BeautifulWallet | undefined
        if (beautiful = beautifulWallets.find(w => w.isAppropriate(wallet.ethereumAddress))) {
            const csv = new ObjectsToCsv([{
                mnemonicPhrase: wallet.mnemonicPhrase,
                privateKey: wallet.privateKey,
                bitcoinAddress: wallet.bitcoinAddress,
                ethereumAddress: wallet.ethereumAddress,
                description: beautiful.description,
            }])
            await csv.toDisk("./wallets.csv", { append: true })
        }
        console.log(`${i}:\t${wallet.ethereumAddress}`)
    }
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})