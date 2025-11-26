import { Component } from '@angular/core';
import { ShoppingCart } from "../../components/shopping-cart/shopping-cart";

@Component({
  selector: 'app-cart',
  imports: [ShoppingCart],
  templateUrl: './cart.html',
})
export class Cart {

}
