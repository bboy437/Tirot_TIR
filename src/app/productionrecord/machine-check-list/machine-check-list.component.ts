import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { MatStepper, MatSnackBar, MatDialog } from '@angular/material';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { StartOperData, IProductionRecord_JobOrder_startOperData, IProductionRecord_JobOrder_startOperData2 } from '../../interfaces/productionrecords';
import { JsonPipe } from '@angular/common';
import { isBoolean } from 'util';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { DialogService } from '../../services/dialog.service';


@Component({
  selector: 'app-machine-check-list',
  templateUrl: './machine-check-list.component.html',
  styleUrls: ['./machine-check-list.component.scss']
})



export class MachineCheckListComponent implements OnInit {
  isLinear = false;
  FormGroup1: FormGroup;
  FormGroup2: FormGroup;
  FormGroup3: FormGroup;
  FormGroup4: FormGroup;

  arrobjMCL1: any = [];
  arrobjMCL2: any = [];
  arrobjMCL3: any = [];
  //ProductionPlanID: string;
  private UrlAPI_GetCurrentMachineStatus: string = "Visualization/GetCurrentMachineStatus/"
  private UrlAPI_CreateMachineCheckList: string = "MachineCheckList/CreateMachineCheckList";
  private UrlAPI_CreateJobOrder: string = "ProductionRecord/CreateJobOrder";
  private UrlAPI_UpdateJobOrder: string = "ProductionRecord/UpdateJobOrder";
  private UrlAPI_GetStandard: string = "Standard/Get/";
  private UrlAPI_HeadFinishJobOrder: string = "ProductionRecord/HeadFinishJobOrder";
  private UrlAPI_GetProductionPlan: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_GetByPlanAndLot: string = "ProductionRecord/GetByPlanAndLot/"
  private UrlAPI_GetMachickListByPRId: string = "MachineCheckList/GetMachickListByPRId/";
  private UrlAPI_GetPreviousRemark: string = "ProductionRecord/GetPreviousRemark/";
  private UrlAPI_GetMachineCheckListForStartProduction: string = "MachineCheckList/GetMachineCheckListForStartProduction/";
  private Url_Listing: string = "/auth/productionrecord/production-plan-list";
  private UrlAPI_Update: any;
  objRow: any;
  objAPIResponse: IAPIResponse;
  fabricRollNo: any = "";
  spindleNo: any = "";
  remark: any = "";
  shiftId: any;
  teamId: any;
  onMachineId: any;
  lotNo: any;
  processId: any;
  objCurrentJob: any;
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/";
  private UrlAPI_GetProductionRecord: string = "ProductionRecord/Get/";
  objProductionRecord: any = {};
  objStartOperData: any = {};
  currentUserName: string;
  fabricSet1: string;
  fabricSet2: string;
  //PlanStatus: string;
  PageMode: string;
  // DateSelected: string;
  IsSupervisor: boolean;
  standardId: any;
  objProductionPlan: any;
  dialogRef: any;
  objStandard: any;
  //StandardID: any;
  IsLeftCrease: string;
  IsSmoothRoll: string;

  objParams: any = {};

  constructor(private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private brokerAPIService: BrokerAPIService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar) { }
  objarrMachineCheckList: any = [];

