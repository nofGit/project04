import { Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { ProductsService } from '../../products.service';
import {  ActivatedRoute } from '@angular/router';
import { Input } from '@angular/core';
import { CartService } from 'src/app/cart.service';
import { UserDetails } from '../helpers/UserDetails';
import { Product } from '../helpers/Products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  public productsCategody;
  public products: Product[] =[] ;
  public searchProduct: string;
  public userDetails: UserDetails;
  public chosenProduct : Product ;
  public dialogClose: boolean = false
  public allProducts
  public requestedQuantity


  @ViewChildren('quantityInput') quantityInput:QueryList<ElementRef>;

  constructor(public cartService:CartService, private productsService:ProductsService , private route:ActivatedRoute ) { }
  
  ngOnInit() {
    this.getParamsFromRouter();
    this.getCategories()
    this.getAllProducts();

  }


  public getCategories(){
    this.productsService.getProductsCategories().subscribe( res =>{
      this.productsCategody = res;
    }, err => console.log( err ))
  }

  public getAllProducts(){
    this.productsService.getAllProducts().subscribe((res: Product[])=>{
          this.products = res
          this.allProducts = this.products
          }, err=> console.log(err));
  }

  public getProductsByCaregory( category_idd ){ 
      this.products = this.allProducts
      let filterCategory = this.products.filter(( p:Product )=>
        p.category_id.toString().indexOf( category_idd ) >-1 )
      this.products = filterCategory;

  }


  
  public filterProducts(){  
    if(this.searchProduct === undefined){
      return
    }
      let searchProductFilter = this.products.filter( p =>
        p.product_name.toLocaleLowerCase().indexOf( this.searchProduct.toLocaleLowerCase() )>-1 )
        this.products = this.searchProduct ? searchProductFilter : this.allProducts
    

  }
  
   public getParamsFromRouter(){
    this.route.params.subscribe((p: UserDetails )=>{
      this.userDetails = p;
     })
  }
  

  public showQuantityInput( productClickedNext ){
    this.chosenProduct = productClickedNext
    this.dialogClose = true
    this.requestedQuantity = ''
    setTimeout(() => {
      this.quantityInput.last.nativeElement.focus()
    }, 100);
  }
  

 public addtocart(  ){
  if(this.requestedQuantity === undefined || this.requestedQuantity === null || this.requestedQuantity ===''){
    alert('Value is not valid, please try again')
    this.requestedQuantity = ''
    this.quantityInput['_results'][0].nativeElement.focus()
    return;
  }
   let ifNegativeQuantity = this.requestedQuantity.toString().split('')
   if(ifNegativeQuantity[0] === '-' ||JSON.parse( ifNegativeQuantity[0] )===0 ){
     alert('You can not choose a negative number');
     this.requestedQuantity = ''
     this.quantityInput['_results'][0].nativeElement.focus() 
     return

   }

   this.chosenProduct = new Product( this.chosenProduct.product_id, this.chosenProduct.category_id, this.chosenProduct.category_name , this.chosenProduct.price ,this.chosenProduct.product_name, this.chosenProduct.product_picture, this.requestedQuantity  )
   this.dialogClose = false
   this.cartService.getItemFromCart(  this.userDetails.cartId_cart  ).subscribe((res:Product[])=>{
     let ifProductAlreadyChoose: Product[]
     ifProductAlreadyChoose =res
    let map = ifProductAlreadyChoose.find(({ product_id })=>product_id === this.chosenProduct.product_id)
    if( ifProductAlreadyChoose.length === 0 || map === undefined ){
            this.cartService.addProductToCart( this.chosenProduct ,  this.userDetails.cartId_cart  ).subscribe( res =>{ 
       
            this.cartService.productAddedToCartEvent();
          }, err => console.log( err ))
    }else{
            this.cartService.updateQuantityOnCrt( this.chosenProduct ).subscribe( res=>{
            this.cartService.productAddedToCartEvent();
           },err=>console.log(err))
    }
   },err=> console.log(err))


 }


//  public addtocart( quantity_val ){

//    let ifNegativeQuantity = quantity_val.split('')
//    if(ifNegativeQuantity[0] === '-'){
//      alert('you can not choose a negative number');
//      return
//    }
//    if(quantity_val === ''){
//      alert('please enter requested quantity');
//      return;
//    }
//    this.chosenProduct = new Product( this.chosenProduct.product_id, this.chosenProduct.category_id, this.chosenProduct.category_name , this.chosenProduct.price ,this.chosenProduct.product_name, this.chosenProduct.product_picture, quantity_val  )
//    this.dialogClose = false
//    this.cartService.getItemFromCart(  this.userDetails.cartId_cart  ).subscribe((res:Product[])=>{
//      let ifProductAlreadyChoose: Product[]
//      ifProductAlreadyChoose =res
//     let map = ifProductAlreadyChoose.find(({ product_id })=>product_id === this.chosenProduct.product_id)
//     if( ifProductAlreadyChoose.length === 0 || map === undefined ){
//             this.cartService.addProductToCart( this.chosenProduct ,  this.userDetails.cartId_cart  ).subscribe( res =>{ 
//             this.cartService.productAddedToCartEvent();
//           }, err => console.log( err ))
//     }else{
//             this.cartService.updateQuantityOnCrt( this.chosenProduct ).subscribe( res=>{
//             this.cartService.productAddedToCartEvent();
//            },err=>console.log(err))
//     }
//    },err=> console.log(err))


//  }


 public closeDialgog(){   
   this.dialogClose = false;
   return;
 }

    }