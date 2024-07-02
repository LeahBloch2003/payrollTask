import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalaryCalculatorComponent } from './components/salary-calculator/salary-calculator.component';
import { SalaryDisplayComponent } from './components/salary-display/salary-display.component'; 


const routes: Routes = [ 
  //redirects any empty pathto the salary-calculator
  { path: '', redirectTo: '/salary-calculator', pathMatch: 'full' },
  { path: 'salary-calculator', component: SalaryCalculatorComponent },
  { path: 'salary-display', component: SalaryDisplayComponent } ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
