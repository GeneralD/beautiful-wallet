import CryptoWallet from '../CryptoWallet'

export default function (index: number, wallet: CryptoWallet, description: string) {
    return `
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}"
                    aria-expanded="false" aria-controls="collapse${index}">
                    <span class="badge rounded-pill bg-dark">#${index}</span>
                    &nbsp;
                    <span class="walletValue ethereumAddress text-truncate">${wallet.ethereumAddress}</span>
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}"
                data-bs-parent="#beautifulWalletsAccordion">
                <div class="accordion-body">
                    <strong class="walletKey text-uppercase">ethereum address</strong>
                    <p class="walletValue ethereumAddress text-break">${wallet.ethereumAddress}</p>
                    <strong class="walletKey text-uppercase">bitcoin address</strong>
                    <p class="walletValue bitcoinAddress text-break">${wallet.bitcoinAddress}</p>
                    <strong class="walletKey text-uppercase">private key</strong>
                    <p class="walletValue privateKey text-break lockedContents">${wallet.privateKey}</p>
                    <strong class="walletKey text-uppercase">mnemonic phrase</strong>
                    <p class="walletValue mnemonicPhrase text-break lockedContents">${wallet.mnemonicPhrase}</p>
                    <strong class="walletKey text-uppercase">beautiful reason</strong>
                    <p class="walletValue description text-break">${description}</p>
                </div>
            </div>
        </div>
    `
}