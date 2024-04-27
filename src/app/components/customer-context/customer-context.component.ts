import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-customer-context',
  standalone: true,
  imports: [
    RouterOutlet,
    MatTabGroup,
    MatTab,
    RouterLink
  ],
  templateUrl: './customer-context.component.html',
  styleUrl: './customer-context.component.scss'
})
export class CustomerContextComponent {

}
