import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/products.service';
import { OrderService } from 'src/app/order.service';

@Component({
  selector: 'app-total-orders',
  templateUrl: './total-orders.component.html',
  styleUrls: ['./total-orders.component.css']
})
export class TotalOrdersComponent implements OnInit {

  public totalProducts
  public totalOrders

  constructor( public productsService: ProductsService , public ordersService: OrderService ) { }

  ngOnInit() {
    this.getTotalProducts();
    this.getTotalOrders();

  }

  public getTotalProducts(){
    this.productsService.getTotalProducts().subscribe(res=>{
      this.totalProducts = res['totalProducts']
    }, err=> console.log(err))
  }

  public getTotalOrders(){
    this.ordersService.getTotalOrders().subscribe(res=>{
      this.totalOrders = res['totalOrders']
    }, err=> console.log( err ))
  }

}
