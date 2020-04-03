import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { DialogService } from '../../services/dialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { errorHandler } from '@angular/platform-browser/src/browser';

@Component({
  selector: 'app-production-record-header',
  templateUrl: './production-record-header.component.html',
  styleUrls: ['./production-record-header.component.scss']
})
export class ProductionRecordHeaderComponent implements OnInit {
  isLoadingResults = false;
  JobOrderNo = "";
  Fabric = "";
  Process = "";
  Product = "";

  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_GetArticleInstruction: string = "Article/GetArticleInstruction/";
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/";
  private UrlAPI_GetProductionRecord: string = "ProductionRecord/Get/";
  private Url_Listing: string = "/auth/productionrecord/production-plan-list";

  @Input() ProductionPlanID: string;
  @Input() IsStart: boolean;
  @Input() PlanStatus: any;
  // @Input() objParams: any;

  objProductionPlan: any = {};
  fabricRollNo: any;
  constructor(private brokerAPIService: BrokerAPIService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute, ) {

  }

  async ngOnInit() {


    try {
       this.getAPIProductionPlan();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }




    // this.isLoadingResults = true;

    // this.brokerAPIService.get(this.UrlAPI_GetProductionPlan + this.ProductionPlanID).subscribe(
    //   data => {
    //     // console.log(data);
    //     this.JobOrderNo = data.jobOrderNo;
    //     this.Process = data.process.processName;
    //     this.Product = data.product.productName;
    //     this.fabricRollNo = data.rollNo;

    //     //this.Fabric = data.jobOrderNo; 

    //     // if(this.PlanStatus == "1")
    //     // {
    //     //   this.brokerAPIService.get(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + this.IsStart).subscribe(data => {
    //     //     console.log("UrlAPI_GetCurrentJob", data);
    //     //     if (data != null) {
    //     //       //this.getProductionRecord(data);
    //     //     }
    //     //   });
    //     // }


    //     this.isLoadingResults = false;


    //   },
    //   err => {
    //     console.log(err);
    //     this.isLoadingResults = false;
    //   }
    // );



  }


  async getAPIProductionPlan() {


    try {
      console.log(this.UrlAPI_GetProductionPlan + this.ProductionPlanID);
      
      this.brokerAPIService.get(this.UrlAPI_GetProductionPlan + this.ProductionPlanID).subscribe(data => {
        try {
          console.log(data);
          
          this.JobOrderNo = data.jobOrderNo;
          this.Process = data.process.processName;
          this.Product = data.product.productName;
          this.fabricRollNo = data.rollNo;
        } catch (error) {
          this.dialogService.showErrorDialog(error);
        }
      }, err => {
        this.dialogService.showErrorDialog(err);
      });

    } catch (error) {
      throw error;
    }

  }


  // private getProductionRecord(data: any) {
  //   this.brokerAPIService.get(this.UrlAPI_GetProductionRecord + data.productionRecordId).subscribe(data => {
  //     console.log("UrlAPI_GetProductionRecord", data);
  //     //this.fabricRollNo = data.fabricRollNo;
  //   });
  // }

}
