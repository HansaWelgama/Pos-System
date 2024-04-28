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
      const productId = this.selectedProduct.id; // Get the product ID from Firestore
      const product = this.selectedProduct.data; // Get the product data
      const quantityToAdd = this.form.get('productQuantity')?.value || 0;

      // Check if there is enough quantity available
      if (quantityToAdd <= product.quantityOnHand) {
        const totalCost = quantityToAdd * product.unitPrice;

        // Update product quantity locally
        product.quantityOnHand -= quantityToAdd;

        // Update product quantity in Firestore
        this.db.collection('products').doc(productId).update({
          quantityOnHand: product.quantityOnHand
        })
          .then(() => {
            console.log('Product quantity updated in Firestore.');

            // Check if the same product for the same customer already exists in the cart
            const existingCartItemIndex = this.cartItems.findIndex(item =>
              item.customerName === customer.fullName && item.productName === product.productDescription
            );

            if (existingCartItemIndex !== -1) {
              // If product already exists in cart for the same customer, update its quantity and total cost
              this.cartItems[existingCartItemIndex].quantity += quantityToAdd;
              this.cartItems[existingCartItemIndex].totalCost += totalCost;
            } else {
              // If product doesn't exist in cart for the same customer, add it as a new item
              const cartItem = {
                customerName: customer.fullName,
                productName: product.productDescription,
                quantity: quantityToAdd,
                totalCost: totalCost
              };

              this.cartItems.push(cartItem);
            }

            // Reset form and selected product
            this.form.reset();
            this.selectedProduct = null;
          })
          .catch(error => {
            console.error("Error updating product quantity:", error);
            // Handle error updating product quantity
            alert("Error updating product quantity. Please try again later.");
          });
      } else {
        // Notify user that there is not enough quantity available
        alert('Not enough quantity available for this product.');
      }
    }
  }

}

