
```shell
npx hardhat test test/HomeTokenTests.ts --typecheck
npx hardhat coverage
npx hardhat run scripts/deploy.js --network goerli
npx hardhat verify --network goerli --contract contracts/ERC20.sol:ERC20 0x8c3B3a14811D67FBc8EB836407131AEC62556665 "Bitcoin" "BTC"
```
