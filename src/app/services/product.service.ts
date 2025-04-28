import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { cart, order, product } from '../data-type';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cartData = new EventEmitter<product[] | []>();
  constructor(private http: HttpClient) { }
  
  addProduct(data: product) {
    return this.http.post('http://localhost:3000/products', data);
  }
  productList() {
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  deleteProduct(id: number) {
    return this.http.delete(`http://localhost:3000/products/${id}`);
  }

  getProduct(id: string) {
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product: product) {
    return this.http.put<product>(
      `http://localhost:3000/products/${product.id}`,
      product
    );
  }

  //curosur (Home) 
  popularProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=4');
  }

  //product card (home)
  trendyProducts() {
    return this.http.get<product[]>('http://localhost:3000/products?_limit=8');
  }

  searchProduct(query: string) {
    return this.http.get<product[]>( `http://localhost:3000/products?category=${query}`
    );
  }

  //cart (local storage)
  localAddToCart(data: product) {
    let cartData = [];
    let localCart = localStorage.getItem('localCart');
    if (!localCart) {                     //if data no present in local storage (previous data)
      localStorage.setItem('localCart', JSON.stringify([data]));
      this.cartData.emit([data]);
    } else {                            //if data present in local storage (previous data) the
      cartData = JSON.parse(localCart); //add it in cartData
      cartData.push(data);              //push data from productdetail
      localStorage.setItem('localCart', JSON.stringify(cartData));      //saved in local storage
      this.cartData.emit(cartData);      //emmiting
    }
  }

  //cart (local storage)
  removeItemFromCart(productId: number) {
    let cartData = localStorage.getItem('localCart');
    if (cartData) {
      console.log("from services",cartData)
      let items: product[] = JSON.parse(cartData);
      items = items.filter((item: product) => productId !== item.id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);      //to update nav dynamically
    }
  }

  //adding product data to cart
  addToCart(cartData: cart) {
    return this.http.post('http://localhost:3000/cart', cartData);
  }


  //to update cart no. in nav bar
  getCartList(userId: number) {
    return this.http
      .get<product[]>('http://localhost:3000/cart?userId=' + userId, {observe: 'response', })
      .subscribe((result) => {
        if (result && result.body) {
          // console.log("iam emmiting")
          this.cartData.emit(result.body); //emmiting here
        }
      });
  }

  //remove from cart
  removeToCart(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId);
  }

  currentCart() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:3000/cart?userId=' + userData.id);
  }

  orderNow(data: order) {
    return this.http.post('http://localhost:3000/orders', data);
  }
  orderList() {
    let userStore = localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:3000/orders?userId=' + userData.id);
  }

  deleteCartItems(cartId: number) {
    return this.http.delete('http://localhost:3000/cart/' + cartId).subscribe((result) => {
      this.cartData.emit([]);
    })
  }

  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:3000/orders/'+orderId)

  }

}
