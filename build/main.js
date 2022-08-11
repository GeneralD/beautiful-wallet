"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const objects_to_csv_1 = __importDefault(require("objects-to-csv"));
const wallet_ts_1 = require("wallet.ts");
const beautifulWallet_1 = require("./beautifulWallet");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (let i = 0;; i++) {
        // Generate seed
        const mnemonic = wallet_ts_1.Mnemonic.generate((0, crypto_1.randomBytes)(32));
        const phrase = mnemonic.phrase;
        const seed = mnemonic.toSeed();
        // Build keys
        const masterKey = wallet_ts_1.HDKey.parseMasterSeed(seed);
        const extendedPrivateKey = masterKey.derive("m/44'/60'/0'/0").extendedPrivateKey || "";
        const childKey = wallet_ts_1.HDKey.parseExtendedKey(extendedPrivateKey);
        // Get wallet
        const wallet = childKey.derive("0");
        const walletPublicKey = wallet.publicKey;
        const ethAddress = wallet_ts_1.EthereumAddress.from(walletPublicKey).address;
        const btcAddress = wallet_ts_1.BitcoinAddress.from(walletPublicKey).address;
        var beautiful;
        if (beautiful = beautifulWallet_1.beautifulWallets.find(w => w.active && w.addressPattern.exec(ethAddress))) {
            const csv = new objects_to_csv_1.default([{
                    phrase,
                    privateKey: (_a = wallet.privateKey) === null || _a === void 0 ? void 0 : _a.toString("hex"),
                    btcAddress: btcAddress,
                    ethAddress: wallet_ts_1.EthereumAddress.checksumAddress(ethAddress),
                    description: beautiful.description,
                }]);
            yield csv.toDisk("./wallets.csv", { append: true });
        }
        console.log(`${i}:\t${ethAddress}`);
    }
});
main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
