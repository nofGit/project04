import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { MainComponent } from './components/main/main.component';
import { AdminComponent } from './components/admin/admin.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';


const routes: Routes = [
  {path:'' , redirectTo:'/home', pathMatch: 'full' },
  {path:'home' , component: HomeComponent},
  {path:'sign_up' , component:SignUpComponent},
  {path:'admin' , component: AdminComponent},
  {path:'main' , component: MainComponent},
  {path:'order' , component: OrderComponent},
  {path:'**' , component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
