import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/cart.service';
import { UserDetails } from '../helpers/UserDetails';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  public loginUser
  public startShopButton: Boolean =false;
  public continueShopButton: Boolean =false;
  public userStatus;
  public buttonValue
  public dusplayLogin = false
  public userDetails: UserDetails
  
  // public fromSignUp = false
  // public detailsFromSighnUp
    // public lastOrder;
  // public ifCart;
  // public openCart;
  
  constructor( public userService: UserService, public formBuilder: FormBuilder, public route: Router, public cartService: CartService, public router:ActivatedRoute) { }

  ngOnInit() {

    this.loginUser = this.formBuilder.group({
      email:['',  [Validators.required, Validators.email]],
      user_password:['',  [Validators.required, Validators.minLength(5)]]
    })

    this.ifHasParams();
  
  }


      // Checking if comes from sign up component
  public ifHasParams(){
    this.router.params.subscribe((p:UserDetails)=>{
      if(Object.entries(p).length != 0){
        this.loginUser.controls['email'].setValue(p['email'])
        this.loginUser.controls['user_password'].setValue(p['user_password'])
        this.logInBtn();
      }
    })
  }


  public logInBtn(){
    this.userService.getLoginDetails( this.loginUser.value ).subscribe( (res: UserDetails)=>{
      if( res['success'] === false ){
        alert( 'Your login details are inncorrect' )
        return;
      }
      else{
          localStorage.setItem( 'myJwt', res['token'] )
           if( res['admin'] ){
             this.route.navigate( ['/admin'] )
             return;
            }
            else{
             this. dusplayLogin= true
              this.userDetails = res['result']
              console.log(this.userDetails);
              if( this.userDetails['cartId_cart'] === null ){
                  this.userStatus = 'Welcome to your first shopping :)'
                  this.buttonValue = 'start shopping'
                  this.startShopButton = true;
                  return;
              } else{
                    if(  this.userDetails['cartId_cart'] === this.userDetails['cartId_orders'] ){
                     // no open cart
                     this.userStatus = 'Hello again, you can start shopping'
                     this.buttonValue= ' continue shopping'
                     this.startShopButton = true;
                   }else{
                     this.userStatus = 'You have an open cart, you can continue shopping now'
                     this.buttonValue = 'continue shopping'
                     this.continueShopButton = true;
                   }
                  }

                // }
              

            }
      }
    },err=>{
      console.log('login Error>>>>', err.message )
    })
  }




  public startShop(){

      this.cartService.createCart( this.userDetails.userId_users   ).subscribe( (res)=>{
        this.cartService.selectUserCart( this.userDetails.userId_users ).subscribe((res:UserDetails)=>{
          this.userDetails['cartId_cart'] = res[ 'cart_id' ]
          this.route.navigate( ['/main' , this.userDetails ])
        },err=>console.log(err))
      },err=>console.log( err ))
  }



  public contineShop(){

    this.route.navigate( ['/main' , this.userDetails ] )

  }
}