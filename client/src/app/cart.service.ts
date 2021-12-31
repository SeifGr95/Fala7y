import { Injectable } from '@angular/core';
import{environment}from '../environments/environment';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CartService {

  BASE_URL=environment.BASE_URL;
  public itemCount:number =0;
  constructor(private http:HttpClient) { }
countCartItem(){
  const userID = localStorage.getItem('userID');
  const cartID = localStorage.getItem('cartID');
  const token = localStorage.getItem('token');
  return this.http.get(this.BASE_URL +'/cart/'+userID+'/'+cartID+'/countitem', {headers:{
    'access_token':token
  }})
}

removeItemCart(item){
  const userID = localStorage.getItem('userID');
  const cartID = localStorage.getItem('cartID');
  const token = localStorage.getItem('token')
  return this.http.put(this.BASE_URL +'/cart/'+userID+'/'+cartID+'/removeitem',
  {
    'item':item
  },
  {headers:{
    'access_token': token
  }})
}
setItemCount(items){
  return this.itemCount = items;
}
 public getItemCount(){
  return this.itemCount;
}
  addToCart(item, price, quantity){
    const userID = localStorage.getItem('userID');
    const cartID = localStorage.getItem('cartID');
    const token = localStorage.getItem('token')
    return this.http.put(this.BASE_URL +'/cart/'+userID+'/'+cartID+'/additem',
    {
      'item':item,
      'price': price,
      'quantity': quantity
    },
    {headers:{
      'access_token': token
    }})
  }
  getCart()
  { const userID = localStorage.getItem('userID');
    const cartID = localStorage.getItem('cartID');
    const token = localStorage.getItem('token')
    return this.http.get(this.BASE_URL +'/cart/'+userID+'/'+cartID, {headers:{
      'access_token':token
    }})
  }
  editQuantityCart(item, price, quantity, total){
    const userID = localStorage.getItem('userID');
    const cartID = localStorage.getItem('cartID');
    const token = localStorage.getItem('token')
    return this.http.put(this.BASE_URL +'/cart/'+userID+'/'+cartID+'/updatequantity',
    {
      'item':item,
      'price': price,
      'quantity': quantity,
      'total': total
    },
    {headers:{
      'access_token': token
    }})
  }

}
