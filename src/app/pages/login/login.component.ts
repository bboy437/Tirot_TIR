import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
// import { AuthService } from '../../core/auth.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/map'
import { BrokerAPIService } from '../../services/brokerapi.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  private loading = false;
  public userForm: FormGroup;

  disableBtn = false;
  loginGroup: FormGroup;
  LoginMode: string;
  MachineID: any;
  arrobjMachine: any = [];

  // objMachine : 
  model: any = {};

  private UrlAPI_GetAll_Machine: string = "/Machine/GetAll";
  private UrlAPI_GetCurrentUser: string = "Account/GetCurrentUser";
  private UrlAPI_GetUserMenu: string = "SysMenu/GetUserMenu";
  private UrlAPI_GetCurrentTirotUser: string = "Account/GetCurrentTirotUser";

  formErrors = {
    'username': '',
    'password': '',
    'machine': ''
  };
  validationMessages = {
    'username': {
      'required': 'Please enter your username',
      'username': 'please enter your vaild username',
    },
    'password': {
      'required': 'please enter your password',
      'pattern': 'The password must contain numbers and letters',
      'minlength': 'Please enter more than 4 characters',
      'maxlength': 'Please enter less than 25 characters',
    },
    'machine': {
      'required': 'Please enter your machine',
      'machine': 'please enter your vaild machine',
    }
  };

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private brokerAPIService: BrokerAPIService) {



  }
  ngOnInit() {
    this.buildForm();
    // this.setMachine();
    //this.LoginMode = "PR";
    this.LoginMode = localStorage.getItem("LoginMode");
    this.model.machine = Number(localStorage.getItem("MachineID"));
    this.model.machine = 3;

    console.log("this.model.machine " ,this.model.machine);
    this.loginGroup = this.fb.group({
      usernameCtrl: ['', Validators.required],
      passwordCtrl: ['', Validators.required],
      machineCtrl: ['', Validators.required],

    });

    this.loginGroup.valueChanges
      .subscribe((changedObj: any) => {
        this.disableBtn = this.loginGroup.valid;
        //  console.log(changedObj);
      });

  }

  form = new FormGroup({
    loginGroup: new FormControl({
      usernameCtrl: new FormControl('', Validators.required),
      passwordCtrl: new FormControl('', Validators.required),
      machineCtrl: new FormControl('', Validators.required),

    })
  });

  buildForm() {
    this.userForm = this.fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [
        // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]],
      'machine': ['', [Validators.required]],

    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }


  login() {
    if (this.model.username != "" && this.model.password != "" && this.model.machine != "") {
      this.loading = true;
      this.authService.login(this.model.username, this.model.password, this.model.machine)
        .subscribe(
          datalogin => {
            if (datalogin) {
              this.getCurrentUser();

            }
            else {
              console.log("message " + datalogin);
              console.log("message " + this.authService.responseLogin.message);

            }
          },
          error => {
            this.loading = false;
          });
    }
  }





  private getCurrentUser() {
    this.brokerAPIService.get(this.UrlAPI_GetCurrentUser).subscribe(data => {
      localStorage.setItem("currentUserName", data.userName);
      // this.getMenu();
      this.getAPICurrentTirotUser();
    });
  }

  private getMenu() {
    this.brokerAPIService.get(this.UrlAPI_GetUserMenu).subscribe(data => {
      localStorage.setItem("UserMenu", JSON.stringify(data));
      this.router.navigate(["auth/productionrecord/production-plan-list"]);
    });
  }

  private getAPICurrentTirotUser() {
    this.brokerAPIService.get(this.UrlAPI_GetCurrentTirotUser).subscribe(data => {
      // localStorage.setItem("UserMenu", JSON.stringify(data));
      console.log(data);
      if (data != null) {
        localStorage.setItem("userLevel", data.userLevel);
        if (data.userLevel >= 5) {
          localStorage.setItem("IsSupervisor", "true");
        }
        else {
          localStorage.setItem("IsSupervisor", "false");
        }
      }


      localStorage.setItem("LoginMode", this.LoginMode);
     
      if (this.LoginMode == 'PR') {
        // console.log("auth/productionrecord/production-plan-list");
        this.router.navigate(["auth/productionrecord/production-plan-list"]);
      }
      else if (this.LoginMode == 'FI') {
        // console.log("auth/productionrecord/final-inspection-list");
        this.router.navigate(["auth/productionrecord/final-inspection-list"]);
      }



    });
  }

}

