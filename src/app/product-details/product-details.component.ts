import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cart, product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productData: undefined | product;
  productQuantity: number = 1;     //for +/-
  removeCart = false;
  cartData: product | undefined;
  constructor(private activeRoute: ActivatedRoute, private product: ProductService) { }

  ngOnInit(): void {


    //to display product details
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    console.warn("Id warning", productId);


    productId && this.product.getProduct(productId).subscribe((result) => {   //fetching data from  api
      this.productData = result;   //details to display in html


      let cartData = localStorage.getItem('localCart');

      //to display removecart option or not   (for local storage)
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) => productId === item.id.toString());
        if (items.length) {
          this.removeCart = true      //to show remove cart
        } else {
          this.removeCart = false     //to show add cart
        }
      }

      //to display removecart option or not   (for global storage)
      let user = localStorage.getItem('user');
      if (user) {
        let userId = user && JSON.parse(user).id;
        this.product.getCartList(userId);

        this.product.cartData.subscribe((result) => {
          let item = result.filter((item: product) => productId?.toString() === item.productId?.toString())
          if (item.length) {
            this.cartData = item[0];
            this.removeCart = true;
          }
        })
      }



    })

  }

  //for increament and decreament 
  handleQuantity(val: string) {       //for +/-
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  //to add data to cart (Local Storage)
  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true
      } else {    //to add data to cart (global Storage)

        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;

        console.log("to check:",this.productData)
        let cartData: cart = {
          ...this.productData,
          productId: this.productData.id,
          userId
        }
        console.log(cartData)
        delete cartData.id; 
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true
            // console.log("in cart added")       //debugging
          }
        })
      }

    }
  }

  //to remove data from cart (local storage)
  removeToCart(productId: number) {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId)
    } else {    //to remove data from cart (global storage)

      console.warn("cartData", this.cartData);

      this.cartData && this.product.removeToCart(this.cartData.id)
        .subscribe((result) => {
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId)
        })
    }
    this.removeCart = false
  }


}
