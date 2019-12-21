import { Product } from './Products'

export class Cart{
    constructor(
        public cart_id:number,
        public products : Product[],
        public total: number,    
    ){}
}

