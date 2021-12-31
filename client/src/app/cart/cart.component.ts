import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CartService } from '../cart.service';
import { OrderService } from '../order.service';
import {environment} from "../../environments/environment"
import Swal from 'sweetalert2';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  BASE_URL=environment.BASE_URL;
  public loading=false;
  canConfirm = false
  thereItem 
  itemQuantity = 0
  address = ""
  cartItems=[];
  cartData={
  totalprice:0,
  delivery:0
  }
  confirmOrdertForm : FormGroup;
  submitted = false;
  constructor(private cartService:CartService, private orderService:OrderService, private formBuilder: FormBuilder, private router: Router) { }
  invalidAddress()
  {
  	return (this.submitted && this.confirmOrdertForm.controls.address.errors != null);
  }  
  ngOnInit(): void {
    this.calculateTotal()
    this.getCartItems()
    this.cartService.getItemCount();
    this.confirmOrdertForm = this.formBuilder.group({
      address: ['', [Validators.required]]
  });
    this.address= localStorage.getItem('address')
    this.countCartItem()
  }
  removeItemCart(item){
    this.cartService.removeItemCart(item).subscribe(data=>{
      const msg:any=data;
      this.getCartItems()
      this.cartService.setItemCount(this.countCartItem())
    })
  }
  getCartItems()
  {
    this.loading=true;
    this.cartService.getCart().subscribe(data=>{
      const result:any=data;
      this.cartItems=result.cart.items;
      this.cartData.totalprice=result.cart.total;
      this.cartData.delivery=result.cart.deliveryPrice;
      this.calculateTotal()
      this.loading=false;
      if (this.cartData.totalprice === 5){
        this.thereItem = false
      }else{
        this.thereItem = true
      }

    })
    this.countCartItem()
  }

  calculateTotal(){
    this.cartData.totalprice = 0
    for (let item of this.cartItems){
      this.cartData.totalprice += ((item.price * item.quantity) )
    }
    this.cartData.totalprice += this.cartData.delivery

  }
  editQuantityCart(item, price, quantity, totalQuantity){
    if(quantity > totalQuantity){
      this.canConfirm = false
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Stock épuisé",
      })

    }else{
      this.canConfirm = true
      this.calculateTotal()
      const total = this.cartData.totalprice
      this.cartService.editQuantityCart(item, price, quantity, total).subscribe(data=>{
        const result:any=data
        this.getCartItems();
      })
    }


  }
addOrder(items = [], total= 0, address = ""){

    this.loading=true;
    this.getCartItems()
    items = this.cartItems
      total = this.cartData.totalprice
      address = this.confirmOrdertForm.controls['address'].value
      if(items != [] && total != 0 && address != ""){
        this.orderService.addOrder(items, total, address).subscribe(data=>{
          const result: any=data
          this.loading=false;
          Swal.fire({
            icon: 'success',
            title: 'Sweet!',
            text: 'Commande ajoutée avec succès.',
            showConfirmButton: false,
            timer: 2000
          })
          this.cartService.setItemCount(0);
          this.router.navigate(['/client/orders']);
        })

      }else{
        this.loading=false;
      }

  }
  countCartItem(){
    this.cartService.countCartItem().subscribe(data=>{
      const result:any = data;
      this.cartService.setItemCount( result.cartItemCount);
    })
  }
}
