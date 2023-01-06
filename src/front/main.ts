import $ from 'jquery'
import {
    animationFrameScheduler, asyncScheduler, defer, map, observeOn, of, repeat, share, subscribeOn
} from 'rxjs'

import BeautifulWallet from '../BeautifulWallet'
import CryptoWallet from '../CryptoWallet'
import compactMap from './compactMap'

const genWallet = defer(() => of(new CryptoWallet()))
const walletStream = genWallet.pipe(
    repeat({ delay: 0 }),
    map((wallet, index) => ({ wallet, index })),
    subscribeOn(asyncScheduler),
    share(),
)

const beautifulWalletDefinitions = [
    new BeautifulWallet(/^0x0{2}/i, "starts with 2 zeros", true),
]

const beautifulWalletsStream = walletStream.pipe(
    compactMap(({ wallet, index }) => {
        const beautiful = beautifulWalletDefinitions.find(w => w.isAppropriate(wallet.ethereumAddress))
        return beautiful ? ({ wallet, description: beautiful.description, index }) : undefined
    }),
    share(),
)

function accordionItemHTML(index: number, wallet: CryptoWallet, description: string) {
    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}"
                    aria-expanded="false" aria-controls="collapse${index}">
                    #${index} ${wallet.ethereumAddress}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}"
                data-bs-parent="#beautifulWalletsAccordion">
                <div class="accordion-body">
                    <strong class="text-uppercase">ethereum address</strong>
                    <br />
                    ${wallet.ethereumAddress}
                    <br />
                    <strong class="text-uppercase">bitcoin address</strong>
                    <br />
                    ${wallet.bitcoinAddress}
                    <br />
                    <strong class="text-uppercase">private key</strong>
                    <br />
                    ${wallet.privateKey}
                    <br />
                    <strong class="text-uppercase">mnemonic phrase</strong>
                    <br />
                    ${wallet.mnemonicPhrase}
                    <br />
                    <strong class="text-uppercase">beautiful reason</strong>
                    <br />
                    ${description}
                </div>
            </div>
        </div>
    `
}

window.onload = () => {
    const flushWallet = $("#flushWallet")

    walletStream.pipe(
        observeOn(animationFrameScheduler),
    ).subscribe(({ wallet, index }) => {
        flushWallet.find(".flushWalletIndex").text(index)
        flushWallet.find(".flushWalletEthereumAddress").text(wallet.ethereumAddress)
        flushWallet.find(".flushWalletBitcoinAddress").text(wallet.bitcoinAddress)
        flushWallet.find(".flushWalletPrivateKey").text(wallet.privateKey)
        flushWallet.find(".flushWalletMnemonicPhrase").text(wallet.mnemonicPhrase)
    })

    beautifulWalletsStream.pipe(
        observeOn(animationFrameScheduler),
    ).subscribe(({ wallet, description, index }) => {
        flushWallet.after(accordionItemHTML(index, wallet, description))
    })
}