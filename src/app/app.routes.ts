import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {DashboardHomeComponent} from "./components/dashboard-home/dashboard-home.component";
import {CustomerContextComponent} from "./components/customer-context/customer-context.component";
import {CustomerNewComponent} from "./components/customer-context/inner/customer-new/customer-new.component";
import {CustomerAllComponent} from "./components/customer-context/inner/customer-all/customer-all.component";
import {CustomerUpdateComponent} from "./components/customer-context/inner/customer-update/customer-update.component";
import {ProductListComponent} from "./components/product-list/product-list.component";
import {OrderComponent} from "./components/order/order.component";

export const routes: Routes = [
  {path:'', redirectTo:'/dashboard/home', pathMatch:'full'},

  {path:'dashboard', component:DashboardComponent, children:[
      {path:'', redirectTo:'/dashboard/home', pathMatch:'full'},
      {path:'home', component:DashboardHomeComponent},
      {path:'customers', component:CustomerContextComponent, children:[
          {path:'', redirectTo:'/dashboard/customers/new', pathMatch:'full'},
          {path:'new', component:CustomerNewComponent},
          {path:'update/:id', component:CustomerUpdateComponent},
          {path:'list', component:CustomerAllComponent},

        ]
      },
      {path:'products', component:ProductListComponent},
      {path:'order', component:OrderComponent}
    ]
  }
];
