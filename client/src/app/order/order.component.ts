import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  public BASE_URL =environment.BASE_URL ;
  public loading = false;
  itemTotalPrice = 0;
  orders=[];
  orderItems = [];
  orderDetails = {
    id:"",
    owner: {
      firstName:"",
      lastName:""
    },
    total:0,
    orderDate:"",
    paymentType:"",
    address: "",
    isOrderCompleted: 2,
  };

  pagination = {
    count: 0,
    pages : 1,
    page: 1,
    nextPage: null,
    previousPage: null,
    hasNextPage: true,
    hasPreviousPage: false
  };
  constructor(private orderService:OrderService) { }

  ngOnInit(): void {
    this.getClientOrders(this.pagination.page)
  }
  previousOrderPage(){
    if(this.pagination.hasPreviousPage){
      this.getClientOrders(this.pagination.previousPage);
    }
  }
  nextOrderPage(){
    if(this.pagination.hasNextPage){
      this.getClientOrders(this.pagination.nextPage);
    }
  }
  getOrderForClientById(id){
    {
      this.loading=true;
      this.orderService.getOrderForClientById(id).subscribe(data=>{
        const result:any = data
        this.orderDetails.owner.firstName = result.owner.firstName
        this.orderDetails.owner.lastName = result.owner.lastName
        this.orderDetails.total = result.total
        this.orderDetails.orderDate = result.orderDate
        this.orderDetails.address = result.address
        this.orderDetails.paymentType = result.paymentType
        this.orderDetails.isOrderCompleted = result.isOrderCompleted
        this.orderDetails.id = result._id
        this.orderItems = result.items
        this.loading = false;
        console.log(this.orderDetails)
      })
      this.loading = false;
    }
  }
  calculateTotalItemPrice(quantity, price){
    this.itemTotalPrice = quantity * price
  }
  getClientOrders(page)
  {
    this.loading = true;
    this.orderService.getClientOrder(page).subscribe(data=>{
      const result:any = data;
      this.orders = result.orders;
      this.pagination.count= result.count;
      this.pagination.pages = result.pages;
      this.pagination.page = result.page;
      this.pagination.nextPage = result.nextPage;
      this.pagination.previousPage = result.previousPage;
      this.pagination.hasNextPage = result.hasNextPage;
      this.pagination.hasPreviousPage = result.hasPreviousPage;
      this.loading = false;

     })
     
  }
}
