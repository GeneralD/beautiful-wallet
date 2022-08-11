"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beautifulWallets = void 0;
exports.beautifulWallets = [
    { addressPattern: /^0x\d{40}$/i, description: "only numbers", active: true },
    { addressPattern: /^0x[a-f]{40}$/i, description: "only alphabets", active: true },
    { addressPattern: /^0x0{5}/i, description: "starts with 5 zeros", active: true },
    { addressPattern: /^0x000[0-9a-f]{32}000$/i, description: "lead and tail are 3 zeros", active: true },
    { addressPattern: /^0x[0369a-f]{40}$/i, description: "multiple of 3", active: true },
    { addressPattern: /^0x[0369578a-f]{40}$/i, description: "hiyoki", active: true },
    { addressPattern: /^0x012345/i, description: "starts with number ascendant", active: true },
    { addressPattern: /456789^/i, description: "ends with number descendant", active: true },
    { addressPattern: /0{7}/i, description: "includes 7 zeros", active: true },
    { addressPattern: /1{7}/i, description: "includes 7 ones", active: true },
    { addressPattern: /2{7}/i, description: "includes 7 twos", active: true },
    { addressPattern: /3{7}/i, description: "includes 7 threes", active: true },
    { addressPattern: /4{7}/i, description: "includes 7 fours", active: true },
    { addressPattern: /5{7}/i, description: "includes 7 fives", active: true },
    { addressPattern: /6{7}/i, description: "includes 7 sixes", active: true },
    { addressPattern: /7{7}/i, description: "includes 7 sevens", active: true },
    { addressPattern: /8{7}/i, description: "includes 7 eights", active: true },
    { addressPattern: /9{7}/i, description: "includes 7 nines", active: true },
    { addressPattern: /a{7}/i, description: "includes 7 a", active: true },
    { addressPattern: /b{7}/i, description: "includes 7 b", active: true },
    { addressPattern: /c{7}/i, description: "includes 7 c", active: true },
    { addressPattern: /d{7}/i, description: "includes 7 d", active: true },
    { addressPattern: /e{7}/i, description: "includes 7 e", active: true },
    { addressPattern: /f{7}/i, description: "includes 7 f", active: true },
];
