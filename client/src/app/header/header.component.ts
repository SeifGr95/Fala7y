import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ProductsService } from '../products.service';
import { not, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import Swal from 'sweetalert2';
import {environment} from '../../environments/environment'
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  public cartItemCount = 0;
  BASE_URL = environment.BASE_URL
  uploadProductImage
  public unit = "Kg"
  public type = "légumes"
  productResult :any
  err = ""
	submitted = false;
	addProductForm: FormGroup;
  public loading = false;
  constructor(private productService:ProductsService, private route: ActivatedRoute, private formBuilder: FormBuilder ,public authService:AuthService,private router :Router, public cartService:CartService) { }
  invalidImage(){
    return;
  }
  invalidPrice(){

  return (this.submitted && this.addProductForm.controls.price.errors != null);

}
invalidQuantity(){
  return (this.submitted && this.addProductForm.controls.quantity.errors != null);
}
invalidDescription(){
  return (this.submitted && this.addProductForm.controls.description.errors != null);
}
invalidProductName(){
  return (this.submitted && this.addProductForm.controls.productName.errors != null);
}

  ngOnInit(): void {
    this.addProductForm = this.formBuilder.group({
      productName:['', Validators.required],
      description:['',  Validators.maxLength(32)],
      quantity: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]]
  });
  this.countCartItem()
  this.cartService.setItemCount(this.cartItemCount);
  }
addProduct(){
    this.submitted = true;

  	if(this.addProductForm.invalid == true)
  	{

  		return false;
  	}
  	else{
      this.loading=true;
      const userID = localStorage.getItem('userID')
      const formData = new FormData();
      formData.append('productImage', this.uploadProductImage, this.uploadProductImage.name)
      formData.append('productName',this.addProductForm.controls['productName'].value )
      formData.append('description', this.addProductForm.controls['description'].value)
      formData.append('quantity', this.addProductForm.controls['quantity'].value)
      formData.append('price', this.addProductForm.controls['price'].value)
      formData.append('type', this.type)
      formData.append('unit', this.unit)
      formData.append('farmer', userID)
      this.productService.addProduct(formData).subscribe(data=>{
        const result:any = data
        this.productResult = result
        this.err = result.err_message
        if(!result.err_message){
          this.loading=false;
          Swal.fire({
            title: 'Sweet!',
            text: 'Produit ajouté avec succés',
            imageUrl: this.BASE_URL+'/product/image/'+ this.productResult.productImage,
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: 'Custom image',
          })
          this.clear()
        }else{
          this.loading=false
          Swal.fire({
            icon: 'error',
            title: 'Quelque chose a mal tourné!',
            text: this.err,
          })
        }
      })
    }
}
  logout()
  {
    this.loading=true;
    localStorage.clear();
    this.authService.isAuth=false ;
    this.authService.isFarmer = false;
    this.router.navigate(['/']);
    this.loading=false;
  }
  clear(){
      this.addProductForm.controls['productName'].setValue('')
      this.addProductForm.controls['description'].setValue('')
      this.addProductForm.controls['quantity'].setValue(1)
      this.addProductForm.controls['price'].setValue(0)
  }
  selectImage(event){
    if (event.target.files.length > 0){
      const file = event.target.files[0];
      this.uploadProductImage= file;
    }
  }

  countCartItem(){
    this.cartService.countCartItem().subscribe(data=>{
      const result:any = data;
      this.cartService.setItemCount( result.cartItemCount);
    })
  }
}


