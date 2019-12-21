import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { ProductsService } from 'src/app/products.service';
import { Product } from '../helpers/Products';
import { FormBuilder, Validators } from '@angular/forms';
import { AdminService } from 'src/app/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {


  @ViewChildren('firstInput') firstInput:QueryList<ElementRef>;

  constructor(private userService: UserService, public productsService: ProductsService ,  public formBuilder: FormBuilder, public adminService: AdminService ) { }


  public allProducts
  public products: Product[] =[];
  public searchProduct: string;
  public chosenProduct: Product
  public productsCategory;

  public formForUpdate
  public isForm = false


  // public changedProductArr = []
  // public adminProductToUpdate
  ngOnInit() {


    this.formForUpdate = this.formBuilder.group({
      product_name: [ '' ,Validators.required ],
      price: [ '' , Validators.required],
      category_id: [ '' , Validators.required],
      product_picture : ['' , Validators.required],
      product_id: [ '' ]
    })


    this.tokenValidation();
    this.getCategories()
    this.getAllProducts();


    this.adminService.productChnaged.subscribe(
      ()=> this.getAllProducts()
    )

  }
  public tokenValidation(){
      let token = localStorage.getItem('myJwt')
     let myHeader= {
        headers: {
          'authorization': token
        }
      }
      this.userService.checkAdminLoginToken(myHeader)
      .subscribe(res=>{
      },err=>{
        if(err['status'] === 403 || err['status'] === 401 ){
          alert(err.error.message)
          window.location.replace('/home')
        }
          console.log(err)})
    }


    public getCategories(){
      this.productsService.getProductsCategories().subscribe( res =>{
        this.productsCategory = res;
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

  public openEdditorForm(){
    this.isForm = true
    this.formForUpdate.reset()
    setTimeout(() => {
      this.firstInput.last.nativeElement.focus();
    }, 100);

  }

  public clickedProduct(p){
    this.chosenProduct = p
    this.isForm = false;
  }




  public edditProduct(){
      let findIfNewProduct= this.allProducts.find(({product_name})=> product_name.toLocaleLowerCase() === this.formForUpdate.value.product_name.toLocaleLowerCase() )
     
      let findCategoryIdFromName = this.productsCategory.find(({category_name})=> category_name ===this.formForUpdate.value.category_id)
    this.formForUpdate.value.category_id = findCategoryIdFromName.category_id

    if(this.formForUpdate.value.product_id === null ){
      if(findIfNewProduct != undefined){
        alert('product name already exist, in order to update it you have to put the product id')
        return;
      }else{
        //add new product
        this.adminService.addNewProduct(this.formForUpdate.value).subscribe(res=>{
          alert('New product has been successfully added !')
          this.isForm = false
          this.adminService.productChangedEvent()
        },err=> console.log(err))
      }
    }else{
      let findIdProduct=  this.allProducts.find(({product_id})=> product_id === JSON.parse( this.formForUpdate.value.product_id ))
      if(findIdProduct === undefined ){
        alert('We couldnt find this product, please check the product id  ')
        return;
      }else{
            this.adminService.updateProduct(this.formForUpdate.value).subscribe(res=>{
            this.isForm = false
            this.adminService.productChangedEvent()

          }, err=> console.log(err))
      }
    }

  }
  }





  


