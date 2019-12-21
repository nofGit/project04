import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: HttpClient) { }

  public check_if_user_exist(user_details){
    return this.http.post( `http://localhost:3000/check_if_user_exist` ,user_details )
  }

  public addNewUser(newUser){
    return this.http.post('http://localhost:3000/sign_up', newUser)
  }

  public getLoginDetails(loginDetails){
    return this.http.post('http://localhost:3000/login' , loginDetails)
  }

  public checkUserLoginToken(token){
    return this.http.get(`http://localhost:3000/main` , token )
  }


  public checkAdminLoginToken(token){
    return this.http.get(`http://localhost:3000/admin` , token )
  }



}
