export class Bridge {
    constructor(token, fromExchange, toExchange, amount){
        this.token = token;
        this.fromExchange = fromExchange;
        this.toExchange = toExchange;
        this.amount = amount;
    }
}