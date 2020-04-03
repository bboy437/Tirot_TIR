import { Component, OnInit, Input } from '@angular/core';
import { ToolbarHelpers } from './toolbar.helpers';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'cdk-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

	@Input() sidenav;
	@Input() sidebar;
	@Input() drawer;
	@Input() matDrawerShow;

	searchOpen: boolean = false;
	toolbarHelpers = ToolbarHelpers;
	CurrentPage: any;

	constructor(private route: ActivatedRoute,  router: Router) {
		router.events.subscribe((val) => {
			// see also 

			let objUrl: any = val;
			if (objUrl != undefined) {
				if (objUrl.urlAfterRedirects != undefined) {
					let arrUrl = objUrl.urlAfterRedirects.toString().split(';');
					let arrSubUrl = arrUrl[0].split('/');

					console.log("arrSubUrl", arrUrl[0])
					switch (arrUrl[0]) {
						case "/auth/productionrecord/machine-check-list":
							this.CurrentPage = "Machine Check List";
							break;
						case "/auth/productionrecord/mixed-solution-entry":
							this.CurrentPage = "Mixed Solution";
							break;
						case "/auth/productionrecord/standard-inspect-entry":
							this.CurrentPage = " Standard Inspect";
							break;
						case "/auth/productionrecord/inline-inspect-entry":
							this.CurrentPage = "Inline Inspect";
							break;
						case "/auth/productionrecord/production-plan-detail":
							this.CurrentPage = "Production Plan Detail";
							break;
						case "/auth/productionrecord/production-plan-list":
							this.CurrentPage = "Production Plan List";
							break;
						case "/auth/productionrecord/final-inspection-list":
							this.CurrentPage = "Final Inspection List";
							break;
						case "/auth/productionrecord/final-inspection-detail":
							this.CurrentPage = "Final Inspection Detail";
							break;

						default:
							break;
					}

				}
			}



		});
	}


	ngOnInit() {
		//	this.CurrentPage =	localStorage.getItem("CurrentPage");
		let params = this.route.snapshot.paramMap;
		console.log("route", this.route);
	}

}
