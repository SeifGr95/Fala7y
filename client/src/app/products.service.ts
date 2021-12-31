import { Injectable } from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http' ;
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private BASE_URL =environment.BASE_URL ;
  constructor(private http:HttpClient) { }
  searchProduct(productName){
    return this.http.post(this.BASE_URL+ "/product/searchproduct/",{
      'productName': productName
    } )
  }

editProduct(productID,data){
  const token = localStorage.getItem('token')
  const userID = localStorage.getItem('userID')
  return this.http.put(this.BASE_URL+ '/product/'+productID+'/update',data
   ,{headers:{
    'access_token':token
  }}
  )
}
  getPorducts()
  {
   return this.http.get(this.BASE_URL +'/product/')
  }

  addProduct(data)
{
  const token = localStorage.getItem('token')
  const userID = localStorage.getItem('userID')

  return this.http.post(this.BASE_URL +'/product/create', data,
  {headers:{
    'access_token': token
  }})

}
deleteProduct(id){
  const token = localStorage.getItem('token')
  return this.http.delete(this.BASE_URL + '/product/'+id+'/delete', {headers:{
    'access_token': token
  }})
}
}
