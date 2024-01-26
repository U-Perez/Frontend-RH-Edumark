import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterEmployeeComponent } from './register/register-employee/register-employee.component';
import { RegisterEntityComponent } from './register/register-entity/register-entity.component';
import { RegisterOrganizationComponent } from './register/register-organization/register-organization.component';
import { RegisterCompanyComponent } from './register/register-company/register-company.component';

import { LoginEmployeeComponent } from './login/login-employee/login-employee.component';
import { LoginEntityComponent } from './login/login-entity/login-entity.component';
import { LoginCompanyComponent } from './login/login-company/login-company.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { SelectLoginComponent } from './login/select-login/select-login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [
    RegisterEmployeeComponent,
    RegisterEntityComponent,
    RegisterOrganizationComponent,
    RegisterCompanyComponent,
    LoginEmployeeComponent,
    LoginEntityComponent,
    LoginCompanyComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SelectLoginComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: [LoginEmployeeComponent, LoginEntityComponent],
})
export class ClientComponentsModule {}
