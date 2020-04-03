import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef
} from "@angular/core";
import { AuthService } from "../../auth/service/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "cdk-user-menu",
  templateUrl: "./user-menu.component.html",
  styleUrls: ["./user-menu.component.scss"]
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean = false;

  //currentUser = null;
  Hari;

  currentUserName: string;

  @Input()
  currentUser = null;
  @HostListener("document:click", ["$event", "$event.target"])
  onClick(event: MouseEvent, targetElement: HTMLElement) {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.isOpen = false;
    }
  }

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
	this.currentUserName = localStorage.getItem('currentUserName');
	
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
    // this.router.navigate(['/']);
  }
}
