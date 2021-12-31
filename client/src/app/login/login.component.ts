import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  err = ""
  loginerr =false;
  logged = false;
	submitted = false;
	loginForm: FormGroup;
  public loading = false;
  constructor( private route: ActivatedRoute, private formBuilder: FormBuilder,private authService:AuthService, private router: Router ) { }

  invalidEmailPassword()
  {
  	return (this.submitted && this.loginForm.controls.email.errors != null) || (this.submitted && this.loginForm.controls.psw.errors != null);
  }  
  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      psw: ['', [Validators.required, Validators.minLength(8)]],
  });
 
  }

  
  emailPassWrong(){
    if(this.err)
    return true
  }
  public isAuthFarmer() : Boolean {
    let isfarmer = localStorage.getItem('farmer')
    if(isfarmer === "true" ){
      return this.authService.isFarmer = true
    }
    return this.authService.isFarmer = false
  }
  onSubmitLogin()
  {
  	this.submitted = true;

  	if(this.loginForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
       this.loading=true;
      this.authService.authUser(this.loginForm.controls['email'].value,this.loginForm.controls['psw'].value).subscribe(data=>{
      let result:any=data ;
      this.err = result.err
      if(!result.err){
        if(result.token!=null && result.token!=undefined)
        {
          this.logged = true;

          localStorage.setItem('token',result.token);
          localStorage.setItem('userID',result.user._id);
          localStorage.setItem('farmer',result.user.isFarmer);
          localStorage.setItem('cartID', result.user.cart)
          localStorage.setItem('address', result.user.address)
          this.authService.isAuth= true;
          if(this.isAuthFarmer()){
            this.router.navigate(['/farmer/orders']);
          }else{
            this.router.navigate(['/category']);
          } 
          
          this.loading=false;
          Swal.fire({
            title: 'Bienvenue '+ result.user.firstName + " "+ result.user.lastName + ", chez Fale7y",
            showClass: {
              popup: 'animated fadeInDown faster'
            },
            hideClass: {
              popup: 'animated fadeOutUp faster'
            },
            showConfirmButton: false,
            timer: 2500
          })
        }
      else{
        this.loading=false;
        Swal.fire({
          icon: 'error',
          title: 'Token invalide',
        })
      }
  	}else{
      this.loading = false
      Swal.fire({
        icon: 'error',
        title: 'Quelque chose a mal tourné!',
        text: "Adresse mail ou mot de passe incorrect.",
      })
    }
    this.loading = false
  })
}
}
}
