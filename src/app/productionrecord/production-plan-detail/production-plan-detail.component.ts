import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-production-plan-detail',
  templateUrl: './production-plan-detail.component.html',
  styleUrls: ['./production-plan-detail.component.scss']
})
export class ProductionPlanDetailComponent implements OnInit {


  isDisabled: boolean;
  private Url_Listing: string = "/auth/productionrecord/production-plan-list";
  private Url_MachineCheckList: string = "/auth/productionrecord/machine-check-list";
  private Url_MixedSolution: string = "/auth/productionrecord/mixed-solution-entry";
  private Url_StandardInspect: string = "/auth/productionrecord/standard-inspect-entry";
  private Url_InlineInspect: string = "/auth/productionrecord/inline-inspect-entry";


  objParams: any = {};

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }

  ngOnInit() {

    let params = this.route.snapshot.paramMap;

    if (params.has("objParams")) {

      this.objParams = JSON.parse(params.get("objParams"));

      console.log("objParams" ,this.objParams);
      console.log("this.objParams.productionPlanID",this.objParams.productionPlanID);
      // this.ProductionPlanID = this.objParams.productionPlanID; //  params.get("ProductionPlanID");
      // this.DateSelected =  this.objParams.dateSelected;// params.get("DateSelected");
      // this.PlanStatus = this.objParams.planStatus;//params.get("PlanStatus");
      // this.LotNo = this.objParams.lotNo;//params.get("LotNo");
      // this.StandardID = this.objParams.standardId;//params.get("StandardId");


      switch (this.objParams.planStatus) {
        case null:
        case "0": //Not Start
          this.isDisabled = true;
          break;
        case "1": //Running
        case "2": //Head Finish
          this.isDisabled = false;
          break;
        case "3": //Finished
        case "7": //Cancel
          this.isDisabled = false;
          break;
        default:

          break;
      }
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
  }

  btnMixedSolutionClick() {
    this.router.navigate([this.Url_MixedSolution, { objParams: JSON.stringify(this.objParams) }]);
  }

  btnStandardIspectClick() {
    this.router.navigate([this.Url_StandardInspect, { objParams: JSON.stringify(this.objParams) }]);
  }

  btnMachineCheckListClick() {
    this.router.navigate([this.Url_MachineCheckList, { objParams: JSON.stringify(this.objParams) }]);
  }

  btnInlineIspectClick() {
    this.router.navigate([this.Url_InlineInspect, { objParams: JSON.stringify(this.objParams) }]);
  }




}
