# Solidity By Example

A hardhat representation of some of the [Solidity By Example](https://solidity-by-example.org/) documentation, with corresponding tests to see the functionality come to life.

Some helpful functions:

```shell
yarn
npx hardhat compile
npx hardhat test
```

## Notes

- If you want to run only a specific test, either define it in the command line or add `.only` to `it()`.
- `TimeLock.sol` doesn't have tests since it uses an older version of solidity.
