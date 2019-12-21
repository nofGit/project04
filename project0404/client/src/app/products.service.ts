import { Injectable, Output, EventEmitter  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(public http: HttpClient) { }


  public getProductsCategories(){
    return this.http.get(`http://localhost:3000/product_category` )
  }

  public getProductsByCategory(category_id){ 
    return this.http.get(`http://localhost:3000/products/${category_id}`)
  }

  public getAllProducts(){
    return this.http.get(`http://localhost:3000/all_products`)
  }

  public getTotalProducts(){
    return this.http.get('http://localhost:3000/total_products')
  }
  
}