import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../products.service';
import { UserService } from 'src/app/user.service';
import { NotFoundComponent } from '../not-found/not-found.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDetails } from '../helpers/UserDetails';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public cartWidth: number;
  public buttonVal;
  public cartClosed:Boolean = false;
  

  // public loginEmailUser
  // public cartDiv;

  constructor(private userService: UserService, public route:ActivatedRoute, public router: Router ) { }

  ngOnInit() {

    this.cartWidth=300;
    this.buttonVal = '««'
   this.tokeValidation()


      this.getParamsFromRouter()

  }

  public tokeValidation(){

    let token = localStorage.getItem('myJwt')
   let myHeader= {
      headers: {
        'authorization': token
      }
    }
    this.userService.checkUserLoginToken(myHeader).subscribe(res=>{
    },err=>{
      if(err['status'] === 403 || err['status'] === 401 ){
        alert(err.error.message)
        this.router.navigate(['/home'])

      }
        console.log(err)})
  }


  public getParamsFromRouter(){
    this.route.params.subscribe((p: UserDetails )=>{
      
      if( Object.entries(p).length === 0 ){
        alert('We couldnt find your details, please try to login again')
        this.router.navigate(['/home'])
      }
     })
  }

  public closeCart(){

    this.cartClosed = !this.cartClosed;
    
    if(this.cartClosed){
      this.buttonVal='»»'
    }else{
      this.buttonVal = '««'
    }
  }

}