  async ngOnInit() {

    try {
      this.objStartOperData.fabricWidth = "";
      this.objStartOperData.fabricLength = "";
      this.objStartOperData.fabricSet = "";

      this.objStartOperData.leftWeight = "";
      this.objStartOperData.centerWeight = "";
      this.objStartOperData.rightWeight = "";

      this.objStartOperData.leftThickness = "";
      this.objStartOperData.centerThickness = "";
      this.objStartOperData.rightThickness = "";

      this.currentUserName = localStorage.getItem("currentUserName");
      this.IsSupervisor = JSON.parse(localStorage.getItem("IsSupervisor"));
      this.IsLeftCrease = "NG";
      this.IsSmoothRoll = "NG";

      this.FormGroup1 = this._formBuilder.group({
        Ctrl1: ['', Validators.required]

      });

      this.FormGroup2 = this._formBuilder.group({
        Ctrl2: ['', Validators.required]
      });

      this.FormGroup3 = this._formBuilder.group({
        Ctrl3: ['', Validators.required]
      });


      let params = this.route.snapshot.paramMap;
      if (params.has("objParams")) {
        this.objParams = JSON.parse(params.get("objParams"));
        //this.objParams.planStatus
        // this.ProductionPlanID = params.get("ProductionPlanID");
        this.onMachineId = +localStorage.getItem("MachineID");
        // this.PlanStatus = params.get("PlanStatus");
        //this.DateSelected = params.get("DateSelected");
        // this.StandardID = params.get("StandardId");
      }

      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionPlan + this.objParams.productionPlanID)

      console.log("UrlAPI_GetProductionPlan", data);
      this.shiftId = data.shiftId;
      this.teamId = data.wokingTeamId;
      this.lotNo = data.lotNo;
      this.processId = data.processId;
      this.standardId = data.standardId;
      this.objProductionPlan = data;

      switch (this.objParams.planStatus) {
        case null:
        case "0": //Not Start
          this.PageMode = "A"
          await this.getAPIMachineCheckListForStartProduction(data.processId, data.standardId);
          // await this.getAPIPreviousRemark(this.objParams.productionOrderNo, this.objParams.productId, this.objParams.lotNo);
          await this.setSensorID();
          break;
        case "1": //Running
        case "2": //Head Finish
        case "3": //Finished
        case "7": //Cancel
          this.PageMode = "E"
          if (this.objParams.planStatus == "1") // Running
          {
            await this.getAPICurrentJob();
            await this.getProductionRecord(this.objCurrentJob.productionRecordId);
            await this.getAPIMachickListByPRId(this.objProductionRecord.id);
          }
          else {
            await this.getAPIProductionRecordByPlanAndLot(this.objParams.productionPlanID, this.lotNo);
            await this.getAPIMachickListByPRId(this.objProductionRecord.id);
          }
          break;
        default:

          break;
      }

      this.prepareOKNG();
      await this.getAPIGetStandard();

    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }




  }


  async setSensorID() {
    try {


      console.log("setSensorID", this.arrobjMCL1);
      if (this.arrobjMCL1.length > 0) {

        if (this.arrobjMCL1[0].processId == 28) {
          this.arrobjMCL1.filter(item => item.id === 446)[0].sensorId1 = 17;

          this.arrobjMCL1.filter(item => item.id === 447)[0].sensorId1 = 20;
          this.arrobjMCL1.filter(item => item.id === 448)[0].sensorId1 = 21;

          this.arrobjMCL1.filter(item => item.id === 449)[0].sensorId1 = 33;
          this.arrobjMCL1.filter(item => item.id === 449)[0].sensorId2 = 38;

          this.arrobjMCL1.filter(item => item.id === 432)[0].sensorId1 = 37;
          this.arrobjMCL1.filter(item => item.id === 432)[0].sensorId2 = 42;

          this.arrobjMCL1.filter(item => item.id === 416)[0].sensorId1 = 25;
          this.arrobjMCL1.filter(item => item.id === 418)[0].sensorId1 = 28;
          this.arrobjMCL1.filter(item => item.id === 419)[0].sensorId1 = 29;
          this.arrobjMCL1.filter(item => item.id === 420)[0].sensorId1 = 30;
          this.arrobjMCL1.filter(item => item.id === 421)[0].sensorId1 = 31;
          this.arrobjMCL1.filter(item => item.id === 444)[0].sensorId1 = 32;
          this.arrobjMCL1.filter(item => item.id === 422)[0].sensorId1 = 56;
        }
      }
      await this.getAPIGetCurrentMachineStatus();
    } catch (error) {
      throw error;
    }
  }

  setSensorVaule(objGetCurrentMachineStatus: any) {
    try {

      if (objGetCurrentMachineStatus.statuses != null) {
        objGetCurrentMachineStatus.statuses.forEach(statuse => {
          if (this.arrobjMCL1.filter(item => item.sensorId1 === statuse.sensorId).length == 1) {
            let objMCL1 = this.arrobjMCL1.filter(item => item.sensorId1 === statuse.sensorId)[0];
            objMCL1.col1Value = statuse.sensorNumericValue;
            if (objMCL1.stdMaxValue1 < statuse.sensorNumericValue || objMCL1.stdMinValue1 > statuse.sensorNumericValue) {
              objMCL1.col1OkNg = "NG";
            }
            else {
              objMCL1.col1OkNg = "OK";
            }
            console.log("setSensorVaule", objMCL1);
            this.arrobjMCL1.filter(item => item.sensorId1 === statuse.sensorId)[0] = objMCL1;
          }

          if (this.arrobjMCL1.filter(item => item.sensorId2 === statuse.sensorId).length == 1) {
            let objMCL2 = this.arrobjMCL1.filter(item => item.sensorId2 === statuse.sensorId)[0];
            objMCL2.col2Value = statuse.sensorNumericValue;
            if (objMCL2.stdMaxValue2 < statuse.sensorNumericValue || objMCL2.stdMinValue2 > statuse.sensorNumericValue) {
              objMCL2.col2OkNg = "NG";
            }
            else {
              objMCL2.col2OkNg = "OK";
            }
            console.log("setSensorVaule", objMCL2);
            this.arrobjMCL1.filter(item => item.sensorId2 === statuse.sensorId)[0] = objMCL2;
          }

        });
      }
    } catch (error) {
      console.log("setSensorVaule", error);
    }
  }


  async syncSensor() {
    this.dialogService.showLoader();
    try {
      await this.getAPIGetCurrentMachineStatus();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async getAPIGetCurrentMachineStatus() {

    try {

      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentMachineStatus + localStorage.getItem("MachineID"));
      if (data != null) {
        this.setSensorVaule(data);
      }
      // else {
      //   this.dialogService.showDialog("Error", "Error", "Data not found");
      //   this.dialogService.dialogRef.afterClosed().subscribe(result => {
      //     this.dialogService.hideLoader();
      //     this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
      //   })

      // }

      // await this.brokerAPIService.getAwait(
      //   this.UrlAPI_GetCurrentMachineStatus + localStorage.getItem("MachineID"),
      //   (data: any) => {
      //     console.log("getAPIGetCurrentMachineStatus :", data);
      //     if (data != null) {
      //       this.setSensorVaule(data);
      //     }
      //     else {
      //       this.dialogService.showDialog("Error", "Error", "Data not found");
      //       this.dialogService.dialogRef.afterClosed().subscribe(result => {
      //         this.dialogService.hideLoader();
      //         this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
      //       })

      //     }

      //   }
      // );

    } catch (error) {
      throw error;
    }


  }

  async getAPIPreviousRemark(productionOrderNo: string, productId: string, lotNo: string) {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetPreviousRemark + productionOrderNo + "," + productId + "," + lotNo);
      if (data != null) {
        this.remark = data;
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetPreviousRemark + productionOrderNo + "," + productId + "," + lotNo).subscribe(data => {
    //   console.log("UrlAPI_GetPreviousRemark", data);
    //   if (data != null) {
    //     this.remark = data;
    //   }
    // }, err => {
    //   console.log(err);
    // });
  }

  async getAPIProductionRecordByPlanAndLot(productionplanId: any, lotNo: any) {

    try {
      console.log("getAPIProductionRecordByPlanAndLot");

      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo);
      // await this.getAPIMachickListByPRId(data.id);
      this.objProductionRecord = data;
      if (this.objProductionRecord.startOperData != null && this.objProductionRecord.startOperData != undefined) {
        this.objStartOperData = this.objProductionRecord.startOperData;

        this.spindleNo = this.objProductionRecord.spindleNo;
        this.remark = this.objProductionRecord.remark;
        this.fabricRollNo = this.objProductionRecord.fabricRollNo;
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo).subscribe(data => {
    //   console.log("UrlAPI_GetByPlanAndLot", data);
    //   this.getAPIMachickListByPRId(data.id);
    //   this.objProductionRecord = data;
    //   if (this.objProductionRecord.startOperData != null && this.objProductionRecord.startOperData != undefined) {
    //     this.objStartOperData = this.objProductionRecord.startOperData;
    //     this.prepareOKNG();
    //     this.spindleNo = this.objProductionRecord.spindleNo;
    //     this.remark = this.objProductionRecord.remark;
    //     this.fabricRollNo = this.objProductionRecord.fabricRollNo;
    //   }

    // }, err => {
    //   console.log(err);
    // });
  }

  async getAPIMachineCheckListForStartProduction(processId: any, standardId: any) {
    try {
      if (this.objParams.planStatus == "0") {
        console.log(this.UrlAPI_GetMachineCheckListForStartProduction + this.onMachineId + "," + processId + "," + standardId);
        let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetMachineCheckListForStartProduction + this.onMachineId + "," + processId + "," + standardId);
        this.bindingDataCheckList(data);

        // this.brokerAPIService.get(this.UrlAPI_GetMachineCheckListForStartProduction + this.onMachineId + "," + processId + "," + standardId).subscribe(data => {
        //   console.log("UrlAPI_GetMachineCheckListForStartProduction", data);
        //   this.bindingDataCheckList(data);
        // }, err => {
        //   console.log(err);
        // });
      }
    } catch (error) {
      throw error;
    }

  }

  async getAPIMachickListByPRId(productionrecordid: any) {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetMachickListByPRId + productionrecordid);
      console.log("UrlAPI_GetMachickListByPRId", data);
      if (data != null && data != undefined) {
        this.bindingDataCheckList(data.checkLists);
      }
    } catch (error) {
      throw error;
    }
    // this.brokerAPIService.get(this.UrlAPI_GetMachickListByPRId + productionrecordid).subscribe(data => {
    //   console.log("UrlAPI_GetMachickListByPRId", data);
    //   if (data != null && data != undefined) {
    //     this.bindingDataCheckList(data.checkLists);
    //   }
    // }, err => {
    //   console.log(err);
    // });
  }

  private bindingDataCheckList(data: any) {
    if (data != null && data != undefined) {
      if (this.PageMode == "A")
        data.forEach(element => {
          element.col1Value = "";
          element.col2Value = "";
        });

      if (data.length > 0) {



        this.arrobjMCL1 = data.filter(x => x.groupOrder === 1).sort((a, b) => parseFloat(a.lineOrder) - parseFloat(b.lineOrder));
        this.arrobjMCL2 = data.filter(x => x.groupOrder === 2).sort((a, b) => parseFloat(a.lineOrder) - parseFloat(b.lineOrder));
        this.arrobjMCL3 = data.filter(x => x.groupOrder === 3).sort((a, b) => parseFloat(a.lineOrder) - parseFloat(b.lineOrder));



      }
    }
  }





  validate =
    [{
      name: "1",
      text: "A",
    }
      , {
      name: "2",
      text: "B",
    }
    ]


  getdata() {
    this.dialogService.showLoader();
    let objdata: any;
    objdata = {};

    if (this.PageMode == "E") {
      objdata.id = this.objProductionRecord.id;
      objdata = this.objProductionRecord;

      delete objdata["machineCheckLists"];
      delete objdata["productionPlan"];
      delete objdata["inlineInspections"];
      delete objdata["mixedSolutions"];
      delete objdata["standardInspection"];
      delete objdata["updateDate"];
      delete objdata["createDate"];
    }

    if (this.objProductionRecord.createBy != undefined && this.objProductionRecord.createBy != null) {
      objdata.createBy = this.objProductionRecord.createBy;
    }
    else {
      objdata.createBy = this.currentUserName;
    }


    objdata.productionPlanId = Number(this.objParams.productionPlanID);
    objdata.lotNo = Number(this.lotNo);
    // objdata.productionRecordStatus = "";

    objdata.onMachineId = Number(this.onMachineId);
    objdata.teamId = Number(this.teamId);
    objdata.shiftId = Number(this.shiftId);
    objdata.machineCheckListId = Number(localStorage.getItem("MachineID"));
    objdata.processId = Number(this.processId);
    // objdata.startProductionTime = new Date();
    // objdata.endProductionTime =  Date.now;
    objdata.fabricRollNo = this.fabricRollNo;
    objdata.spindleNo = this.spindleNo;
    objdata.remark = this.remark;


    objdata.startOperData = <IProductionRecord_JobOrder_startOperData>this.getstartOperData();

    objdata.updateBy = this.currentUserName;

    console.log("getdata");
    console.log(objdata);
    this.dialogService.hideLoader();
    return objdata;
  }

  getstartOperData() {
    this.dialogService.showLoader();
    let objdata: any;
    objdata = {};
    objdata = this.objStartOperData;
    if (this.objStartOperData.id != undefined && this.objStartOperData.id != null) {
      objdata.id = this.objStartOperData.id;
    }

    if (this.objStartOperData.createBy != undefined && this.objStartOperData.createBy != null) {
      objdata.createBy = this.objStartOperData.createBy;
    }
    else {
      objdata.createBy = this.currentUserName;
    }


    objdata.leftWeight = +this.objStartOperData.leftWeight;
    objdata.centerWeight = +this.objStartOperData.centerWeight;
    objdata.rightWeight = +this.objStartOperData.rightWeight;

    objdata.leftThickness = +this.objStartOperData.leftThickness;
    objdata.centerThickness = +this.objStartOperData.centerThickness;
    objdata.rightThickness = +this.objStartOperData.rightThickness;

    objdata.fabricWidth = +this.objStartOperData.fabricWidth;
    objdata.fabricLength = +this.objStartOperData.fabricLength;
    objdata.fabricSet = +this.objStartOperData.fabricSet;


    if (this.IsLeftCrease == "NG") {
      objdata.isLeftCrease = false;
    }
    else {
      objdata.isLeftCrease = true;
    }

    if (this.IsSmoothRoll == "NG") {
      objdata.isSmoothRoll = false;
    }
    else {
      objdata.isSmoothRoll = true;
    }

    // if(this.fabricSet1 == "OK" && this.fabricSet2 == "OK")
    // {
    //   objdata.fabricSet = "OK";
    // }
    // else
    // {
    //   objdata.fabricSet = "NG";
    // }

    //if (this.objProductionRecord.id != undefined && this.objProductionRecord.id != null) {
    objdata.productionRecordId = this.objProductionRecord.id;
    //}

    delete objdata["updateDate"];
    delete objdata["createDate"];
    //  delete objdata["workerId"];

    objdata.updateBy = this.currentUserName;
    // let objdata: StartOperData; 
    // objdata = <StartOperData> {};
    // objdata.
    this.dialogService.hideLoader();
    return objdata;


  }
  getdataMachineCheckList(productionRecordId: number) {
    this.dialogService.showLoader();
    let objdata: any;
    objdata = {};

    objdata.productionRecordId = productionRecordId;
    objdata.checkBy = this.currentUserName;
    //objdata.checkDateTime
    objdata.reviewBy = this.currentUserName;
    //objdata.reviewDateTime
    objdata.remark = this.remark;
    objdata.createBy = this.currentUserName;
    objdata.updateBy = this.currentUserName;


    let arrcheckLists = [];
    this.preparedata(this.arrobjMCL1, productionRecordId, arrcheckLists);
    this.preparedata(this.arrobjMCL2, productionRecordId, arrcheckLists);
    this.preparedata(this.arrobjMCL3, productionRecordId, arrcheckLists);

    objdata.checkLists = arrcheckLists;
    console.log(JSON.stringify(objdata));
    return objdata;
  }

  private preparedata(arrobjMCL: any[], productionRecordId: number, arrcheckLists: any[]) {

    arrobjMCL.forEach(element => {
      let objcheckLists: any = {};
      objcheckLists.prMachineCheckListId = productionRecordId;
      objcheckLists.machineCheckListProcessId = element.id;
      objcheckLists.groupOrder = element.groupOrder;
      objcheckLists.lineOrder = element.lineOrder;
      objcheckLists.noColumnInLine = element.noColumnInLine;
      objcheckLists.captionCol1 = element.captionCol1;
      objcheckLists.dataTypeCol1 = element.dataTypeCol1;
      objcheckLists.captionCol2 = element.captionCol2;
      objcheckLists.dataTypeCol2 = element.dataTypeCol2;
      objcheckLists.col1Value = Number(element.col1Value);

      if (element.col1OkNg != undefined) {
        if (element.col1OkNg == "OK") {
          objcheckLists.col1OkNg = true;
        }
        else {
          objcheckLists.col1OkNg = false;
        }
      }
      else {
        objcheckLists.col1OkNg = false;
      }

      if (element.col2OkNg != undefined) {
        if (element.col2OkNg == "OK") {
          objcheckLists.col2OkNg = true;
        }
        else {
          objcheckLists.col2OkNg = false;
        }
      }
      else {
        objcheckLists.col2OkNg = false;
      }

      objcheckLists.col2Value = Number(element.col2Value);
      objcheckLists.createBy = this.currentUserName;
      objcheckLists.updateBy = this.currentUserName;
      arrcheckLists.push(objcheckLists);
    });
    this.dialogService.hideLoader();
  }

  private hasNG(arrobjMCL: any[]): boolean {
    let hasNG: boolean = false;
    arrobjMCL.forEach(element => {
      if (element.dataTypeCol1 != "1") {
        if (element.col1OkNg != undefined) {
          if (element.col1OkNg != "OK") {
            // console.log(element.id);
            hasNG = true;
            return true;
          }
        }
        else if (element.col1OkNg == undefined) {
          // console.log(element.id);
          hasNG = true;
          return true;
        }
      }


      if (element.noColumnInLine == 2) {
        if (element.dataTypeCol2 != "1") {
          if (element.col2OkNg != undefined) {
            if (element.col2OkNg != "OK") {
              // console.log(element.id);
              hasNG = true;
              return true;
            }
          }
          else if (element.col2OkNg == undefined) {
            // console.log(element.id);
            hasNG = true;
            return true;
          }
        }
      }

    });

    return hasNG;
  }

  async createMachineCheckList(productionRecordId: number) {
    try {
      // this.getdataMachineCheckList(productionRecordId)

      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_CreateMachineCheckList, this.getdataMachineCheckList(productionRecordId));
      this.objAPIResponse = <IAPIResponse>data;
      console.log("dataMachineCheckList", data);


      return this.objAPIResponse.success;
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService
    //   .post(this.UrlAPI_CreateMachineCheckList, this.getdataMachineCheckList(productionRecordId))
    //   .subscribe(
    //     data => {
    //       this.objAPIResponse = <IAPIResponse>data;
    //       if (this.objAPIResponse.success) {
    //         this.showSnackBar("Save Complete");
    //         this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
    //       } else {
    //         this.showSnackBar(this.objAPIResponse.message);
    //         console.log("this.objAPIResponse :" + JSON.stringify(this.objAPIResponse));

    //       }
    //     },
    //     err => {
    //       // กรณี error
    //       console.log("Something went wrong!");
    //     }
    //   );
  }
  btnStartOperationClick() {
    this.dialogService.showLoader();
    try {

      if (this.validateCreateJobOrder()) {
        // this.createMachineCheckList(Number());
        this.createJobOrder();
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();

    //this.router.navigate([this.Url_Listing]);
  }

  validateCreateJobOrder() {
    this.getdata();
    console.log("validateCreateJobOrder");

    console.log(this.objProductionPlan.rollNo);
    console.log(this.fabricRollNo);

    if (this.hasNG(this.arrobjMCL1)) {
      this.showDialog("error", "Error", "Machine check list has NG");
      return false;
    }

    if (this.hasNG(this.arrobjMCL2)) {
      this.showDialog("error", "Error", "Machine check list has NG");
      return false;
    }

    if (this.hasNG(this.arrobjMCL3)) {
      this.showDialog("error", "Error", "Machine check list has NG");
      return false;
    }

    if (this.IsLeftCrease == "NG") {
      this.showDialog("error", "Error", "Machine check list has NG");
      return false;
    }
 

    if (this.IsSmoothRoll == "NG") {
      this.showDialog("error", "Error", "Machine check list has NG");
      return false;
    }



    if (this.objProductionPlan.rollNo != this.fabricRollNo) {
      this.showDialog("error", "Error", "Invalid RollNo");
      return false;
    }

    return true;
  }

  async createJobOrder() {
    // this.getdata();

    try {
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_CreateJobOrder, this.getdata());
      this.objAPIResponse = <IAPIResponse>data;
      console.log("createJobOrder", data);

      if (this.objAPIResponse.success) {
        let isSuccess: boolean = await this.createMachineCheckList(Number(this.objAPIResponse.data));
        if (isSuccess) {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
        } else {
          this.dialogService.showSnackBar("Save Complete");
          this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
        }
      }
      else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }

    } catch (error) {
      throw error;
    }


    // this.brokerAPIService
    //   .post(this.UrlAPI_CreateJobOrder, this.getdata())
    //   .subscribe(
    //     data => {
    //       this.objAPIResponse = <IAPIResponse>data;
    //       if (this.objAPIResponse.success) {
    //         console.log("this.objAPIResponse :" + JSON.stringify(this.objAPIResponse));
    //         this.createMachineCheckList(Number(this.objAPIResponse.data));
    //       } else {
    //         this.showSnackBar(this.objAPIResponse.message);
    //         console.log("this.objAPIResponse :" + JSON.stringify(this.objAPIResponse));

    //       }
    //     },
    //     err => {
    //       // กรณี error
    //       console.log("Something went wrong!");
    //     }
    //   );
  }



  async getAPICurrentJob() {

    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false);
      if (data != null) {
        this.objCurrentJob = data;
      }
    } catch (error) {
      throw error;
    }


    // this.brokerAPIService.get(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false).subscribe(data => {
    //   console.log("this.objCurrentJob data", data);
    //   if (data != null) {
    //     this.objCurrentJob = data;
    //     this.getProductionRecord(this.objCurrentJob.productionRecordId);
    //   }
    // });
  }

  async getProductionRecord(productionRecordId: any) {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionRecord + productionRecordId);
      if (data != null) {
        // await this.getAPIMachickListByPRId(data.id);
        console.log("getProductionRecord", data);

        this.objProductionRecord = data;
        if (this.objProductionRecord.startOperData != null && this.objProductionRecord.startOperData != undefined) {
          this.objStartOperData = this.objProductionRecord.startOperData;
          this.spindleNo = this.objProductionRecord.spindleNo;
          this.remark = this.objProductionRecord.remark;
          this.fabricRollNo = this.objProductionRecord.fabricRollNo;
        }
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetProductionRecord + productionRecordId).subscribe(data => {
    //   console.log("UrlAPI_GetProductionRecord", data);
    //   if (data != null) {
    //     this.getAPIMachickListByPRId(data.id);
    //     this.objProductionRecord = data;
    //     if (this.objProductionRecord.startOperData != null && this.objProductionRecord.startOperData != undefined) {
    //       this.objStartOperData = this.objProductionRecord.startOperData;
    //       this.spindleNo = this.objProductionRecord.spindleNo;
    //       this.remark = this.objProductionRecord.remark;
    //       this.fabricRollNo = this.objProductionRecord.fabricRollNo;
    //     }
    //   }
    // });
  }


  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
  }



  btnSaveClick() {


    this.save()
    //this.router.navigate([this.Url_Listing]);
  }

  save() {
    this.dialogService.showLoader();
    if (this.PageMode == "E") {
      this.brokerAPIService
        .post(this.UrlAPI_UpdateJobOrder, this.getdata())
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.showSnackBar("Save Complete");
              this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
            } else {
              console.log("this.objAPIResponse :" + JSON.stringify(this.objAPIResponse));
              this.showDialog("Error", "Save Error", this.objAPIResponse.message);
            }
          },
          err => {
            // กรณี error
            console.log("Something went wrong!");
          }
        );
    }
    this.dialogService.hideLoader();
  }


  async btnFinishTaskClick() {
    try {
      this.dialogService.showLoader();
      await this.headFinishJobOrder();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async headFinishJobOrder() {
    try {
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_HeadFinishJobOrder, this.getdata());
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

    // this.brokerAPIService
    //   .post(this.UrlAPI_HeadFinishJobOrder, this.getdata())
    //   .subscribe(
    //     data => {
    //       this.objAPIResponse = <IAPIResponse>data;
    //       if (this.objAPIResponse.success) {
    //         this.showSnackBar("Save Complete");
    //         this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
    //       } else {
    //         console.log(
    //           "this.objAPIResponse.success :" + this.objAPIResponse.success
    //         );
    //       }
    //     },
    //     err => {
    //       // กรณี error
    //       console.log("Something went wrong!");
    //     }
    //   );
  }





  private prepareOKNG() {
    if (this.objStartOperData.isSmoothRoll) {
      this.IsSmoothRoll = "OK";
    }
    else {
      this.IsSmoothRoll = "NG";
    }

    if (this.objStartOperData.isLeftCrease) {
      this.IsLeftCrease = "OK";
    }
    else {
      this.IsLeftCrease = "NG";
    }
  }

  txtWeightChange(newValue) {
    // this.ValidateTolerance(newValue, this.objStandard.weight);
    this.ValidateToleranceStandard(newValue, this.objStandard.inWeightMin, this.objStandard.inWeightMax);
  }

  txtTicknessChange(newValue) {
    // this.ValidateTolerance(newValue, this.objStandard.tickness);
    this.ValidateToleranceStandard(newValue, this.objStandard.inTicknessMin, this.objStandard.inTicknessMax);
  }

  txtWidthChange(newValue) {
    //this.ValidateTolerance(newValue, this.objStandard.width);
    this.ValidateToleranceStandard(newValue, this.objStandard.inWidthMin, this.objStandard.inWidthMax);
  }

  txtPlanQtyChange(newValue) {
    this.ValidateTolerance(newValue, this.objProductionPlan.planQty);
  }

  txtFabricSetChange(newValue) {
    this.ValidateTolerance(newValue, this.objStandard.fabricSet);
  }

  private ValidateToleranceStandard(newValue: any, Min: number, Max) {
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
      this.dialogService.showDialog("error", "Warning", "ข้อมูลไม่อยู่ในช่วงมาตรฐาน " + Mintolerance + " - " + Maxtolerance);
    }
    if (newValue < Mintolerance) {
      this.dialogService.showDialog("error", "Warning", "ข้อมูลไม่อยู่ในช่วงมาตรฐาน " + Mintolerance + " - " + Maxtolerance);
    }
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

  async getAPIGetStandard() {
    try {
      // this.objStandard
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetStandard + this.objParams.standardId);
      if (data != null) {
        this.objStandard = data;
        console.log("getAPIGetStandard" + this.objStandard);

      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetStandard + this.objParams.standardId).subscribe(data => {
    //   console.log("getAPIGetStandard", data)
    //   if (data != null) {
    //     this.objStandard = data;
    //   }
    // });
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


