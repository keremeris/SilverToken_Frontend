export class Swap {
    constructor(isBuy, buyToken, sellToken, amount, slippage){
        this.isBuy = isBuy;
        this.buyToken = buyToken;
        this.sellToken = sellToken;
        this.amount = amount;
        this.slippage = slippage;
    }
}



