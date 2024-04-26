import { Component } from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-customer-new',
  standalone: true,
  imports: [
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './customer-new.component.html',
  styleUrl: './customer-new.component.scss'
})
export class CustomerNewComponent {
  form= new FormGroup({
    fullName: new FormControl('',[Validators.required]),
    address: new FormControl('',[Validators.required]),
    salary: new FormControl('',[Validators.required]),
    avatar: new FormControl('',[Validators.required])
  })
  loading:boolean=false;
  selectedAvatar:any;
  saveCustomer() {
    let customer={
      fullName:this.form.value.fullName,
      address:this.form.value.address,
      salary:this.form.value.salary,
      avatar:this.selectedAvatar
    }
    console.log(customer)
  }

  protected readonly onchange = onchange;

  onchangeFile(event: any) {
    this.selectedAvatar=event.target.files[0];
  }
}
