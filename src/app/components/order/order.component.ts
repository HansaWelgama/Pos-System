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
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFireDatabase} from "@angular/fire/compat/database";

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
    private fb: FormBuilder,
    private snackbarService: MatSnackBar,
    private firebaseDB: AngularFireDatabase
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
    this.loadCartItems();
  }
  loadCartItems() {
    if (this.selectedCustomer) {
      this.db.collection('cartItems', ref => ref.where('customerId', '==', this.selectedCustomer.id))
        .valueChanges().subscribe((data: any) => {
        this.cartItems = data;
      });
    } else {
      // If no customer is selected, load all cart items
      this.db.collection('cartItems').valueChanges().subscribe((data: any) => {
        this.cartItems = data;
      });
    }
  }
  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.loadCartItems();
  }

  selectProduct(product: any) {
    this.selectedProduct = product;
  }
  addToCart() {
    if (this.form.valid && this.selectedCustomer && this.selectedProduct) {
      const customerId = this.selectedCustomer.id;
      const productId = this.selectedProduct.id;
      const customer = this.selectedCustomer.data;
      const product = this.selectedProduct.data;
      const quantityToAdd = this.form.get('productQuantity')?.value || 0;

      if (quantityToAdd <= product.quantityOnHand) {
        const totalCost = quantityToAdd * product.unitPrice;

        product.quantityOnHand -= quantityToAdd;

        this.db.collection('products').doc(productId).update({
          quantityOnHand: product.quantityOnHand
        })
          .then(() => {
            console.log('Product quantity updated in Firestore.');

            const cartItem = {
              customerId: customerId,
              productId: productId,
              customerName: customer.fullName,
              productName: product.productDescription,
              quantity: quantityToAdd,
              totalCost: totalCost
            };

            // Add cartItem directly to Firestore
            this.db.collection('cartItems').add(cartItem)
              .then(() => {
                console.log('Cart item added to Firestore.');
              })
              .catch((error: any) => {
                console.error('Error adding cart item to Firestore:', error);
              });

            this.form.reset();
            this.selectedProduct = null;
          })
          .catch(error => {
            console.error("Error updating product quantity:", error);
            alert("Error updating product quantity. Please try again later.");
          });
      } else {
        alert('Not enough quantity available for this product.');
      }
    }
  }
}
