const BlockChain = require("./index");
const Block = require('./Block');

describe("BlockChain",()=>{
    let bc,bc2;

    beforeEach(()=>{
        bc = new BlockChain()
        bc2 = new BlockChain()
    })



    it("starts with genesis block",()=>{
        expect(bc.chain[0]).toEqual(Block.genesis())
    })


    it("adds a new block to the chain",()=>{
       const data = "foo";

       bc.addBlock(data)
       expect(bc.chain[bc.chain.length - 1].data).toEqual(data)
    })
    


    it('validates a valid Chain',()=>{
        bc2.addBlock('foo');

        expect(bc.isValidChain(bc2.chain)).toBe(true)
    })

     
    it('invalidates a chain with a corrupt genesis block',()=>{
        bc2.chain[0].data = "Bad Dta";

        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })

    it('invalidates a corrupt chain',()=>{
        bc2.addBlock('foo')
        bc2.chain[1].data = 'Not foo'

        expect(bc.isValidChain(bc2.chain)).toBe(false)
    })


    it('replaces the chain with a valid chain',()=>{
        bc2.addBlock('food')
        bc.replaceChain(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);
    })

    it('does not replace the chain with one of less than or equal to lenght',()=>{
        bc.addBlock('foodf')
        bc.replaceChain(bc.chain);

        expect(bc.chain).not.toEqual(bc2.chain);
    })

})