import { Injectable, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart } from './components/helpers/Cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  public dataAddedToCart:EventEmitter<any>  = new EventEmitter <any> ();
  constructor(public http: HttpClient) { }


  public createCart(userId){
    return this.http.post('http://localhost:3000/create_cart', {userId: userId})
  }

  public selectUserCart( userID ){
    return this.http.get(`http://localhost:3000/select_cart/${userID } ` )
  }

  public getItemFromCart(cartId){
    return this.http.get(`http://localhost:3000/select_items_from_cart/${cartId}`)
  }

  public addProductToCart(product, cartId){
    return this.http.post(`http://localhost:3000/add_product_to_cart`, {cartId: cartId,  product: product})
  }

  public updateQuantityOnCrt(productToUpdate){
    return this.http.put(`http://localhost:3000/update_quantity_on_cart` , productToUpdate)
  }

  public deleteProductFromCart(productId){
    return this.http.delete(`http://localhost:3000/delete_item_from_cart/${productId}`  )
  }

  public deleteAllProductsFromCart(cartId){
    return this.http.delete(`http://localhost:3000/delete_all_items_from_cart/${cartId}`  )
  }

 public productAddedToCartEvent(){
    this.dataAddedToCart.emit();
  }



  
}
