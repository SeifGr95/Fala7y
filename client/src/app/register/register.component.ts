import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import  Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  err = ""
  public loading = false;
  registered = false;
	submitted = false;
  registerForm: FormGroup;
  constructor( private route: ActivatedRoute, private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }
  invalidFirstName()
  {
  	return (this.submitted && this.registerForm.controls.firstName.errors != null);
  }

  invalidLastName()
  {
  	return (this.submitted && this.registerForm.controls.lastName.errors != null);
  }
  invalidUserName()
  {
  	return (this.submitted && this.registerForm.controls.userName.errors != null);
  }

  invalidEmail()
  {
  	return (this.submitted && this.registerForm.controls.email.errors != null);
  }

  invalidPhoneNumber()
  {
  	return (this.submitted && this.registerForm.controls.phoneNumber.errors != null);
  }
  invalidAddress()
  {
  	return (this.submitted && this.registerForm.controls.address.errors != null);
  }

  invalidPassword()
  {
  	return (this.submitted && this.registerForm.controls.psw.errors != null);
  }
  invalidPassword2()
  {
    return (this.submitted && this.registerForm.controls.psw2.errors != null);
  }

  passwordMatch(){
    if(this.registerForm.controls['psw'].value !== this.registerForm.controls['psw2'].value){
      return false;
    }else{
      return true;
    }
    
  }
  emailExist(){
    if(this.err)
    return true
  }
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName:['', Validators.nullValidator],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['',Validators.required],
      address: ['', Validators.required],
      psw: ['', [Validators.required, Validators.minLength(8)]],
      psw2: ['', [Validators.required, Validators.minLength(8)]],
  });
}
onSubmitRegister()
{

  this.submitted = true;

  if(this.registerForm.invalid == true)
  {
    return false;
  }
  else
  {
    this.registered = true;
    this.loading=true;

    this.authService.registerUser(
    this.registerForm.controls['firstName'].value,
    this.registerForm.controls['lastName'].value,
    this.registerForm.controls['email'].value,
    this.registerForm.controls['userName'].value,
    this.registerForm.controls['psw'].value,
    this.registerForm.controls['phoneNumber'].value,
    this.registerForm.controls['address'].value).subscribe(data=>{
      let result:any=data;
      this.err = result.err
      if(!result.err){
        this.loading=false
        Swal.fire({
          icon: 'success',
          title: 'Vous êtes devenus un membre de Fale7y, happy shopping :)',
          showConfirmButton: false,
          timer: 2500
        })
          this.router.navigate(['/login'])
      }else{
        this.loading=false
        Swal.fire({
          icon: 'error',
          title: 'Quelque chose a mal tourné!',
          text: this.err,
        })
      }
      this.loading=false
    })
  }
}
}
