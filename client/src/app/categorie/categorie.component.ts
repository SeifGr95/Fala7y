import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductsService } from '../products.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';
import {environment} from "../../environments/environment"
import { empty } from 'rxjs';
@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit {
  BASE_URL=environment.BASE_URL;
  editProductForm: FormGroup

  title:string="";
  products=[];
  public loading = false;
  submitted = false;
  addToCartForm : FormGroup;

  item="";
  price=0;
  quantity=1;
  uploadProductImage;

productQuantity =0;
  productToEdit ={
    productImage: "",
    id:"",
    productName:"",
    description: "",
    quantity: 0,
    price:0,
    type:"vegetable",
    unit:"Kg"
  }
  constructor(private router:Router ,private route:ActivatedRoute,private productService:ProductsService,private cartService:CartService, public authService:AuthService, private formBuilder: FormBuilder) { }

  invalidPrice(){
    return (this.submitted && this.editProductForm.controls.price.errors != null);
  }
  invalidQuantityEdit(){
    return (this.submitted && this.editProductForm.controls.Equantity.errors != null);
  }
  invalidDescription(){
    return (this.submitted && this.editProductForm.controls.description.errors != null);
  }
  invalidProductName(){
    return (this.submitted && this.editProductForm.controls.productName.errors != null);
  }
  invalidQuantity()
  {
  	return (this.submitted && this.addToCartForm.controls.quantity.errors != null);
  }
  invalidImage(){
    return;
  }
  
  ngOnInit(): void {

    this.route.paramMap.subscribe(params=>{
      this.title = params.get('type') || ""
      this.getProducts(this.title);
    })
    
    this.cartService.getItemCount();
    this.addToCartForm = this.formBuilder.group({
      quantity: ['', [Validators.required]]
  });
  this.editProductForm = this.formBuilder.group({
    productName:['', Validators.required],
    description:['',  Validators.maxLength(32)],
    Equantity: ['', [Validators.required, Validators.min(1)]],
    price: ['', [Validators.required, Validators.min(0)]]
  })
    
  }
lastKeypress = 0
  searchProduct($event){
    if($event.timeStamp -this.lastKeypress > 200){
      this.loading=true;
      let q = $event.target.value
      this.productService.searchProduct(q).subscribe(data=>{
        const result:any = data
        this.products = result;
        this.loading=false
      })
    }
    this.lastKeypress = $event.timeStamp
  }
  clear(){
    this.item="";
    this.price=0;
    this.productQuantity=1;
  }
  public getProducts(type)
  {
    this.loading = true;
    this.productService.getPorducts().subscribe(data=>{
      const result:any = data;

      if(type!="")
      {
        
        this.products = result.products.filter(elm=>elm.type==type);
        
      }else {
        this.products = result.products;
        
      }
   
      this.loading = false;4
     })
  }
readyToEdit(id, productName, description, quantity, price, type, unit, productImage){
  this.productToEdit.id = id;
  this.productToEdit.productName = productName;
  this.productToEdit.description = description;
  this.productToEdit.quantity = quantity;
  this.productToEdit.price = price;
  this.productToEdit.type = type;
  this.productToEdit.unit = unit;
  this.productToEdit.productImage = productImage;

}
readyToCart(id,price, quantity){
this.price =price;
this.item = id;
this.productQuantity = quantity;
}
addToCart(){
  this.loading=true;
  this.submitted = true;
  if(this.addToCartForm.invalid == true)
  {
    this.loading=false
    return;
  }
  else{

    this.readyToCart(this.item,this.price, this.productQuantity)
    if(this.quantity > this.productQuantity || this.quantity < 1)
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Stock épuisé",
      })
      this.quantity = 1;
      this.getProducts(this.title)
    }else{
      this.cartService.addToCart(this.item,this.price, this.quantity).subscribe(data=>{
        const msg:any= data;
        this.loading=false;
        Swal.fire({
          icon: 'success',
          title: 'Produit ajouté au panier',
          showCancelButton: true,
          confirmButtonColor: '#11d13a',
          cancelButtonColor: '#00d1b2',
          confirmButtonText: 'Continuer à magasiner',
          cancelButtonText: 'Mon panier',
        }).then(result=>{
          if(!result.value){
            this.router.navigate(['/cart']);
          }else{
            this.getProducts(this.title)
          }
          this.cartService.countCartItem().subscribe(data=>{
            let result:any=data;
            this.cartService.setItemCount(result.cartItemCount) ;
          } )
        })
      })
    }

    this.quantity = 1;
  }

}
editProduct(){
  this.loading = true;
  this.submitted = true;
  if(this.editProductForm.invalid == true){
    this.loading =false
    return;
  }
  else{

    this.readyToEdit(this.productToEdit.id,
      this.productToEdit.productName,
      this.productToEdit.description,
      this.productToEdit.quantity,
      this.productToEdit.price,
      this.productToEdit.type,
      this.productToEdit.unit,
      this.productToEdit.productImage)

      const userID = localStorage.getItem('userID')
      
      const formData = new FormData();
      if(this.uploadProductImage){
        formData.append('productImage', this.uploadProductImage, this.uploadProductImage.name)
      }
      formData.append('productName', this.productToEdit.productName,)
      formData.append('description',this.productToEdit.description,)
      formData.append('quantity', this.productToEdit.quantity.toString())
      formData.append('price', this.productToEdit.price.toString())
      formData.append('type', this.productToEdit.type)
      formData.append('unit', this.productToEdit.unit)
      formData.append('farmer', userID)

    this.productService.editProduct(this.productToEdit.id,formData).subscribe(data=>{
      const result:any =data;

      this.getProducts(this.title);
      this.loading = false;
      Swal.fire({
        icon: 'success',
        title: 'Produit Modifier',
        showConfirmButton: false,
        timer: 1500
      })
    })
  }
}
deleteProduct(id){
  Swal.fire({
    title: 'Êtes-vous sûrs?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Oui, supprimez-le!',
    cancelButtonText: "Annuler"
  }).then((result) => {
    if (result.value) {
      this.loading = true
      this.productService.deleteProduct(id).subscribe( data=>{
        const result:any = data;
        this.getProducts(this.title);
        this.loading = false
      })
      Swal.fire(
        'Supprimé!',
        'Le produit a été supprimé.',
        'success'
      )
    }
  })
}
selectImage(event){
  if (event.target.files.length > 0){
    let file = event.target.files[0];
    this.uploadProductImage= file;
  }
}
}