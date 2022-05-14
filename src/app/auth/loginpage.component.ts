import { GlobalConstants } from './../common/global-constants';
import { Router } from '@angular/router';
import { AuthService } from './../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, filter } from 'rxjs';
import { User } from './user.model';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginPageComponent implements OnInit {
  LoginForm: FormGroup;
  incorrectLogin  = false;
  constructor(private formBuilder: FormBuilder, private authService: AuthService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      userId: [''],
      password: ['']
    }

    )
  }

  login() {
    this.incorrectLogin = false;
    const result = this.authService.login(this.LoginForm.value.userId, this.LoginForm.value.password);
    if (result) {
      let loggedinUser = JSON.parse(localStorage.getItem('userData'));
      if(loggedinUser.roles.includes('ADMIN')) {
        this.router.navigate(['/dashboard']);
      } else {
      this.router.navigate(['/user-profile'] ,{queryParams: {userId: this.LoginForm.value.userId}});
      }
    } else {
      this.incorrectLogin = true;
    }
  }
}
