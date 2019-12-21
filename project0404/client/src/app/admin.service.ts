
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  public productChnaged:EventEmitter<any>  = new EventEmitter <any> ();

  constructor(public http: HttpClient) { }


  public updateProduct( product ){
    console.log(product);
    return this.http.put('http://localhost:3000/update_product' , product)
  }

  public addNewProduct(newProduct){
    return this.http.post('http://localhost:3000/add_new_product' , newProduct)
  }

  public productChangedEvent(){
    this.productChnaged.emit()
  }

}
