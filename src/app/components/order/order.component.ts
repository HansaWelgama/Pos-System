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
  tableLoaded: boolean= false;
  orderPlaced: boolean = false
  placeOrderPressed: boolean = false;


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
      const quantityToAdd = this.form.get('productQuantity')?.value || 0;

      if (quantityToAdd <= product.quantityOnHand) {
        const totalCost = quantityToAdd * product.unitPrice;

        // Update the local cartItems array
        const cartItem = {
          customerName: customer.fullName,
          productName: product.productDescription,
          quantity: quantityToAdd,
          totalCost: totalCost
        };

        this.cartItems.push(cartItem);
        this.snackbarService.open('Added item to the cart!', 'Close', {
          duration: 5000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          direction: 'ltr'
        });
        this.tableLoaded = true;
        this.placeOrderPressed = true;

      } else {
        alert('Not enough quantity available for this product.');
      }
    }
  }

  placeOrder() {


    this.tableLoaded = false;
    this.orderPlaced = true;
    if (this.form.valid && this.selectedCustomer && this.selectedProduct) {
      const customerId = this.selectedCustomer.id;
      const productId = this.selectedProduct.id;
      const customer = this.selectedCustomer.data;
      const product = this.selectedProduct.data;
      const quantityToAdd = this.form.get('productQuantity')?.value || 0;

      if (quantityToAdd <= product.quantityOnHand) {
        const totalCost = quantityToAdd * product.unitPrice;

        product.quantityOnHand -= quantityToAdd;
        customer.salary -= totalCost;

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
              totalCost: totalCost,
              orderDate: new Date()
            };

            // Add cartItem directly to Firestore
            if (quantityToAdd>0) {
              this.db.collection('orders').add(cartItem)
                .then(() => {
                  console.log('Cart item added to Firestore.');
                  this.snackbarService.open('Order Successful!', 'Close', {
                    duration: 5000,
                    verticalPosition: 'top',
                    horizontalPosition: 'center',
                    direction: 'ltr'
                  });
                  this.cartItems = [];
                  this.form.reset();
                  this.selectedProduct = null;
                  // Reset flags
                  this.placeOrderPressed = false;
                  this.orderPlaced = false;
                  // Disable the table after placing the order
                })
                .catch((error: any) => {
                  console.error('Error adding cart item to Firestore:', error);
                  alert('Error adding cart item to Firestore. Please try again later.');
                });

            }else{
              alert('Cannot place an order with an empty cart. Please add items to your cart.');
              this.cartItems = [];
              this.form.reset();
              this.selectedProduct = null;
              // Reset flags
              this.placeOrderPressed = false;
              this.orderPlaced = false;
              return; // Exit the function if the cart is empty
            }
          })
          .catch(error => {
            console.error('Error updating product quantity:', error);
            alert('Error updating product quantity. Please try again later.');
          });
      } else {
        alert('Not enough quantity available for this product.');
      }
    } else {
      alert('Please fill in all required fields.');
    }
  }

  deleteCartItem(index: number) {
    if (!this.orderPlaced) {
      this.cartItems.splice(index, 1);
      if (this.cartItems.length === 0) {
        this.placeOrderPressed = false; // Reset cartNotEmpty when cart is empty
      }
    }
  }
}

