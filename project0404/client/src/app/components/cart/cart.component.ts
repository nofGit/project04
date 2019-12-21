import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/products.service';
import { CartService } from 'src/app/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Cart } from '../helpers/Cart';
import { UserDetails } from '../helpers/UserDetails';
import { totalPrice } from '../helpers/totalPrice';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
 
public userDetails: UserDetails;
public bupUserDetails
public cartItems: Cart[]=[]

public cartIsEmpty = true;
public totalPrice
r
  constructor(private productService:ProductsService, public cartService: CartService, private route:ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
  
    this.getUserDetailsParams();
    this.getItemsFromCart();

    
    this.cartService.dataAddedToCart.subscribe(
      ()=>this.getItemsFromCart()
      )
    
    }


public getUserDetailsParams(){  
  this.route.params.subscribe((p:UserDetails)=>{
    this.userDetails = p
   })
}



  public getItemsFromCart(){

    if(this.userDetails.cartId_cart)
    this.cartService.getItemFromCart( this.userDetails.cartId_cart ).subscribe((res: Cart[] )=>{
      this.cartItems = res
      if(this.cartItems.length > 0){
        this.cartIsEmpty = false;
        this.totalPrice = totalPrice(res)
      }else{
        this.cartIsEmpty = true;
        return;
      }
    },err=> console.log( err ))
  }

  public deleteProductFromCart( productIdToDelete ){
    this.cartService.deleteProductFromCart( productIdToDelete ).subscribe(res=>{
      this.cartService.productAddedToCartEvent();
    }, err=> console.log(err))
  }

  public cleanCart(){
    let ifConfirm = confirm('do you really want to delete all products from cart?')

    if(ifConfirm === true){
      this.cartService.deleteAllProductsFromCart(this.userDetails.cartId_cart).subscribe(res=>{
        this.cartService.productAddedToCartEvent();
      }, err=> console.log(err))
      this.cartIsEmpty = true;
    }else{
      return;
    }
  }

  public orderCart(){
    this.router.navigate( ['/order' ,this.userDetails])
  }
  
}

