import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/cart.service';
import { UserDetails } from '../helpers/UserDetails';
import { Cart } from '../helpers/Cart';
import { totalPrice } from '../helpers/totalPrice';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {

  public userDetails: UserDetails;
  public cartItems: Cart[]=[] ;
  public searchReceiptProduct: string;  
  public totalPrice :number ;
  

  constructor(private route: ActivatedRoute , private cartService: CartService, public router:Router ) { }

  ngOnInit() {    

    this.getUserDetails();
    this.getItemsFromCart();



  }

  public getUserDetails(){
    this.route.params.subscribe((p: UserDetails)  =>{
      this.userDetails = p
    });
  }

  public getItemsFromCart(){
    this.cartService.getItemFromCart( this.userDetails.cartId_cart ).subscribe( (res: Cart[])=>{
      this.cartItems = res;
      this.totalPrice = totalPrice(res)


    },err=> console.log( err ))
  }


  searchProduct(e) {
    let word = e.target.value.toLocaleLowerCase();
    const win: any = window
    let toSearch = win.document.getElementsByClassName('searchProductName')
    for (let i = 0; i < toSearch.length; i++) {
      toSearch[i].innerHTML = toSearch[i].innerText.toLocaleLowerCase().replace(new RegExp(word, 'g'), '<span style="background:yellow">' + word + '</span>')
    }
  }


  public backToCart(){
    this.router.navigate(['/main', this.userDetails ]);
  }

}
