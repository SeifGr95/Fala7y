import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ContactComponent } from './contact/contact.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CartComponent } from './cart/cart.component';
import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './auth.guard';
import { VerifGuard } from './verif.guard';
import { OrderComponent } from './order/order.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { AdminGuard } from './admin.guard';
import { PrintComponent } from './print/print.component';


const routes: Routes = [
  {
    path:'',
    component:MainComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'info',
    component:InfoComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'contact',
    component:ContactComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'register',
    component:RegisterComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'login',
    component:LoginComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'category',
    component:CategorieComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'category/:type',
    component:CategorieComponent,
    canActivate:[VerifGuard, AdminGuard]
  },
  {
    path:'cart',
    component:CartComponent,
    canActivate:[VerifGuard,AuthGuard, AdminGuard]
  },
  {
    path:'client/orders',
    component:OrderComponent,
    canActivate:[VerifGuard,AuthGuard, AdminGuard]
  },
  {
    path:'farmer/orders',
    component:OrderReviewComponent,
    canActivate:[VerifGuard,AuthGuard, AdminGuard]
  },
  {
    path:'farmer/orders/:invoice/print',
    component:PrintComponent,
    canActivate:[VerifGuard,AuthGuard, AdminGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
