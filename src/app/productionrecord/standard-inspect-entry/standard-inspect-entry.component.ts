import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatDialog, MatDialogRef, VERSION, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IStandardinspect } from "../../interfaces/productionrecords";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { log } from 'util';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-standard-inspect-entry',
  templateUrl: './standard-inspect-entry.component.html',
  styleUrls: ['./standard-inspect-entry.component.scss']
})
export class StandardInspectEntryComponent implements OnInit {

  //DateSelected: string = "";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  version = VERSION;
  // isLoadingResults = true;

  StationGroupID: number;
  objRow: any = {};
  objAPIResponse: any = {};
  objStationGroup: any = [];
  objMachine: any = [];

  objCurrentJob: any = {};
  objStandardinspect: any = [];
  onMachineId: number;
  //ProductionPlanID: any;

  dialogRef: MatDialogRef<MessageDialogComponent>;
  dataSource = new MatTableDataSource();


  private Url_Listing: string = "/auth/productionrecord/production-plan-detail";
  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/"
  private UrlAPI_GetByPlanAndLot: string = "ProductionRecord/GetByPlanAndLot/"
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/";
  private UrlAPI_GetSingleRow: string = "ProductionRecord/Get/";
  private UrlAPI_UpdateStandardInspection: string = "ProductionRecord/UpdateStandardInspection";
  private UrlAPI_AddStandardInspection: string = "ProductionRecord/AddStandardInspection";
  private UrlAPI_GetStandardInspection: string =
    "ProductionRecord/GetStandardInspection/";
  private UrlAPI_GetStandard: string = "Standard/Get/";
  PageStatus: string;
  productionRecordId: any;
  //PlanStatus: string;
  //LotNo: string;
  IsSupervisor: boolean;
  btnSaveEnable: boolean;

  frontIsLeftCrease: string;
  frontIsSmoothRoll: string;
  //StandardID: string;
  objStandard: any = {};
  objProductionPlan: any = {};
  objParams: any = {};

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  async ngOnInit() {
    try {

      this.IsSupervisor = JSON.parse(localStorage.getItem("IsSupervisor"));
      this.frontIsLeftCrease = "NG";
      this.frontIsSmoothRoll = "NG";
      let params = this.route.snapshot.paramMap;
      if (params.has("objParams")) {
        this.objParams = JSON.parse(params.get("objParams"))
        console.log(params.get("objParams"));
        //this.ProductionPlanID = params.get("ProductionPlanID");
        //this.PlanStatus = params.get("PlanStatus");
        //this.DateSelected = params.get("DateSelected");
        //this.LotNo = params.get("LotNo");
        //this.StandardID = params.get("StandardId");
      }
      this.dialogService.showLoader();
      switch (this.objParams.planStatus) {
        case null:
        case "0": //Not Start

          break;
        case "1": //Running
        case "2": //Head Finish
          let dataCurrentJob: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false);
          this.objCurrentJob = dataCurrentJob;
          await this.getAPIStandardInspection();

          this.btnSaveEnable = true;
          break;
        case "3": //Finished
        case "7": //Cancel
          await this.getAPIProductionRecordByPlanAndLot(this.objParams.productionPlanID, this.objParams.lotNo);
          if (this.IsSupervisor) {
            this.btnSaveEnable = true;
          }
          else {
            this.btnSaveEnable = false;
          }
          break;
        default:

          break;
      }

      await this.getAPIGetStandard();
      await this.getAPIGetProductionPlan();

    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async getAPIProductionRecordByPlanAndLot(productionplanId: any, lotNo: any) {

    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo);
      if (data != null && data != undefined) {
        if (data.standardInspection != null) {
          this.objRow = data.standardInspection;
          // console.log("objRow", this.objRow);
          this.prepareOKNG();
        }
        else {
          this.PageStatus = "A";
          this.productionRecordId = data.id;
        }
      }
      else {
        this.PageStatus = "A";
        this.productionRecordId = data.id;
      }
    } catch (error) {
      throw error;
    }
    // this.brokerAPIService.get(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo).subscribe(data => {
    //   console.log("UrlAPI_GetByPlanAndLot", data);
    //   if (data != null && data != undefined) {
    //     if (data.standardInspection != null) {
    //       this.objRow = data.standardInspection;
    //       console.log("objRow", this.objRow);

    //       this.prepareOKNG();

