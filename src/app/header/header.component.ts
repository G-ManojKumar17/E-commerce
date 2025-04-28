import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';  //to switch between menus of seller and user
  sellerName:string="";
  userName:string="";
  searchResult: undefined|product[];
  cartItems=0;
  constructor(private route: Router, private product:ProductService) {}

  ngOnInit(): void {
    this.route.events.subscribe((val: any) => {   //extracting value from url(route)

      if (val.url) {
        if (localStorage.getItem('seller') && val.url.includes('seller')) { //if i get seller from both localstorage and url
         let sellerStore=localStorage.getItem('seller');
         let sellerData =sellerStore && JSON.parse(sellerStore)[0];
         this.sellerName=sellerData?.name;  // to display in navbar
          this.menuType = 'seller';
        }
        else if(localStorage.getItem('user')){
          let userStore = localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName= userData.name;
          this.menuType='user';
          this.product.getCartList(userData.id);
        }
         else {
          this.menuType = 'default';
        }
      }
    });

    let cartData= localStorage.getItem('localCart');
    if(cartData){
      this.cartItems= JSON.parse(cartData).length       //updating length (on nav bar) (refreshing)
    }
    this.product.cartData.subscribe((items)=>{
      this.cartItems= items.length                       //updating length (on nav bar) (without refreshing, dinamically updating navbar)
    })
  }


  logout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/'])
  }

  userLogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth'])
    this.product.cartData.emit([])
  }

  searchProduct(query:KeyboardEvent){
    if(query){

      // console.log("iam query",query)
      const element = query.target as HTMLInputElement; //targeting entered text 
      console.log(element.value)
      this.product.searchProduct(element.value).subscribe((result)=>{ //fetching based on search value
        
        console.log(result)
        this.searchResult=result;
      })
    }
  }


  // hideSearch(){
  //   this.searchResult=undefined
  // }

  redirectToDetails(id:number){         //dropdown list of search
    this.route.navigate(['/details/'+id])
  }


  submitSearch(val:string){           //sending or redirecting to searched page
  console.warn("iam from header:",val)
  this.route.navigate([`search/${val}`]);
  }
}
