import { Component, OnInit, Input,AfterViewInit, ChangeDetectorRef, ViewRef } from "@angular/core";
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { BrokerAPIService } from "../services/brokerapi.service";
import { ISysMenu } from "../interfaces/systirot";
import { Router } from "@angular/router";
import { DialogService, LoaderState } from "../services/dialog.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"]
})
export class AuthComponent implements OnInit , AfterViewInit {



  @Input()
  isVisible: boolean = true;
  visibility = "shown";
  isShowLoading: boolean;
  sideNavOpened: boolean = true;
  matDrawerOpened: boolean = false;
  matDrawerShow: boolean = true;
  sideNavMode: string = "side";
  private UrlAPI_GetCurrentUser: string = "Account/GetCurrentUser";
  private arrResMenu: any = {};

  ngOnChanges() {
    this.visibility = this.isVisible ? "shown" : "hidden";
  }
  showLoader:boolean;
  subscription: Subscription;

  constructor(
    private media: ObservableMedia,
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    public dialogService: DialogService,
    private cd: ChangeDetectorRef
  ) {
   
    this.subscription = this.dialogService.loaderState
    .subscribe((state: LoaderState) => {
        this.showLoader = state.show;
        if (!(this.cd as ViewRef).destroyed) {
          this.cd.detectChanges()
          // do other tasks
        }

    });
  }

  ngOnInit() {

    
  //  this.showLoader =  this.dialogService.getLoader();
    //this.dialogService.isLoading = false;
    console.log("auth ngOnInit");
    this.brokerAPIService.get(this.UrlAPI_GetCurrentUser).subscribe(
      data => {
        // console.log("CurrentUser");
        // console.log(data);
        // localStorage.setItem("UserMenu", JSON.stringify(data));
      },
      err => {
        // กรณี error
        console.log("Something went wrong!");
        console.log(err);
        if (err.status == 401) {

          localStorage.clear();
          this.router.navigate(['/login']);
          //  console.log("token :" + localStorage.getItem("token"));
        }

      }
    );


    this.media.subscribe((mediaChange: MediaChange) => {
      this.toggleView();
    });
  }

  ngAfterViewInit() {
    console.log("auth ngAfterViewInit");
    this.cd.detectChanges();
   
   
}

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation;
    //return outlet.isActivated ? outlet.activatedRoute : ''
  }

  toggleView() {
    if (this.media.isActive("gt-md")) {
      this.sideNavMode = "side";
      this.sideNavOpened = true;
      this.matDrawerOpened = false;
      this.matDrawerShow = true;
    } else if (this.media.isActive("gt-xs")) {
      this.sideNavMode = "side";
      this.sideNavOpened = false;
      this.matDrawerOpened = true;
      this.matDrawerShow = true;
    } else if (this.media.isActive("lt-sm")) {
      this.sideNavMode = "over";
      this.sideNavOpened = false;
      this.matDrawerOpened = false;
      this.matDrawerShow = false;
    }
  }
}
