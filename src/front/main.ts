import $ from 'jquery'
import {
    animationFrameScheduler, asyncScheduler, defer, map, observeOn, of, repeat, share, subscribeOn
} from 'rxjs'

import CryptoWallet from '../CryptoWallet'
import accordionItemHTML from './accordionItemHTML'
import beautifulWalletDefinitions from './beautifulWalletDefinitions'
import compactMap from './compactMap'
import Web3Manager from './Web3Manager'

const walletStream = defer(() => of(new CryptoWallet()))
    .pipe(
        repeat({ delay: 0 }),
        map((wallet, index) => ({ wallet, index })),
        subscribeOn(asyncScheduler),
        share(),
    )

const beautifulWalletsStream = walletStream
    .pipe(
        compactMap(({ wallet, index }) => {
            const beautiful = beautifulWalletDefinitions.find(w => w.isAppropriate(wallet.ethereumAddress))
            return beautiful ? ({ wallet, description: beautiful.description, index }) : undefined
        }),
        share(),
    )

window.onload = async () => {
    const flushWallet = $("#flushWallet")
    const flushWalletIndex = flushWallet.find(".index")
    const flushWalletEthereumAddress = flushWallet.find(".ethereumAddress")
    const flushWalletBitcoinAddress = flushWallet.find(".bitcoinAddress")
    const flushWalletPrivateKey = flushWallet.find(".privateKey")
    const flushWalletMnemonicPhrase = flushWallet.find(".mnemonicPhrase")

    walletStream
        .pipe(
            observeOn(animationFrameScheduler),
        ).subscribe(({ wallet, index }) => {
            flushWalletIndex.text(index)
            flushWalletEthereumAddress.text(wallet.ethereumAddress)
            flushWalletBitcoinAddress.text(wallet.bitcoinAddress)
            flushWalletPrivateKey.text(wallet.privateKey)
            flushWalletMnemonicPhrase.text(wallet.mnemonicPhrase)
        })

    beautifulWalletsStream
        .pipe(
            observeOn(animationFrameScheduler),
        ).subscribe(({ wallet, description, index }) => {
            flushWallet.after(accordionItemHTML(index, wallet, description))
        })

    const web3 = await Web3Manager.instantiate("", "", "")
    $(".connectWalletButton").on("click", async () => {
        await web3.connectWallet()
    })
}

window.onbeforeunload = event => {
    event.returnValue = "Generated wallets may be lost."
}