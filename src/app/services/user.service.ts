import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { login, signUp } from '../data-type';

@Injectable({
  providedIn: 'root'
})


export class UserService {
invalidUserAuth= new EventEmitter<boolean>(false)
  constructor(private http: HttpClient, private router:Router) { }


  userSignUp(user:signUp){        //userSignup Logic (post)
   this.http.post('http://localhost:3000/users',user,{observe:'response'})
   .subscribe((result)=>{
    if(result){
      localStorage.setItem('user',JSON.stringify(result.body));
      this.router.navigate(['/']);
    }
    
   })
    
  }

  userLogin(data:login){              //login Logic (get)
    this.http.get<signUp[]>(`http://localhost:3000/users?email=${data.email}&password=${data.password}`,
    {observe:'response'}
    ).subscribe((result)=>{
      if(result && result.body?.length){
        localStorage.setItem('user',JSON.stringify(result.body[0]));    //set user to local storage 
        this.router.navigate(['/']);
        this.invalidUserAuth.emit(false)
      }else{
        this.invalidUserAuth.emit(true)
      }

      // console.log(result)      //debugging
    })
  }

  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }
}
