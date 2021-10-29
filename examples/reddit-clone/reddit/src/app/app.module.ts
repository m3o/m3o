import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CookieService } from 'ngx-cookie-service';
import { MatSliderModule } from '@angular/material/slider';
import { TimeagoModule } from 'ngx-timeago';
import { ToastrService, ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent, RegisterComponent, LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    MatSliderModule,
    ToastrModule.forRoot(),
    TimeagoModule.forRoot()
  ],
  providers: [CookieService, ToastrService],
  bootstrap: [AppComponent],
})
export class AppModule {}
