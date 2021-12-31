import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent implements OnInit {
  public BASE_URL =environment.BASE_URL ;
  public loading = false;
  canConfirm = false
  itemTotalPrice = 0;
  orders= null;
  orderItems = [];
  orderDetails = {
    orderNumber:"",
    id:"",
    owner: {
      phoneNumber:"",
      firstName:"",
      lastName:""
    },
    total:0,
    orderDate:"",
    paymentType:"",
    address: "",
    isOrderCompleted: 2,
    isOrderPaid: false,
    delivery: 5
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
  constructor(private orderService:OrderService,private route:ActivatedRoute, public router:Router) { }

  ngOnInit(): void {
    
    this.getAllOrders(this.pagination.page);
  }

  previousOrderPage(){
    if(this.pagination.hasPreviousPage){
      this.getAllOrders(this.pagination.previousPage);
    }
  }
  nextOrderPage(){
    if(this.pagination.hasNextPage){
      this.getAllOrders(this.pagination.nextPage);
    }
  }
  getAllOrders(page)
  {
    this.loading = true;
    this.orderService.getAllOrders(page).subscribe(data=>{
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
  isOrderConfirmed(){
   if(this.orderDetails.isOrderCompleted == 1){
    return 1;
   }else if(this.orderDetails.isOrderCompleted == 2){
    return 2;
  }else{
   return 0;
  }
}
cancelOrder(id){
  Swal.fire({
    title: 'Êtes-vous sûrs?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, annulez-le!',
    cancelButtonText: "Quittez"
  }).then(result=>{
    if(result.value){
      this.loading = true
      this.orderService.cancelOrder(id).subscribe(data=>{
        const result:any = data
        if(result.err){
          this.loading =false
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Problème de serveur",
          })
          this.getAllOrders(this.pagination.page)
        }else{
            this.loading=false
            this.getAllOrders(this.pagination.page)
            Swal.fire({
              icon: 'success',
              title: 'Commande annulé',
              showConfirmButton: false,
              timer: 2000
            })
          }
          this.loading = false
          this.getAllOrders(this.pagination.page)
        }
      )
    }
  })


}
payOrder(id){
  this.loading = true;
  this.orderService.payOrder(id).subscribe(data=>{
    const result:any = data

    if(result.err === "error"){
      this.loading =false
      this.getAllOrders(this.pagination.page)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Order non payer a cause de problem de serveur",
      })

    }else{
      this.loading = false
      this.getAllOrders(this.pagination.page)
      Swal.fire({
        icon: 'success',
        title: 'Commande payée',
        showConfirmButton: false,
        timer: 2000
      })
    }
    this.loading = false
    this.getAllOrders(this.pagination.page)
  }
  )
  this.loading = false;
}
confirmOrder(id){
  this.loading=true
  this.orderService.confirmOrder(id).subscribe(data=>{
    const result:any = data
    if(result.err === "Invalid Quantity in the stock"){
      this.loading =false
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Order non confirmer a cause de problem de quantité dans le stock",
      })
      this.getAllOrders(this.pagination.page)
    }else if (result.err === "error"){
      this.loading = false
      this.getAllOrders(this.pagination.page)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Un problem dan le serveur",
      })
    }
    
    else{
      this.loading = false
      this.getAllOrders(this.pagination.page)
      Swal.fire({
        icon: 'success',
        title: 'Commande confirmée',
        showConfirmButton: false,
        timer: 2000
      })
    }
    this.loading = false
    this.getAllOrders(this.pagination.page)
  }

  )
  this.loading=false
}
  getOrderForFarmerById(id)
  {
    this.loading=true;
    this.orderService.getOrderForFarmerById(id).subscribe(data=>{
      const result:any = data
      this.orderDetails.owner.firstName = result.owner.firstName
      this.orderDetails.owner.lastName = result.owner.lastName
      this.orderDetails.owner.phoneNumber = result.owner.phoneNumber
      this.orderDetails.total = result.total
      this.orderDetails.orderDate = result.orderDate
      this.orderDetails.address = result.address
      this.orderDetails.paymentType = result.paymentType
      this.orderDetails.isOrderCompleted = result.isOrderCompleted
      this.orderDetails.isOrderPaid = result.isOrderPaid
      this.orderDetails.orderNumber = result.orderNumber
      this.orderDetails.id = result._id
      this.orderItems = result.items
      this.loading = false;
    })
    this.loading = false;
  }
  calculateTotalItemPrice(quantity, price){
    this.itemTotalPrice = quantity * price
  }
  goPrinter(id){
    window.open(`${this.router.url}/${id}/print`)
  }
}

