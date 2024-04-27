import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CommonModule, CurrencyPipe} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-customer-all',
  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    MatIcon,
    MatIconButton,
    RouterLink,
  ],
  templateUrl: './customer-all.component.html',
  styleUrl: './customer-all.component.scss'
})
export class CustomerAllComponent implements OnInit{
    customers:any[]=[];
    constructor(private  db:AngularFirestore) {
    }
    ngOnInit(): void {
      this.db.collection('customers').get().subscribe(querySnapshot=>{
        querySnapshot.forEach(doc=>{
          this.customers.push({id:doc.id, data:doc.data()});

        })
        console.log(this.customers)
      });
    }

}
