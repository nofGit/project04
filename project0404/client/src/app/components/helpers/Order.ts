export class Order{
    constructor(
        public user_id:number,
        public cart_id:number,
        public total_price:number,
        public shipping_city:string,
        public shipping_street:string,
        public shipping_date:Date,

        public last_4_dig:number,
    ){}
}