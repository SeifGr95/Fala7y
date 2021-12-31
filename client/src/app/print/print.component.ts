import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {
  public loading = false;
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
  orderItems = [];

  currentInvoiceId = ""
  constructor(private orderService:OrderService, private route:ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    this.loading=true;
    this.route.paramMap.subscribe(params=>{
      this.currentInvoiceId = params.get('invoice')
      this.getOrderForFarmerById(this.currentInvoiceId)
    })
    const footer = document.getElementById("footer")
    footer.remove()
    const header = document.getElementById("mainnav")
    header.remove()
    this.loading = false;
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
      console.log(result)
      this.loading = false;
    })
    this.loading = false;
  }
  print(){
    const impB = document.getElementById("impB")
    impB.remove()
    window.print();
    window.focus()
    window.close();
  }
}
