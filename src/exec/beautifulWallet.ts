import BeautifulWallet from '../BeautifulWallet'

export const beautifulWallets = [
    new BeautifulWallet(/^0x\d{40}$/i, "only numbers", true),
    new BeautifulWallet(/^0x[a-f]{40}$/i, "only alphabets", true),
    new BeautifulWallet(/^0x0{7}/i, "starts with 7 zeros", true),
    new BeautifulWallet(/^0x1{7}/i, "starts with 7 ones", true),
    new BeautifulWallet(/^0x2{7}/i, "starts with 7 twos", true),
    new BeautifulWallet(/^0x3{7}/i, "starts with 7 threes", true),
    new BeautifulWallet(/^0x4{7}/i, "starts with 7 fours", true),
    new BeautifulWallet(/^0x5{7}/i, "starts with 7 fives", true),
    new BeautifulWallet(/^0x6{7}/i, "starts with 7 sixes", true),
    new BeautifulWallet(/^0x7{7}/i, "starts with 7 sevens", true),
    new BeautifulWallet(/^0x8{7}/i, "starts with 7 eights", true),
    new BeautifulWallet(/^0x9{7}/i, "starts with 7 nines", true),
    new BeautifulWallet(/^0xa{7}/i, "starts with 7 a", true),
    new BeautifulWallet(/^0xb{7}/i, "starts with 7 b", true),
    new BeautifulWallet(/^0xc{7}/i, "starts with 7 c", true),
    new BeautifulWallet(/^0xd{7}/i, "starts with 7 d", true),
    new BeautifulWallet(/^0xe{7}/i, "starts with 7 e", true),
    new BeautifulWallet(/^0xf{7}/i, "starts with 7 f", true),
    new BeautifulWallet(/^0x0000[0-9a-f]{32}0000$/i, "lead and tail are 4 zeros", true),
    new BeautifulWallet(/^0x[0369a-f]{40}$/i, "multiple of 3", true),
    new BeautifulWallet(/^0x0123456/i, "starts with number ascendant", true),
    new BeautifulWallet(/^0xabcdef/i, "starts with alphabet ascendant", true),
    new BeautifulWallet(/0{8}/i, "includes 8 zeros", true),
    new BeautifulWallet(/1{8}/i, "includes 8 ones", true),
    new BeautifulWallet(/2{8}/i, "includes 8 twos", true),
    new BeautifulWallet(/3{8}/i, "includes 8 threes", true),
    new BeautifulWallet(/4{8}/i, "includes 8 fours", true),
    new BeautifulWallet(/5{8}/i, "includes 8 fives", true),
    new BeautifulWallet(/6{8}/i, "includes 8 sixes", true),
    new BeautifulWallet(/7{8}/i, "includes 8 sevens", true),
    new BeautifulWallet(/8{8}/i, "includes 8 eights", true),
    new BeautifulWallet(/9{8}/i, "includes 8 nines", true),
    new BeautifulWallet(/a{8}/i, "includes 8 a", true),
    new BeautifulWallet(/b{8}/i, "includes 8 b", true),
    new BeautifulWallet(/c{8}/i, "includes 8 c", true),
    new BeautifulWallet(/d{8}/i, "includes 8 d", true),
    new BeautifulWallet(/e{8}/i, "includes 8 e", true),
    new BeautifulWallet(/f{8}/i, "includes 8 f", true),
]