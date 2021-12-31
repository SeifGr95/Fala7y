import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http' ;
import {environment} from '../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL =environment.BASE_URL ;
  constructor(private http:HttpClient) { }
  isAuth:boolean=false;
  isFarmer:boolean=false;

  public isAuthFarmer() : Boolean {
    let userData = localStorage.getItem('farmer')
    if(userData === "true"){
      return this.isFarmer=true;
    }
    return this.isFarmer=false;
  }
public isAuthenticated() : Boolean {
    let userData = localStorage.getItem('token')
    if(userData){
      return this.isAuth=true;
    }
    return this.isAuth=false;
  }
public authUser(email,password)
  {
    return this.http.post(this.BASE_URL +'/auth/login',{
      'email':email,
      'password':password
    })
  }
public registerUser(firstName, lastName, email, userName, password, phoneNumber, address)
{

  return this.http.post(this.BASE_URL +'/auth/register', {
    'firstname':firstName,
    'lastname':lastName,
    'email': email,
    'username': userName,
    'password': password,
    'phonenumber': phoneNumber,
    'address': address
  })

}
}

