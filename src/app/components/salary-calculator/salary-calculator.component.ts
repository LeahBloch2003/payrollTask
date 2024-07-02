import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { SalaryService } from '../../services/salary.service';
import { Router } from '@angular/router';
import { SalaryCalculationRequest } from '../../models/salaryCalculationRequest.model';

@Component({
  selector: 'app-salary-calculator',
  templateUrl: './salary-calculator.component.html',
  styleUrls: ['./salary-calculator.component.css']
})
export class SalaryCalculatorComponent implements OnInit {

  salaryForm!: FormGroup;
  //filling arrays that provide drop-down options for different choices
  partTimeJobOptions = [
    { label: '100%', value: '100%' },
    { label: '75%', value: '75%' },
    { label: '50%', value: '50%' }
  ];

  professionalLevelOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Experienced', value: 'experienced' }
  ];

  managementLevelOptions = [
    { label: 'None', value: 'none' },
    { label: 'Management Level 1', value: 'management level 1' },
    { label: 'Management Level 2', value: 'management level 2' },
    { label: 'Management Level 3', value: 'management level 3' },
    { label: 'Management Level 4', value: 'management level 4' }
  ];

  overtimeEligibleOptions = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];

  overtimeGroupOptions = [
    { label: 'Group A', value: 'group A' },
    { label: 'Group B', value: 'group B' }
  ];

  constructor(private fb: FormBuilder,
    private salaryService: SalaryService,
    private router: Router) { }

  ngOnInit() {
    this.salaryForm = this.fb.group({
      partTimeJob: [null, Validators.required],
      professionalLevel: [null, Validators.required],
      managementLevel: [null, Validators.required],
      yearsOfSeniority: [null, [Validators.required, Validators.min(0)]],
      overtimeEligible: [null, Validators.required],
      overtimeGroup: [null, this.validateOvertimeGroup.bind(this)]
    });
    this.salaryForm.get('overtimeEligible')?.valueChanges.subscribe(() => {
      this.salaryForm.get('overtimeGroup')?.updateValueAndValidity();
    });
  }
  //custom validation for field content
  validateOvertimeGroup(control: AbstractControl): ValidationErrors | null {
    const overtimeEligible = control.parent?.get('overtimeEligible')?.value;
    const overtimeGroup = control.value;

    if (overtimeEligible === 'yes' && !overtimeGroup) {
      return { required: true };
    }

    return null;
  }

  isOvertimeEligible() {
    return this.salaryForm.get('overtimeEligible')?.value?.value === 'yes';
  }

  calculateSalary() {
    if (this.salaryForm.valid) {
      //creates a request object from arrays of form fields to process.
      let req: SalaryCalculationRequest = {
        partTimeJob: this.salaryForm.get('partTimeJob')?.value.value,
        professionalLevel: this.salaryForm.get('professionalLevel')?.value.value,
        managementLevel: this.salaryForm.get('managementLevel')?.value.value,
        yearsOfSeniority: this.salaryForm.get('yearsOfSeniority')?.value,
        overtimeEligible: this.salaryForm.get('overtimeEligible')?.value.value,
        overtimeGroup: this.isOvertimeEligible() ? this.salaryForm.get('overtimeGroup')?.value?.value : ''
      };
      //sending user input to the server and receiving computed data
      this.salaryService.calculateSalary(req).subscribe(
        response => {
          console.log('Salary calculation response:', response);
          this.router.navigate(['/salary-display'], { state: { salaryResponse: response, formData: this.salaryForm.value } });
        },
        error => {
          console.error('Error calculating salary:', error);
        }
      );
    } else {
      console.error('Form is invalid. Cannot calculate salary.');
    }
  }
}

