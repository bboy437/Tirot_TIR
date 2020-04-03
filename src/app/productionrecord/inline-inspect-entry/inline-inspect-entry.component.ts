import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatTableDataSource, MatDialogRef, MatDialog, MatPaginator, MatSort } from '@angular/material';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { InlineInspectDialogComponent } from './dialog/inline-inspect-dialog/inline-inspect-dialog.component';
import { Observable } from 'rxjs';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-inline-inspect-entry',
  templateUrl: './inline-inspect-entry.component.html',
  styleUrls: ['./inline-inspect-entry.component.scss']
})
export class InlineInspectEntryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dialogInlineInspect: MatDialogRef<InlineInspectDialogComponent>;

  private Url_Listing: string = "/auth/productionrecord/production-plan-list";
  private UrlAPI_Defect_TailFinishJobOrder: string = "ProductionRecord/TailFinishJobOrder";
  private UrlAPI_Defect_GetAllActive: string = "Defect/GetAllActive";
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/";

  private UrlAPI_GetListInlineInspection: string = "ProductionRecord/GetListInlineInspection/"; // {ProductionRecordId}

  dataSource = new MatTableDataSource();
  isLoadingResults = true;
  displayedColumns = ['defectAtLength', 'defect.defectName', 'defectPosition'];
  // ProductionPlanID: string;
  onMachineId: number;
  objarrDefect: any = [];
  objCurrentJob: any = {};
  defectPosition: string;
  length: number;
  objAPIResponse: any;
  objProductionRecord: any = {};
  showBtnFinishJob: boolean;
  private UrlAPI_GetProductionRecord: string = "ProductionRecord/Get/";
  private UrlAPI_GetByPlanAndLot: string = "ProductionRecord/GetByPlanAndLot/"
  currentUserName: string;
  //PlanStatus: string;
  //DateSelected: string;
  //LotNo: string;
  IsSupervisor: boolean;
  ProductionRecordID: any;
  Editable: boolean;
  objParams: any = {};

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) {
    // Observable.timer(0, 1000).subscribe(timer => {
    //   this.length = timer;
    // });
  }

  async ngOnInit() {

    try {
      this.IsSupervisor = JSON.parse(localStorage.getItem("IsSupervisor"));
      this.defectPosition = "C";
      this.currentUserName = localStorage.getItem("currentUserName");
      let params = this.route.snapshot.paramMap;
      if (params.has("objParams")) {
        this.objParams = JSON.parse(params.get("objParams"));
        console.log(params.get("objParams"));
        //this.ProductionPlanID = params.get("ProductionPlanID");
        //this.PlanStatus = params.get("PlanStatus");
        //this.DateSelected = params.get("DateSelected");
        //this.LotNo = params.get("LotNo");
      }
      this.dialogService.showLoader();
      await this.getAPIDefect();

      switch (this.objParams.planStatus) {
        case null:
        case "0": //Not Start

          break;
        case "1": //Running
          await this.getAPICurrentJob();
          await this.getAPIListInlineInspection();
          await this.getProductionRecord();
          this.Editable = true;
          break;
        case "2": //Head Finish
          await this.getAPICurrentJob();
          await this.getAPIListInlineInspection();
          await this.getProductionRecord();
          this.showBtnFinishJob = true;
          this.Editable = true;
          break;
        case "3": //Finished
        case "7": //Cancel
          await this.getAPIProductionRecordByPlanAndLot(this.objParams.productionPlanID, this.objParams.lotNo);
          if (this.IsSupervisor) {
            this.Editable = true;
          }
          else {
            this.Editable = false;
          }
          break;
        default:

          break;
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  private async getAPIProductionRecordByPlanAndLot(productionplanId: any, lotNo: any) {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo);
      if (data != null && data != undefined) {
        if (data.inlineInspections != null) {
          this.ProductionRecordID = data.id;
          this.dataSource.data = data.inlineInspections;
        }
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo).subscribe(data => {
    //   // console.log("UrlAPI_GetByPlanAndLot", data);
    //   if (data != null && data != undefined) {
    //     if (data.inlineInspections != null) {
    //       this.ProductionRecordID = data.id;
    //       this.dataSource.data = data.inlineInspections;
    //     }
    //   }
    // }, err => {
    //   console.log(err);
    // });
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  async onSave(isSaveComplete: boolean) {
    try {
      console.log("onSave", isSaveComplete);
      this.dialogService.showLoader();
      if (isSaveComplete) {
        await this.getAPIListInlineInspection();
      }
      else {

      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async getAPICurrentJob() {

    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false);
      this.objCurrentJob = data;
      this.ProductionRecordID = this.objCurrentJob.productionRecordId;
      // this.getAPIListInlineInspection();
      // this.getProductionRecord();

    } catch (error) {
      throw error;
    }

  }

  private async getProductionRecord() {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionRecord + this.ProductionRecordID);
      //console.log("UrlAPI_GetProductionRecord", data);
      this.objProductionRecord = data;

    } catch (error) {
      throw error;
    }
  }


  async getAPIListInlineInspection() {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetListInlineInspection + this.ProductionRecordID);
      // console.log(data);
      this.dataSource.data = data;
    } catch (error) {
      throw error;
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
  }

  getDataFinishTask() {
    this.brokerAPIService.get(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false).subscribe(data => {

      console.log("getDataFinishTask", data);

      let objdata: any = {};
      objdata.id = this.objProductionRecord.id;
      objdata.productionRecordId = this.objParams.productionPlanID;
      objdata.lotNo = this.objProductionRecord.lotNo;
      objdata.onMachineId = this.objProductionRecord.onMachineId;
      objdata.teamId = this.objProductionRecord.teamId;
      objdata.shiftId = this.objProductionRecord.shiftId;
      objdata.createBy = this.currentUserName;
      objdata.updateBy = this.currentUserName;;

      return objdata;
    });
  }

  async btnFinishTaskClick() {
    try {
      this.objProductionRecord.productionLength = Number(this.length);
      this.dialogService.showLoader();
      await this.tailFinishTask(this.objProductionRecord);
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async tailFinishTask(objTailFinishJob: any) {
    try {
   
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Defect_TailFinishJobOrder, objTailFinishJob);
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
        this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }

    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.post(this.UrlAPI_Defect_TailFinishJobOrder, objTailFinishJob).subscribe(
    //   data => {
    //     this.objAPIResponse = <IAPIResponse>data;
    //     if (this.objAPIResponse.success) {
    //       this.showSnackBar("Save Complete");
    //       this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
    //     } else {
    //       console.log(
    //         "this.objAPIResponse.success :" + this.objAPIResponse.success
    //       );
    //     }
    //   },
    //   err => {
    //     // กรณี error
    //     console.log("Something went wrong!");
    //     this.showSnackBar("Save Error");
    //   }
    // );
  }

 



  async getAPIDefect() {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_Defect_GetAllActive);
      this.objarrDefect = data;
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_Defect_GetAllActive).subscribe(data => {
    //   this.objarrDefect = data;
    //   console.log("objarrDefect", this.objarrDefect);
    // });
  }

  rowClicked(row: any): void {

    row.Editable = this.Editable;
    console.log("rowClicked", row);
    //this.objorderItems = this.objRow.orderItems.find(x => x.id === id);
    // console.log("this.objoperationInstruction");
    // console.log(this.objoperationInstruction);
    this.dialogInlineInspect = this.dialog.open(
      InlineInspectDialogComponent,
      {
        data: row,
        disableClose: true
      }
    );
    this.dialogInlineInspect.afterClosed().subscribe(result => {
      this.getAPIListInlineInspection();
      // console.log("afterClosed Edit");
      // console.log(result);
      // if (result != undefined) {
      //   // if (result.process != undefined) {
      //   // }
      // }
      // this.bindOrderItemDataSource();
    });

  }

  keynumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  keydecimal(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/g;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
