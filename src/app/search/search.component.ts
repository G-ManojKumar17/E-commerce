import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResult:undefined|product[] //fetched search result will be stored here
  constructor(private activeRoute: ActivatedRoute, private product:ProductService) { }

  ngOnInit(): void {
    let query = this.activeRoute.snapshot.paramMap.get('query');  //fetching query from url
    console.warn("From search page",query);                       //debugging
    query && this.product.searchProduct(query).subscribe((result)=>{  //fetching data form api (from services)
      this.searchResult=result;
      
    })
    

  }

}
