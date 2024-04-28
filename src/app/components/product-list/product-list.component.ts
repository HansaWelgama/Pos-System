import { Component } from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    RouterLink
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  products:any[]=[];
  constructor(private  db:AngularFirestore, private storage:AngularFireStorage) {
  }
  ngOnInit(): void {
    this.db.collection('products').get().subscribe(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        this.products.push({id:doc.id, data:doc.data()});

      })
      console.log(this.products)
    });
  }
}
