const {INITIAL_BALANCE } = require('../config');
const ChainUtil = require('../chain-util');
const Transaction = require('./transaction');



class Wallet{
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }


    toString(){
        return `
        Wallet :-
        publicKey: ${this.publicKey.toString()}
        balance  : ${this.balance}
        `
    }
    sign(dataHash){
         return this.keyPair.sign(dataHash);
    }


    createTransaction(recipient,amount,blockchain,transactionPool){

        this.balance = this.calculateBalance(blockchain);

        if(amount > this.balance){
            console.log(`Amount; ${amount} exceeds the current balance: ${this.balance}`)
            return;
        }


        if(recipient === this.publicKey){
            console.log("You cannot send money to your own wallet from your own wallet");

            return;
        }


        let transaction = transactionPool.existingTransaction(this.publicKey);

        if(transaction){
            transaction.update(this,recipient,amount)
        } else {
            transaction = Transaction.newTransaction(this,recipient,amount);
            transactionPool.updateOrAddTransaction(transaction)
        }

        return transaction;
    }


    calculateBalance(blockchain){

        let balance = this.balance;
        let transactions = [];
        
        blockchain.chain.forEach((block)=>{
            block.data.forEach((transaction)=>{
                transactions.push(transaction)
            })
        })
        
        
        const walletInputTs = transactions.filter((transaction)=>{
             return transaction.input.address === this.publicKey
          })
        
        
        let startTime = 0;
        
            
        if(walletInputTs.length > 0){
            const recentInputT = walletInputTs.reduce((prevT,currentT)=> {
               return prevT.input.timeStamp > currentT.input.timeStamp ? prevT : currentT 
               })
                
                balance = recentInputT.outputs.find((output)=> output.address === this.publicKey).amount;
        
                // console.log(balance);
        
                startTime = recentInputT.input.timeStamp;
          }
        
        
        transactions.forEach((transaction)=>{
              if(transaction.input.timeStamp > startTime){
                  transaction.outputs.find((output)=>{
                      if(output.address === this.publicKey){
                          balance += output.amount
                      }
                  })
              }
          })
        
          // console.log(balance)
          return balance;

          
    }



    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }


}


module.exports = Wallet;


// const ChainUtil = require('../chain-util');
// const Transaction = require('./transaction');
// const { INITIAL_BALANCE } = require('../config');

// class Wallet {
//   constructor() {
//     this.balance = INITIAL_BALANCE;
//     this.keyPair = ChainUtil.genKeyPair();
//     this.publicKey = this.keyPair.getPublic().encode('hex');
//   }

//   toString() {
//     return `Wallet -
//       publicKey: ${this.publicKey.toString()}
//       balance  : ${this.balance}`
//   }

//   sign(dataHash) {
//     return this.keyPair.sign(dataHash);
//   }

//   createTransaction(recipient, amount, blockchain, transactionPool) {
//     this.balance = this.calculateBalance(blockchain);

//     if (amount > this.balance) {
//       console.log(`Amount: ${amount} exceceds current balance: ${this.balance}`);
//       return;
//     }

//     let transaction = transactionPool.existingTransaction(this.publicKey);

//     if (transaction) {
//       transaction.update(this, recipient, amount);
//     } else {
//       transaction = Transaction.newTransaction(this, recipient, amount);
//       transactionPool.updateOrAddTransaction(transaction);
//     }

//     return transaction;
//   }

//   calculateBalance(blockchain) {
//     let balance = this.balance;
//     let transactions = [];
//     blockchain.chain.forEach(block => block.data.forEach(transaction => {
//       transactions.push(transaction);
//     }));

//     const walletInputTs = transactions
//       .filter(transaction => transaction.input.address === this.publicKey);

//     let startTime = 0;

//     if (walletInputTs.length > 0) {
//       const recentInputT = walletInputTs.reduce(
//         (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
//       );

//       balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
//       startTime = recentInputT.input.timestamp;
//     }

//     transactions.forEach(transaction => {
//       if (transaction.input.timestamp > startTime) {
//         transaction.outputs.find(output => {
//           if (output.address === this.publicKey) {
//             balance += output.amount;
//           }
//         });
//       }
//     });

//     return balance;
//   }

//   static blockchainWallet() {
//     const blockchainWallet = new this();
//     blockchainWallet.address = 'blockchain-wallet';
//     return blockchainWallet;
//   }
// }

// module.exports = Wallet;




















