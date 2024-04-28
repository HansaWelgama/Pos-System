import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import {CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatSelect} from "@angular/material/select";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatLabel} from "@angular/material/form-field";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  imports: [
    NgForOf,
    MatOption,
    MatSelect,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CurrencyPipe,
    MatChip,
    MatChipSet,
    MatInput,
    MatButton,
    MatIcon,
    MatIconButton
  ],
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  form: FormGroup;
  customers: any[] = [];
  selectedCustomer: any;
  products: any[] = [];
  selectedProduct: any;
  cartItems: any[] = [];

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      customer: ['', Validators.required],
      product: ['', Validators.required],
      productQuantity: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.db.collection('customers').get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.customers.push({ id: doc.id, data: doc.data() });
      });
    });
    this.db.collection('products').get().subscribe(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.products.push({ id: doc.id, data: doc.data() });
      });
    });
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
  }

  addToCart() {
    if (this.form.valid && this.selectedCustomer && this.selectedProduct) {
      const customer = this.selectedCustomer.data;
      const product = this.selectedProduct.data;
      const quantity = this.form.get('productQuantity')?.value || 0;
      const totalCost = quantity * product.unitPrice;

      const cartItem = {
        customerName: customer.fullName,
        productName: product.productDescription,
        quantity: quantity,
        totalCost: totalCost
      };

      this.cartItems.push(cartItem);

      this.form.reset();
    }
  }
}
