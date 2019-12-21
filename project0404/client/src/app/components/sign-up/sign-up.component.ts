import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { MustMatch } from '../helpers/Must-match';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public newUser;
  public showContinueSignUp= true;

  currentId :number ;

  constructor(public userService:UserService , public formBuilder: FormBuilder, public router: Router) { }
  @ViewChildren('firstNameInput') firstNameInput:QueryList<ElementRef>;

  
  ngOnInit() {

    this.newUser = this.formBuilder.group({
      user_id: ['', [Validators.required , Validators.pattern(".{9}")]], 
      email: ['',[Validators.required,Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]], 
      user_password: ['', [Validators.required, Validators.minLength(5)]],
      confirm_password:['' , Validators.required],
      first_name: ['',  Validators.required],
      last_name:['',  Validators.required],
      city:['',  Validators.required],
      street:['',  Validators.required]
    },{
      validator: MustMatch('user_password', 'confirm_password')
    })
  }



  public signUp(){
   let userDetails = {
     user_id: this.newUser.value.user_id, 
     email: this.newUser.value.email.toLowerCase(),
     user_password: this.newUser.value.user_password , 
     first_name: this.newUser.value.first_name.toLocaleLowerCase(), 
     last_name: this.newUser.value.last_name.toLocaleLowerCase(),
     city: this.newUser.value.city.toLowerCase(),
     street: this.newUser.value.street.toLowerCase()
    }
    this.userService.addNewUser( userDetails ).subscribe(res=>{
      let sendParams = {user_password: userDetails.user_password , email: userDetails.email }
      
      this.router.navigate(['/home', sendParams])  
    }, err=>{
      console.log('error>', err.message)
    }) 
  }


  
      public continueBtn(){

        this.userService.check_if_user_exist( this.newUser.value ).subscribe( res =>{
          if(res && res['isExsit'] === true ){
              alert('user alredy exist (email or id')
              return;
          }
          else{
            this.showContinueSignUp = !this.showContinueSignUp

            setTimeout(() => {
              this.firstNameInput.last.nativeElement.focus();
            }, 100);

          }
        },err=>console.log(err))
      }



}
