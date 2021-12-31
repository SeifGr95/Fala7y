import { Injectable } from '@angular/core';
import{environment}from '../environments/environment';
import {HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class OrderService {

  BASE_URL=environment.BASE_URL;
  constructor(private http:HttpClient) { }
getAllOrders(page){
  let token= localStorage.getItem('token');
  return this.http.get(this.BASE_URL +'/orders?page='+ page,{headers:{
   'access_token':token
 }})
}
getOrderForClientById(id){
  const token = localStorage.getItem('token');
  let userID = localStorage.getItem('userID')
  return this.http.get(this.BASE_URL +'/orders/'+ userID+ '/'+ id, {headers:{
    'access_token':token
  }})
}

public getOrderForFarmerById(id){
  const token = localStorage.getItem('token');
  return this.http.get(this.BASE_URL +'/orders/'+id, {headers:{
    'access_token':token
  }})
}
  getClientOrder(page){ 
    let userID = localStorage.getItem('userID')
    let token= localStorage.getItem('token');
    return this.http.get(this.BASE_URL +'/orders/'+userID+'/orders?page='+ page,{headers:{
     'access_token':token
   }})
 }

 cancelOrder(id){
   let token = localStorage.getItem('token')
   return this.http.put(this.BASE_URL+ "/orders/"+id+ "/cancel",{
    isOrderCompleted: 0
  },
   {headers:{
    'access_token':token
  }} )
 }  
 confirmOrder(id){
  let token= localStorage.getItem('token');
   return this.http.put(this.BASE_URL +'/orders/'+id+'/confirm', {
    isOrderCompleted: 1
  },
   {headers:{
    'access_token':token
  }}
 )
 }
 payOrder(id){
  let token= localStorage.getItem('token');
   return this.http.put(this.BASE_URL +'/orders/'+id+'/pay', {
    isOrderPaid: true
  },
   {headers:{
    'access_token':token
  }}
 )
 }

  public addOrder( items, total, address)
  {
    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token')
  
    return this.http.post(this.BASE_URL +'/orders/'+userID+'/create', {
      'owner': userID,
      'address': address,
      'total': total,
      'items': items,
    },
    {headers:{
      'access_token': token
    }})
  
  }
}
