import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public http: HttpClient) { }

  public downOrder(cartId){
    return this.http.post(`http://localhost:3000/down_order`, cartId);
  }

  public getShippingDates(){
    return this.http.get(`http://localhost:3000/get_shipping_dates`)
  }

  public submitOrder(orderDetails){
    return this.http.post(`http://localhost:3000/add_order` , orderDetails)
  }

  public getAutoUserData(userId){
    return this.http.get(`http://localhost:3000/get_auto_user_data/${userId}` )
  }

  public getTotalOrders(){
    return this.http.get('http://localhost:3000/total_orders')
  }









}
