import CryptoWallet from "../CryptoWallet"
import { animationFrameScheduler, asyncScheduler, defer, filter, map, observeOn, of, repeat, share, subscribeOn } from "rxjs"
import $ from "jquery"
import BeautifulWallet from "../BeautifulWallet"
import compactMap from "./compactMap"
import filterNull from "./compactMap"

const genWallet = defer(() => of(new CryptoWallet()))
const walletStream = genWallet.pipe(
    repeat({ delay: 0 }),
    map((wallet, index) => ({ wallet, index })),
    subscribeOn(asyncScheduler),
    share(),
)

walletStream.pipe(
    observeOn(animationFrameScheduler),
).subscribe(({ wallet, index }) =>
    $(".addressStream").text(`[${index}]: ${wallet.ethereumAddress}`)
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

beautifulWalletsStream.pipe(
    observeOn(animationFrameScheduler),
).subscribe(({ wallet, description, index }) => {
    $(".beautifulWalletsTableBody").append(`
    <tr>
      <th scope="row">${index}</th>
      <td>${wallet.ethereumAddress}</td>
      <td>${wallet.bitcoinAddress}</td>
      <td>${wallet.privateKey}</td>
      <td>${wallet.mnemonicPhrase}</td>
      <td>${description}</td>
    </tr>
    `)
})