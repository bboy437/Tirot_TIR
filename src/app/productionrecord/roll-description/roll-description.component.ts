import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-roll-description',
  templateUrl: './roll-description.component.html',
  styleUrls: ['./roll-description.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RollDescriptionComponent implements OnInit {

  JobOrderNo = "";
  Fabric = "";
  Process = "";
  Product = "";

  private UrlAPI_GetByPlanAndLot: string = "ProductionRecord/GetByPlanAndLot/"
  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_GetArticleInstruction: string = "Article/GetArticleInstruction/";
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/";
  private UrlAPI_GetProductionRecord: string = "ProductionRecord/Get/";
  @Input() IsStart: boolean;
  @Input() ProductionPlanID: string;
  @Input() LotNo: string;
  @Input() PlanStatus: string;

  objProductionPlan: any = {};
  fabricRollNo: any = "";
  spindleNo: any = "";
  remark: any = "";
  objProductionRecord: any;
  constructor(private brokerAPIService: BrokerAPIService, private dialogService: DialogService) { }

  async ngOnInit() {

    try {
      switch (this.PlanStatus) {
        case null:
        case "0": //Not Start

          break;
        case "1": //Running
        case "2": //Head Finish
          let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + this.IsStart);
          this.getProductionRecord(data);
          break;
        case "3": //Finished
        case "7": //Cancel
          this.getAPIProductionRecordByPlanAndLot(this.ProductionPlanID, this.LotNo);
          break;
        default:

          break;
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }

  }

  async getAPIProductionRecordByPlanAndLot(productionplanId: any, lotNo: any) {

    try {
      this.brokerAPIService.get(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo).subscribe(data => {
        try {
          this.objProductionRecord = data;
          this.spindleNo = this.objProductionRecord.spindleNo;
          this.remark = this.objProductionRecord.remark;
          this.fabricRollNo = this.objProductionRecord.fabricRollNo;
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


  async getProductionRecord(objproductionRecord: any) {
    try {
      if (objproductionRecord.productionRecordId != null) {
        this.brokerAPIService.get(this.UrlAPI_GetProductionRecord + objproductionRecord.productionRecordId).subscribe(data => {
          try {
            this.fabricRollNo = data.fabricRollNo;
            this.spindleNo = data.spindleNo;
            this.remark = data.remark;
          } catch (error) {
            this.dialogService.showErrorDialog(error);
          }
        }, err => {
          this.dialogService.showErrorDialog(err);
        });
      }
    } catch (error) {
      throw error;
    }
  }

}
