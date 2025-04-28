import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ecomm-project';
  isLoading = true;

  constructor() {}

//   ngOnInit() {
//     this.startLoader(); // Call the function when the page loads
//   }

//   startLoader() {
//     console.log('Page is loading...');
//     setTimeout(() => {
//       this.isLoading = false;
//       console.log('Loader stopped after 3 seconds');
//     }, 3000);
//   }
 }


