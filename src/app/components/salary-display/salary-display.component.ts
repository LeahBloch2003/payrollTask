import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryCalculationResponse } from '../../models/SalaryCalculationResponse.model';

@Component({
  selector: 'app-salary-display',
  templateUrl: './salary-display.component.html',
  styleUrls: ['./salary-display.component.css']
})
export class SalaryDisplayComponent implements OnInit {
  
  salaryResponse!: SalaryCalculationResponse;
  formData!: { [key: string]: any };

  constructor(private router: Router) {
    //handling data transfer between routed components.
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.salaryResponse = navigation.extras.state['salaryResponse'] as SalaryCalculationResponse;
      this.formData = navigation.extras.state['formData'];
    }
  }

  ngOnInit(): void {
    console.log('Received salary data:', this.salaryResponse);
    console.log('Received form data:', this.formData);
  }

  getSalaryResponseDetails(): { key: string, value: any }[] {
    if (!this.salaryResponse) {
      return [];
    }
    return Object.entries(this.salaryResponse).map(([key, value]) => ({ key, value }));
  }

  getFormDetails(): { key: string, value: any }[] {
    if (!this.formData) {
      return [];
    }
    return this.flattenObject(this.formData);
  }
  
  //converting the data structure of the form to an array of key-value pairs, 
//to display it in an organized and readable way.
  flattenObject(obj: any, prefix: string = ''): { key: string, value: any }[] {
    let flattened: { key: string, value: any }[] = [];
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key;
        let value = obj[key];
        if (typeof value === 'object' && value !== null) {
          if (value.hasOwnProperty('label') && value.hasOwnProperty('value')) {
            value = value.value;
          } else {
            flattened = flattened.concat(this.flattenObject(value, newKey));
            continue;
          }
        }

        flattened.push({ key: newKey, value });
      }
    }

    return flattened;
  }

  goBack(): void {
    this.router.navigate(['/salary-calculator']);
  }
}



