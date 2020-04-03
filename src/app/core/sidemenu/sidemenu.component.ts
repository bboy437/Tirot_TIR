import { Component, OnInit, Input } from "@angular/core";
import { menus } from "./menu-element";

import { BrokerAPIService } from "../../services/brokerapi.service";
import { ISysMenu, IMenu, ISubMenu } from "../../interfaces/systirot";

@Component({
  selector: "cdk-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.scss"]
})
export class SidemenuComponent implements OnInit {
  @Input() iconOnly: boolean = false;
  // public menus: any = {};
  private arrResMenu: any = {};
  public menus = menus;
  private UrlAPI_GetUserMenu: string = "SysMenu/GetUserMenu";

  constructor(private brokerAPIService: BrokerAPIService) {}

  ngOnInit() {
    //console.log("sidemenu ngOnInit");
   // this.setMenu();
  }

  setMenu() {
    // this.brokerAPIService.get(this.UrlAPI_GetUserMenu).subscribe(data => {
      let arrMenu = [];

      this.arrResMenu = <ISysMenu[]>JSON.parse(localStorage.getItem('UserMenu'));
      console.log("this.arrResMenu");
      console.log(this.arrResMenu);
      for (let iHeader = 0; iHeader < this.arrResMenu.length; iHeader++) {
        const element = this.arrResMenu[iHeader];
        let resMenu = <ISysMenu>element;
        if (
          resMenu.menuLevel == 1
          //  && resMenu.id == 4
        ) {
          let objmenu = {} as IMenu;
          objmenu.name = resMenu.menusName;
          objmenu.link = false;
          objmenu.open = false;
          objmenu.icon = "mode_edit";
          objmenu.sub = [];

          for (let iSub = 0; iSub < this.arrResMenu.length; iSub++) {
            const element = this.arrResMenu[iSub];
            let resSubMenu = <ISysMenu>element;
            if (resSubMenu.menuLevel == 2) {
              if (resMenu.id == resSubMenu.parentMenu) {
                let objsubmenu = {} as ISubMenu;
                objsubmenu.name = resSubMenu.menusName;
                objsubmenu.chip = false;
                objsubmenu.open = true;
                objsubmenu.icon = "mode_edit";
                objsubmenu.link = resSubMenu.execURL;
                objmenu.sub.push(objsubmenu);
              }
            }
          }
          arrMenu.push(objmenu);
        }
      }
      this.menus = arrMenu;
    // });
  }
}
