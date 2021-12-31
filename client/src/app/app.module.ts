import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ContactComponent } from './contact/contact.component';
import { CategorieComponent } from './categorie/categorie.component';
import { CartComponent } from './cart/cart.component';
import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxLoadingModule } from 'ngx-loading';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ProductsService } from './products.service';
import { CartService } from './cart.service';
import { AuthGuard } from './auth.guard';
import { VerifGuard } from './verif.guard';
import { OrderComponent } from './order/order.component';
import { OrderReviewComponent } from './order-review/order-review.component';
import { MomentModule } from 'ngx-moment';
import {NgxPrintModule} from 'ngx-print';
import { PrintComponent } from './print/print.component';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    CategorieComponent,
    CartComponent,
    InfoComponent,
    LoginComponent,
    RegisterComponent,
    OrderComponent,
    OrderReviewComponent,
    PrintComponent,
  ],
  imports: [    
    MomentModule.forRoot({
    relativeTimeThresholdOptions: {
      'm': 59
    }
  }),
    SweetAlert2Module.forRoot(),
    NgxLoadingModule.forRoot({}),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPrintModule,
  ],
  providers: [AuthService,ProductsService,CartService,AuthGuard,VerifGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
