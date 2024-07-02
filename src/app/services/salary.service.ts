import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SalaryCalculationRequest } from '../models/salaryCalculationRequest.model';
import { SalaryCalculationResponse } from '../models/SalaryCalculationResponse.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryService {

  private apiUrl = 'http://localhost:5204/api/SalaryCalculator';

  constructor(private http: HttpClient) { }

  calculateSalary(salaryData: SalaryCalculationRequest): Observable<SalaryCalculationResponse> {
    //ensures that the server correctly interprets the incoming data format
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //enables sending data in the body of the HTTP request
    return this.http.post<SalaryCalculationResponse>(this.apiUrl, salaryData, {headers});
  }
}
