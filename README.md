# Solidity By Example - Interactive Learning

Welcome to this educational repository that complements [solidity-by-example.org](https://solidity-by-example.org)! This repository provides hands-on examples with Foundry testing to help you learn Solidity through practical experience.

## 🎯 Purpose

This repository aims to:
- Provide practical, runnable examples of Solidity concepts
- Demonstrate best practices through comprehensive tests
- Help you understand Solidity patterns through interactive learning

## 📚 Examples Structure

Each example in this repository follows this structure:
1. A Solidity contract demonstrating a concept
2. Comprehensive tests showing different use cases
3. Comments explaining key concepts and potential pitfalls

## 🚀 Getting Started

### Prerequisites

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Clone this repository:
```bash
git clone https://github.com/larrettgee/solidity-by-example.git
cd solidity-by-example
```

3. Install dependencies:
```bash
forge install
```

### Running the Examples

1. Build all contracts:
```bash
forge build
```

2. Run all tests:
```bash
forge test
```

3. Run tests for a specific example:
```bash
forge test --match-contract ExampleContractTest
```

## 📖 Available Examples

- Basic Concepts
  - Variables and Types
  - Functions
  - Control Flow
- Intermediate Concepts
  - Events and Logging
  - Error Handling
  - Inheritance
- Advanced Concepts
  - Assembly
  - Storage Patterns
  - Gas Optimization

## 🛠 Development Tools

This project uses Foundry, which includes:
- **Forge**: Testing framework
- **Cast**: Chain interaction tool
- **Anvil**: Local testnet node
- **Chisel**: Solidity REPL

For detailed documentation on Foundry, visit [book.getfoundry.sh](https://book.getfoundry.sh/)

## 🤝 Contributing

Contributions are welcome! If you have an example you'd like to add:
1. Fork the repository
2. Create a new branch for your example
3. Add your contract and tests
4. Submit a PR with a clear description of what your example teaches

## 📝 License

This project is licensed under MIT - see the LICENSE file for details

---

Happy learning! If you find this helpful, please give it a ⭐️