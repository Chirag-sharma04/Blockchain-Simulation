import crypto from 'crypto';

// Block class to represent each block in the chain
class Block {
  constructor(index, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.index +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
      )
      .digest('hex');
  }

  // Simple proof-of-work mechanism
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

// Blockchain class to manage the chain of blocks
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2; // Proof-of-work difficulty
  }

  createGenesisBlock() {
    return new Block(0, ['Genesis Block'], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transactions) {
    const block = new Block(
      this.chain.length,
      transactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty); // Apply proof-of-work
    this.chain.push(block);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block's hash
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // Verify link to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  // Method to demonstrate tampering detection
  tamperWithBlock(index, newTransactions) {
    if (index < this.chain.length) {
      this.chain[index].transactions = newTransactions;
      console.log(`Block ${index} has been tampered with!`);
    }
  }
}

// Create a new blockchain instance
const myBlockchain = new Blockchain();

// Add some blocks
console.log('Mining block 1...');
myBlockchain.addBlock(['Transaction 1: Alice -> Bob: 50 coins']);

console.log('Mining block 2...');
myBlockchain.addBlock(['Transaction 2: Bob -> Charlie: 30 coins']);

// Print the blockchain
console.log('\nBlockchain:');
console.log(JSON.stringify(myBlockchain.chain, null, 2));

// Validate the chain
console.log('\nIs blockchain valid?', myBlockchain.isChainValid());

// Demonstrate tampering detection
console.log('\nTampering with block 1...');
myBlockchain.tamperWithBlock(1, ['Tampered Transaction: Alice -> Bob: 1000000 coins']);

// Validate the chain again
console.log('Is blockchain valid after tampering?', myBlockchain.isChainValid());