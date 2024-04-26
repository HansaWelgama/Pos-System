import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-customer-context',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './customer-context.component.html',
  styleUrl: './customer-context.component.scss'
})
export class CustomerContextComponent {

}
