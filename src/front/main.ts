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
                    <span class="badge rounded-pill bg-dark">#${index}</span>&nbsp;${wallet.ethereumAddress}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}"
                data-bs-parent="#beautifulWalletsAccordion">
                <div class="accordion-body">
                    <strong class="text-uppercase">ethereum address</strong>
                    <p class="font-monospace">${wallet.ethereumAddress}</p>
                    <strong class="text-uppercase">bitcoin address</strong>
                    <p class="font-monospace">${wallet.bitcoinAddress}</p>
                    <strong class="text-uppercase">private key</strong>
                    <p class="font-monospace">${wallet.privateKey}</p>
                    <strong class="text-uppercase">mnemonic phrase</strong>
                    <p class="font-monospace">${wallet.mnemonicPhrase}</p>
                    <strong class="text-uppercase">beautiful reason</strong>
                    <p class="font-monospace">${description}</p>
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