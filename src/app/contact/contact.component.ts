import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  constructor(private http: HttpClient) {}

  onSubmit(form: any) {
    this.http.post('https://formspree.io/f/xpwqdnbb', form.value).subscribe({
      next: (response) => {
        alert('Your message has been sent!');
      },
      error: (error) => {
        alert('There was an error sending your message.');
      }
    });
  }
}
