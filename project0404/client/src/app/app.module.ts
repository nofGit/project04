import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { MainComponent } from './components/main/main.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminComponent } from './components/admin/admin.component';
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { ShippingDetailsComponent } from './components/shipping-details/shipping-details.component';
import { ReceiptComponent } from './components/receipt/receipt.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { TotalOrdersComponent } from './components/total-orders/total-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    NotFoundComponent,
    LogInComponent,
    MainComponent,
    ProductsComponent,
    CartComponent,
    AdminComponent,
    HomeComponent,
    OrderComponent,
    ShippingDetailsComponent,
    ReceiptComponent,
    AboutUsComponent,
    TotalOrdersComponent,
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
