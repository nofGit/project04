import { Component, OnInit, Input, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OrderService } from 'src/app/order.service';
import { Order } from '../helpers/Order';
import { UserDetails } from '../helpers/UserDetails';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/cart.service';
import { totalPrice } from '../helpers/totalPrice';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-shipping-details',
  templateUrl: './shipping-details.component.html',
  styleUrls: ['./shipping-details.component.css']
})
export class ShippingDetailsComponent implements OnInit {

  public userOrderDetails;
  public allDates;
  public orderDetails:Order;
  public userDetails: UserDetails;
  public totalPrice
  public creditCardStatus:string
  public userCreditCard
  public creditLastDigits: number
  public date: Date
  public dateIsTaken 
  public paramsForMain
  public namereceipt :any= ""
  public downloadReceipt = false
  public submited = false

  constructor (   private sanitizer: DomSanitizer , public cartService:CartService, public formBuilder: FormBuilder, public orderService: OrderService,private route: ActivatedRoute , public router:Router ) { }



  @ViewChildren('dateInput') dateInput:QueryList<ElementRef>;
  @ViewChildren('cardInput') cardInput:QueryList<ElementRef>;

  
  ngOnInit() {

   this.getUserDetais();
   this.getTotalPrice();
    this.userOrderDetails = this.formBuilder.group({
      city:['',  Validators.required],
      street:['',  Validators.required],
      shippingDate:['',  Validators.required],
      creditNumber:['',  Validators.required]
    })

  }


  public getUserDetais(){
    this.route.params.subscribe((p: UserDetails)  =>{
    this.userDetails = p
    });
  }
  

  public getTotalPrice(){
    this.cartService.getItemFromCart(this.userDetails.cartId_cart).subscribe(res=>{
      this.totalPrice = totalPrice(res)
    })
  }

  public autoUserData(e){

  let pName = e.target['name']
    this.orderService.getAutoUserData(this.userDetails.userId_users).subscribe(res=> {
      this.userOrderDetails.controls[pName].setValue(res[pName])
      e.target.value = res[pName]
    }, err=> console.log( err ))
  }

  public orderBtn(){
        let dateIsTaken = false
    this.orderService.getShippingDates().subscribe(res=>{
      this.allDates = res
      for( let i=0; i < this.allDates.length; i++ ){
        let dateToSplit = this.allDates[i].shipping_date.slice(0,10)
        let date =  dateToSplit.split(',')
        date = date[0]
       let splitedDate = this.userOrderDetails.value.shippingDate.split('-' )
        let userDate  = splitedDate[1] + '/' + splitedDate[2] 
        userDate = userDate.replace(/0/g, '') + '/'
        let year = splitedDate[0]
        userDate  +=  year 
          if( userDate ===  date ){

          if( JSON.parse( this.allDates[i].equalDates ) === 3){
           dateIsTaken = true;
            alert('the date is taken, please choose another')
          }
        }
      }
      if( dateIsTaken === true ){

        this.dateInput.last.nativeElement.focus();
        this.dateInput.last.nativeElement.value = '';
        return;
      }else{
        this.creditLastDigits = this.creditCardValidation();
        if(this.creditLastDigits === undefined){
          this.cardInput.last.nativeElement.focus();
          return;
        }else{
          this.orderDetails = new Order(this.userDetails.userId_users , this.userDetails.cartId_cart, this.totalPrice, this.userOrderDetails.value.city.toLowerCase(), this.userOrderDetails.value.street.toLowerCase(),this.userOrderDetails.value.shippingDate, this.creditLastDigits)
          this.orderService.submitOrder(this.orderDetails).subscribe(res=>{
          },err => console.log( err ))
    
          this.orderSubmited()
        }
    
      }
    }, err=> console.log( err))

  }


  public orderSubmited(){
    this.submited = true
  }

  public finishShopping(){
    this.cartService.createCart( this.userDetails.userId_users   ).subscribe( (res)=>{
      this.cartService.selectUserCart( this.userDetails.userId_users ).subscribe((res:UserDetails)=>{
        this.paramsForMain = {
          userId_users: this.userDetails.userId_users,
          cartId_cart: res[ 'cart_id' ]
        }
        this.router.navigate( ['/main' , this.paramsForMain ])
      },err=>console.log(err))
    },err=>console.log( err ))
  }

  public creditCardValidation(){
    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    this.creditCardStatus ='';

  this.userCreditCard = this.userOrderDetails.value.creditNumber
  if(visaRegEx.test(this.userCreditCard)){
    return this.userCreditCard.slice(-4)
  }else{
    if(mastercardRegEx.test(this.userCreditCard)){
      return this.userCreditCard.slice(-4)
    }else{
      if(amexpRegEx.test(this.userCreditCard)){
        return this.userCreditCard.slice(-4)
      }else{
        if(discovRegEx.test(this.userCreditCard)){
          return this.userCreditCard.slice(-4)
        }else{
          this.creditCardStatus = 'credit card is not ok!!!'
          return;
        }
      }
    }
  }
  }



  public downladReceipt(){
    let user_details = { cartId: this.userDetails.cartId_cart}
    this.orderService.downOrder( user_details ).subscribe(res=>{
      this.namereceipt = res;
    } , err => console.log(err))

    this.downloadReceipt = true

  }

}