    //     }
    //     else {
    //       this.PageStatus = "A";
    //       this.productionRecordId = data.id;
    //     }
    //   }
    //   else {
    //     this.PageStatus = "A";
    //     this.productionRecordId = data.id;
    //   }

    // }, err => {
    //   console.log(err);
    // });
  }


  private prepareOKNG() {
    if (this.objRow.frontIsSmoothRoll) {
      this.frontIsSmoothRoll = "OK";
    }
    else {
      this.frontIsSmoothRoll = "NG";
    }
    if (this.objRow.frontIsLeftCrease) {
      this.frontIsLeftCrease = "OK";
    }
    else {
      this.frontIsLeftCrease = "NG";
    }
  }

  // getAPICurrentJob() {
  //   this.brokerAPIService.get(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false).subscribe(data => {
  //     console.log("CurrentJob", data)
  //     this.objCurrentJob = data;
  //     this.getStandardInspection();
  //   });
  // }

  async getAPIGetStandard() {
    try {
      
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetStandard + this.objParams.standardId);
       console.log("getAPIGetStandard " + this.objParams.standardId, data)
      if (data != null) {
        this.objStandard = data;
      }
    } catch (error) {
      throw error;
    }
    // this.brokerAPIService.get(this.UrlAPI_GetStandard + this.objParams.standardID).subscribe(data => {
    //   console.log("getAPIGetStandard", data)
    //   if (data != null) {
    //     this.objStandard = data;
    //   }
    // });
  }

  async getAPIGetProductionPlan() {

    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionPlan + this.objParams.productionPlanID);
      // console.log("getAPIGetProductionPlan", data);
      if (data != null) {
        this.objProductionPlan = data;
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetProductionPlan + this.objParams.productionPlanID).subscribe(data => {
    //   console.log("getAPIGetProductionPlan", data)
    //   if (data != null) {
    //     this.objProductionPlan = data;
    //   }
    // });
  }

  async getAPIStandardInspection() {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetStandardInspection + this.objCurrentJob.productionRecordId);
      // console.log("getStandardInspection", data);
      this.productionRecordId = this.objCurrentJob.productionRecordId;
      if (data == null) {
        this.PageStatus = "A";
      }
      else {
        this.objRow = <IStandardinspect>data;
        this.PageStatus = "E";
      }
      this.prepareOKNG();
      // console.log(this.PageStatus);
      // console.log(this.objRow);
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetStandardInspection + this.objCurrentJob.productionRecordId).subscribe(data => {

    //   console.log("getStandardInspection", data);
    //   this.productionRecordId = this.objCurrentJob.productionRecordId;
    //   if (data == null) {
    //     this.PageStatus = "A";
    //   }
    //   else {
    //     this.objRow = <IStandardinspect>data;
    //     this.PageStatus = "E";
    //   }
    //   this.prepareOKNG();

    //   console.log(this.PageStatus);
    //   console.log(this.objRow);
    // });
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
  }

  async btnSaveClick() {
    try {
      this.dialogService.showLoader();
      await this.save();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async save() {
    try {
      if (this.frontIsLeftCrease == "NG") {
        this.objRow.frontIsLeftCrease = false;
      }
      else {
        this.objRow.frontIsLeftCrease = true;
      }

      if (this.frontIsSmoothRoll == "NG") {
        this.objRow.frontIsSmoothRoll = false;
      }
      else {
        this.objRow.frontIsSmoothRoll = true;
      }
      if (this.PageStatus == "A") {
        this.objRow.createBy = localStorage.getItem("currentUserName");
        this.objRow.updateBy = localStorage.getItem("currentUserName");
        this.objRow.productionRecordId = this.productionRecordId;
        await this.postAPISaveStandardInspection(this.UrlAPI_AddStandardInspection);
      }
      else {
        this.objRow.updateBy = localStorage.getItem("currentUserName");
        await this.postAPISaveStandardInspection(this.UrlAPI_UpdateStandardInspection);
      }

    } catch (error) {
      throw error;
    }
  }

  async postAPISaveStandardInspection(strUrlAPI: string) {
    try {
      let data: any = await this.brokerAPIService.postAwait(strUrlAPI, this.objRow);
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }
  }


  save_old() {
    if (this.frontIsLeftCrease == "NG") {
      this.objRow.frontIsLeftCrease = false;
    }
    else {
      this.objRow.frontIsLeftCrease = true;
    }

    if (this.frontIsSmoothRoll == "NG") {
      this.objRow.frontIsSmoothRoll = false;
    }
    else {
      this.objRow.frontIsSmoothRoll = true;
    }
    console.log(this.PageStatus);

    if (this.PageStatus == "A") {
      // if (this.PageStatus == "A") {
      //Create 
      this.objRow.createBy = "admin";
      this.objRow.updateBy = "admin";

      this.objRow.productionRecordId = this.productionRecordId;
      //this.objRow.workerId = 1;


      console.log("getdata", this.objRow);

      this.brokerAPIService.post(this.UrlAPI_AddStandardInspection, this.objRow).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          console.log(this.objRow)

          if (this.objAPIResponse.success) {
            this.showSnackBar("Save Complete");
          } else {
            console.log(
              "this.objAPIResponse.success :" + this.objAPIResponse.success
            );
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
    } else {
      //Update
      this.brokerAPIService
        .post(this.UrlAPI_UpdateStandardInspection, <IStandardinspect>this.objRow)
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.showSnackBar("Save Complete");
              // console.log(this.objRow)
            } else {
              console.log(
                "this.objAPIResponse.success :" + this.objAPIResponse.success
              );
            }
          },
          err => {
            // กรณี error
            console.log("Something went wrong!");
          }
        );
    }

    // return Observable.of(false);
  }

//In
  txtInWeightChange(newValue) {
    // this.ValidateTolerance(newValue, this.objStandard.weight);
    this.ValidateToleranceStandard(newValue, this.objStandard.outWeightMin,this.objStandard.outWeightMax);
  }
  txtInTicknessChange(newValue) {
    // this.ValidateTolerance(newValue, this.objStandard.tickness);
    this.ValidateToleranceStandard(newValue, this.objStandard.outTicknessMin,this.objStandard.outTicknessMax);
  }
  txtInWidthChange(newValue) {
    //this.ValidateTolerance(newValue, this.objStandard.width);
    this.ValidateToleranceStandard(newValue, this.objStandard.outWidthMin,this.objStandard.outWidthMax);
  }

  //Out
  txtOutWeightChange(newValue) {
    // this.ValidateTolerance(newValue, this.objStandard.weight);
    this.ValidateToleranceStandard(newValue, this.objStandard.outWeightMin,this.objStandard.outWeightMax);
  }
  txtOutTicknessMinChange(newValue) {
    // this.ValidateTolerance(newValue, this.objStandard.weight);
    this.ValidateToleranceStandard(newValue, this.objStandard.outTicknessMin,this.objStandard.outTicknessMax);
  }
  txtOutWidthChange(newValue) {
    //this.ValidateTolerance(newValue, this.objStandard.width);
    this.ValidateToleranceStandard(newValue, this.objStandard.outWidthMin,this.objStandard.outWidthMax);
  }
// -------------------------------------------
  txtFabricSetChange(newValue) {
    this.ValidateTolerance(newValue, this.objStandard.fabricSet);
  }

  txtPlanQtyChange(newValue) {
    this.ValidateTolerance(newValue, this.objProductionPlan.planQty);
  }

  private ValidateToleranceStandard(newValue: any,Min : number,Max) {
    if (newValue > Max) {
      this.showDialogValidateTolerance("error", "Warning", "ข้อมูลไม่อยู่ในช่วงมาตรฐาน " + Min + " - " + Max);
    }
    if (newValue < Min) {
      this.showDialogValidateTolerance("error", "Warning", "ข้อมูลไม่อยู่ในช่วงมาตรฐาน " + Min + " - " + Max);
    }
  }

  private ValidateTolerance(newValue: any, standard: any) {
    //console.log("this.objStandard", this.objStandard);
    let tolerance = (standard * 5) / 100;
    // console.log("tolerance", tolerance);
    let Maxtolerance = standard + tolerance;
    let Mintolerance = standard - tolerance;
    if (newValue > Maxtolerance) {
      this.showDialogValidateTolerance("error", "Warning", "ข้อมูลไม่อยู่ในช่วงมาตรฐาน " + Mintolerance + " - " + Maxtolerance);
    }
    if (newValue < Mintolerance) {
      this.showDialogValidateTolerance("error", "Warning", "ข้อมูลไม่อยู่ในช่วงมาตรฐาน " + Mintolerance + " - " + Maxtolerance);
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  showDialogValidateTolerance(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '400px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }

  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '300px', height: '200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }

}
