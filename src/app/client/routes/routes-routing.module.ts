import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoutesPage } from './routes.page';

import { RegisterEmployeeComponent } from '../components/register/register-employee/register-employee.component';
import { RegisterEntityComponent } from '../components/register/register-entity/register-entity.component';
import { RegisterCompanyComponent } from '../components/register/register-company/register-company.component';
import { RegisterOrganizationComponent } from '../components/register/register-organization/register-organization.component';

import { LoginEntityComponent } from '../components/login/login-entity/login-entity.component';
import { LoginCompanyComponent } from '../components/login/login-company/login-company.component';

import { SelectLoginComponent } from '../components/login/select-login/select-login.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: RoutesPage,
  },
  { path: 'registrar-empleado/:id', component: RegisterEmployeeComponent },
  { path: 'registrar-entidad', component: RegisterEntityComponent },
  { path: 'registrar-organizacion', component: RegisterOrganizationComponent },
  { path: 'registrar-empresa', component: RegisterCompanyComponent },
  { path: 'login', component: LoginEntityComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'login-empresa', component: LoginCompanyComponent },
  { path: 'tipo-entidad', component: SelectLoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoutesPageRoutingModule {}
