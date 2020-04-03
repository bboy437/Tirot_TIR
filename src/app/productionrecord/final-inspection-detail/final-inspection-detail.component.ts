

import { Component, OnInit, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAPIResponse } from '../../interfaces/apiResponse';
import { FinalInspection } from '../../interfaces/productionrecords';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MatSort,
  MatPaginator,
  MatTableDataSource,
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";
import { FinalInspectionDetailDialogComponent } from './dialog/final-inspection-detail-dialog/final-inspection-detail-dialog.component';
import { id } from '@swimlane/ngx-charts/release/utils';
import { ConfirmDeleteDialogComponent } from '../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';
import { DialogService } from '../../services/dialog.service';

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY  HH:mm"
  },
  display: {
    dateInput: "DD/MM/YYYY  HH:mm",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


@Component({
  selector: 'app-final-inspection-detail',
  templateUrl: './final-inspection-detail.component.html',
  styleUrls: ['./final-inspection-detail.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FinalInspectionDetailComponent implements OnInit {

  startdate: Moment = moment();
  enddate: Moment = moment();
  dataSource = new MatTableDataSource();
  dataSourceFabricDetail = new MatTableDataSource();
  dataSourceCoatDetail = new MatTableDataSource();


  displayedColumns = [
    "rollNo",
    "length",
    "width",
    "diameter",
    "spindleWeight",
    "totalWeight",
    "grade",
    "sample",
    "remark",
    "actions"
  ];

  displayedColumnsFabricDetail = [
    "detailDate",
    "rawMaterial",
    "rollNoNT",
    "rollNo",
    "fabricWidth",
    "fabricLength",
    "fabricWeigth",
    "remark",
  ];

  displayedColumnsCoatDetail = [
    "coatDate",
    "fabricWidthBefore",
    "fabricWidthAfter",
    "processName",
    "shiftName",
    "fabricLength",
  ];



  dataSourcedefect = new MatTableDataSource();
  displayedColumnsdefect = [
    "Length",
    "Defect",
    "Position"
  ];

  dialogRefFinalInspectionDetail: MatDialogRef<FinalInspectionDetailDialogComponent>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  private UrlAPI_GetSingleRow: string = "FinalInspection/Get/";
  private UrlAPI_Update: string = "FinalInspection/Update";
  private UrlAPI_Save: string = "FinalInspection/Save";
  private UrlAPI_FinishInspect: string = "FinalInspection/FinishInspect";
  private Url_Listing: string = "/auth/productionrecord/final-inspection-list";
  private UrlAPI_GeNextRollNo: string = "FinalInspection/GeNextRollNo";
  EdgeCut: string;
  objRow: any = {};
  objAPIResponse: any = {};
  private RowID: string;
  objProductionRecord: any = {};
  PackingNo: any;
  objfinishGoodsDetail: any = {};
  dialogRefDelete: MatDialogRef<{}, any>;
  dialogRef: MatDialogRef<MessageDialogComponent, any>;
  ProductionRecordID: any;
  private UrlAPI_GetByPlanAndLot: string = "ProductionRecord/GetByPlanAndLot/"
  private UrlAPI_GetFabricDetail: string = "FinalInspection/GetFabricDetail/"
  private UrlAPI_GetCoatDetail: string = "FinalInspection/GetCoatDetail/"
  private UrlAPI_GetDefactList: string = "FinalInspection/GetDefactList/"
  private UrlAPI_GetCurrentShift: string = "Visualization/GetCurrentShift"
  private UrlAPI_GetByPRID: string = "FinalInspection/GetByPRID/";

  StartTime: Date;
  RefDocNo: any;
  ProductionLength: number;
  ProductionLengthVariant: number;
  NextRollNo: number;
  dataPRID: any = {};

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: DialogService) { }

  async ngOnInit() {

    try {

      this.StartTime = new Date();

      let params = this.route.snapshot.paramMap;
      if (params.has("objProductionRecord")) {
        this.objProductionRecord = JSON.parse(params.get("objProductionRecord"));
        this.dataPRID = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPRID + this.objProductionRecord.id)
        console.log("data", this.dataPRID);
        if (this.dataPRID == null) {
          this.PackingNo = '[AUTO]';
          this.EdgeCut = "N";
          this.ProductionLength = this.objProductionRecord.productionLength;
          this.ProductionLengthVariant = this.ProductionLength + (this.ProductionLength * 5 / 100);
        } else {
          this.PackingNo = this.dataPRID.packingNo;
          this.RefDocNo = this.dataPRID.refDocNo;
          if (this.dataPRID.edgeCut == false) {
            this.EdgeCut = "N";
          } else {
            this.EdgeCut = "Y";
          }
          this.dataSource.data = this.dataPRID.finishGoodsDetails;

          this.ProductionLength = this.objProductionRecord.productionLength;
          this.ProductionLengthVariant = this.ProductionLength + (this.ProductionLength * 5 / 100);
        }



        // console.log(this.ProductionLengthVariant + ":" + this.ProductionLength);
        // console.log(" this.objProductionRecord", this.objProductionRecord);

        await this.getAPINextRollNo();
        await this.getAPIProductionRecordByPlanAndLot(this.objProductionRecord.productionPlan.id, this.objProductionRecord.productionPlan.lotNo);
        await this.getAPIFabricDetail(this.objProductionRecord.productionPlan.productionOrderNo, this.objProductionRecord.productionPlan.lotNo);
        await this.getAPICoatDetail(this.objProductionRecord.productionPlan.productionOrderNo, this.objProductionRecord.productionPlan.lotNo);
        await this.getAPIDefactList(this.ProductionRecordID);
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }





  async getAPINextRollNo() {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GeNextRollNo)
      if (data != null) {
        this.NextRollNo = data;
      }

    } catch (error) {
      throw error;
    }

  }

  async btnFinishClick() {
    try {

      if (this.validateData()) {
        this.dialogService.showLoader();
        await this.saveFinish();
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  datasaveFinish: any = {};
  async saveFinish() {
    try {
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Save, this.getData());
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        if (this.dataPRID == null) {
          this.datasaveFinish = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPRID + this.objProductionRecord.id)
          console.log("data", this.dataPRID);
        } else { }
        await this.finishInspect();
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }
  }

  datafinishInspect: any = {};
  async finishInspect() {
    try {
      if (this.dataPRID == null) {
        this.datafinishInspect = await this.brokerAPIService.postAwait(this.UrlAPI_FinishInspect, this.datasaveFinish);
      } else {
        this.datafinishInspect = await this.brokerAPIService.postAwait(this.UrlAPI_FinishInspect, this.getData());
      }
      this.objAPIResponse = <IAPIResponse>this.datafinishInspect;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
        this.router.navigate([this.Url_Listing]);
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }
  }




  btnCloseClick() {
    this.router.navigate([this.Url_Listing]);
  }


  async btnSaveClick() {
    try {
      if (this.validateData()) {
        this.dialogService.showLoader();
        await this.save();
      }
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async save() {
    try {
      console.log("getData", this.getData());
      let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_Save, this.getData());
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");
        this.router.navigate([this.Url_Listing]);
      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }
  }

  getData() {

    let objData: any = {};

    if (this.dataPRID == null) {
      if (this.EdgeCut == "Y") {
        objData.edgeCut = true;
      }
      else {
        objData.edgeCut = false;
      }

      objData.finishGoodsDetails = JSON.parse(JSON.stringify(this.objRow.finishGoodsDetails, ["rollNo", "length", "width", "diameter", "spindleWeight", "totalWeight", "gradeId", "sampleInLength", "sampleInQty", "remark", "createBy", "updateBy", "createDate", "updateDate"]));
      objData.finishGoodsId = this.objProductionRecord.productionPlan.productId;
      objData.productionRecordId = this.ProductionRecordID;
      objData.startWorkTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      objData.endWorkTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      objData.packingDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      objData.refDocNo = this.RefDocNo;
      objData.createBy = localStorage.getItem("currentUserName");
      objData.updateBy = localStorage.getItem("currentUserName");
    } else {
      if (this.EdgeCut == "Y") {
        objData.edgeCut = true;
      }
      else {
        objData.edgeCut = false;
      }
      objData.finishGoodsDetails = this.dataPRID.finishGoodsDetails;
      //objData.finishGoodsDetails = JSON.parse(JSON.stringify(this.dataPRID.finishGoodsDetails, ["rollNo", "length", "width", "diameter", "spindleWeight", "totalWeight", "gradeId", "sampleInLength", "sampleInQty", "remark", "createBy", "updateBy", "createDate", "updateDate"]));
      objData.id = this.dataPRID.id
      objData.packingNo = this.PackingNo;
      objData.packerId = this.dataPRID.packerId;
      objData.inspectionStatus = this.dataPRID.inspectionStatus;
      objData.productionRecordId = this.dataPRID.productionRecordId;
      objData.startWorkTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      objData.endWorkTime = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      objData.packingDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
      objData.refDocNo = this.RefDocNo;
      objData.createBy = localStorage.getItem("currentUserName");
      objData.updateBy = localStorage.getItem("currentUserName");
 
      //  objData = this.dataPRID;
    }

    return objData
  }

  validateData() {
    if (this.dataPRID == null) {
      if (this.objRow.finishGoodsDetails != undefined && this.objRow.finishGoodsDetails != null) {
        let totalLength = 0;
        this.objRow.finishGoodsDetails.forEach(element => {
          totalLength += element.length;
        });

        if (this.ProductionLengthVariant < totalLength) {
          this.dialogService.showDialog("Error", "Error", "Inspection Length > Production Length !");
          return false;
        }
        else if (totalLength == 0) {
          this.dialogService.showDialog("Error", "Error", "Inspection Length");
          return false;
        }
      }
    } else {
      if (this.dataPRID.finishGoodsDetails != undefined && this.dataPRID.finishGoodsDetails != null) {
        let totalLength = 0;
        this.dataPRID.finishGoodsDetails.forEach(element => {
          totalLength += element.length;
        });
        if (this.ProductionLengthVariant < totalLength) {

          this.dialogService.showDialog("Error", "Error", "Inspection Length > Production Length !");
          return false;
        }
        else if (totalLength == 0) {
          this.dialogService.showDialog("Error", "Error", "Inspection Length");
          return false;
        }

      }

    }

    return true;
  }

  addNew() {
    if (this.dataPRID == null) {
      let data = {
        data: this.objRow.finishGoodsDetails,
        papram: this.getItemNo()
      }
      const dialogRef = this.dialog.open(FinalInspectionDetailDialogComponent, {
        data: data,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        if (result != undefined) {
          if (this.objRow.finishGoodsDetails == undefined) {
            this.objRow.finishGoodsDetails = [];
            this.objRow.finishGoodsDetails[0] = result;
          } else {
            this.objRow.finishGoodsDetails.push(result);
          }
          this.bindOrderItemDataSource();
        }
      });
    } else {
      let data = {
        data: this.dataPRID.finishGoodsDetails,
        papram: this.getItemNo()
      }
      const dialogRef = this.dialog.open(FinalInspectionDetailDialogComponent, {
        data: data,
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log("result",this.dataPRID.finishGoodsDetails);
        if (result != undefined) {
          if (this.dataPRID.finishGoodsDetails == undefined) {
            this.dataPRID.finishGoodsDetails = [];
            this.dataPRID.finishGoodsDetails[0] = result;
          } else {
            this.dataPRID.finishGoodsDetails.push(result);
          }
          console.log("finishGoodsDetails",this.dataPRID.finishGoodsDetails);
          
          this.bindOrderItemDataSource();
        }
      });
    }

  }

  startEditdata: any = {};
  startEdit(Editid: number, EditrollNo: number) {
    //this.objfinishGoodsDetail = this.objRow.finishGoodsDetails.find(x => x.rollNo === rollNo);
    // console.log("this.objoperationInstruction");
    // console.log(this.objoperationInstruction);
    if (this.dataPRID == null) {
      this.startEditdata = {
        data: this.objRow.finishGoodsDetails,
        papram: { id: Editid, rollNo: EditrollNo }
      }
      this.dialogRefFinalInspectionDetail = this.dialog.open(FinalInspectionDetailDialogComponent,
        {
          data: this.startEditdata,
          disableClose: true
        }
      );

      this.dialogRefFinalInspectionDetail.afterClosed().subscribe(result => {
        console.log("afterClosed Edit", result);
        if (result != undefined) {
          console.log("afterClosed this.objRow.finishGoodsDetails", this.objRow.finishGoodsDetails);
          let objRowEdit = this.objRow.finishGoodsDetails.find(x => x.rollNo === EditrollNo);
          console.log("afterClosed objRowEdit", objRowEdit);
          objRowEdit.rollNo = result.rollNo;
          objRowEdit.length = result.length;
          objRowEdit.width = result.width;
          objRowEdit.diameter = result.diameter;
          objRowEdit.spindleWeight = result.spindleWeight;
          objRowEdit.totalWeight = result.totalWeight;
          objRowEdit.gradeId = result.gradeId;
          // objRowEdit.grade = result.grade;
          objRowEdit.sampleInLength = result.sampleInLength;
          objRowEdit.sampleInQty = result.sampleInQty;
          objRowEdit.remark = result.remark;

        }
        this.bindOrderItemDataSource();
      });
    }
    else {
      this.startEditdata = {
        data: this.dataPRID.finishGoodsDetails,
        papram: { id: Editid, rollNo: EditrollNo }
      }
      this.dialogRefFinalInspectionDetail = this.dialog.open(FinalInspectionDetailDialogComponent,
        {
          data: this.startEditdata,
          disableClose: true
        }
      );

      this.dialogRefFinalInspectionDetail.afterClosed().subscribe(result => {
        if (result != undefined) {
          let objRowEdit = this.dataPRID.finishGoodsDetails.find(x => x.rollNo === EditrollNo);
          console.log("afterClosed objRowEdit", objRowEdit);
          objRowEdit.rollNo = result.rollNo;
          objRowEdit.length = result.length;
          objRowEdit.width = result.width;
          objRowEdit.diameter = result.diameter;
          objRowEdit.spindleWeight = result.spindleWeight;
          objRowEdit.totalWeight = result.totalWeight;
          objRowEdit.gradeId = result.gradeId;
          // objRowEdit.grade = result.grade;
          objRowEdit.sampleInLength = result.sampleInLength;
          objRowEdit.sampleInQty = result.sampleInQty;
          objRowEdit.remark = result.remark;

        }
        this.bindOrderItemDataSource();
      });
    }
  }


  deleteItem(index: number, rollNo: number) {
    if (this.dataPRID == null) {
      this.dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
        // data: {id: id, title: title, state: state, url: url}
        disableClose: true
      });

      this.dialogRefDelete.afterClosed().subscribe(result => {
        if (result) {
          this.objRow.finishGoodsDetails = this.objRow.finishGoodsDetails.filter(
            x => x.rollNo !== rollNo
          );
          this.bindOrderItemDataSource();
        }
      });
    } else {
      this.dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
        // data: {id: id, title: title, state: state, url: url}
        disableClose: true
      });

      this.dialogRefDelete.afterClosed().subscribe(result => {
        if (result) {
          this.dataPRID.finishGoodsDetails = this.dataPRID.finishGoodsDetails.filter(
            x => x.rollNo !== rollNo
          );
          this.bindOrderItemDataSource();
        }
      });
    }

  }


  private bindOrderItemDataSource() {
    console.log("this.dataSource.data", this.dataSource.data);
    if (this.dataPRID == null) {
      this.dataSource.data = this.objRow.finishGoodsDetails.sort(function (a, b) { return a.rollNo - b.rollNo; });
    } else {
      this.dataSource.data = this.dataPRID.finishGoodsDetails.sort(function (a, b) { return a.rollNo - b.rollNo; });
    }

  }

  private getItemNo() {
    console.log(this.objRow.finishGoodsDetails);

    let objFinishGoodsDetails: any = {};
    objFinishGoodsDetails.id = 0;

    if (this.dataPRID == null) {
      if (this.objRow.finishGoodsDetails == undefined && this.objRow.finishGoodsDetails == null) {
        this.objRow.finishGoodsDetails = [];
      }
      if (this.objRow.finishGoodsDetails.length > 0) {
        objFinishGoodsDetails.rollNo = this.objRow.finishGoodsDetails[this.objRow.finishGoodsDetails.length - 1].rollNo + 1;
      }
      else {
        if (this.NextRollNo != 0) {
          objFinishGoodsDetails.rollNo = this.NextRollNo;
        }
        else {
          objFinishGoodsDetails.rollNo = 1;
        }
      }
    }
    else {
      if (this.dataPRID.finishGoodsDetails == undefined && this.dataPRID.finishGoodsDetails == null) {
        this.dataPRID.finishGoodsDetails = [];
      }
      if (this.dataPRID.finishGoodsDetails.length > 0) {
        objFinishGoodsDetails.rollNo = this.dataPRID.finishGoodsDetails[this.dataPRID.finishGoodsDetails.length - 1].rollNo + 1;
      }
      else {
        if (this.NextRollNo != 0) {
          objFinishGoodsDetails.rollNo = this.NextRollNo;
        }
        else {
          objFinishGoodsDetails.rollNo = 1;
        }
      }
    }
    return objFinishGoodsDetails;
  }


  private async getAPIDefactList(productionRecordId: any) {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetDefactList + productionRecordId);
      if (data != null && data != undefined) {
        console.log("getAPIDefactList", data);

        this.dataSourcedefect = data;
      }
    } catch (error) {
      throw error;
    }

  }

  private async getAPIProductionRecordByPlanAndLot(productionplanId: any, lotNo: any) {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo);
      if (data != null && data != undefined) {
        if (data.inlineInspections != null) {
          this.ProductionRecordID = data.id;
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
    //     }
    //   }
    // }, err => {
    //   console.log(err);
    // });
  }

  private async getAPIFabricDetail(productionorderNo: any, lotNo: any) {

    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetFabricDetail + productionorderNo + "," + lotNo);
      if (data != null && data != undefined) {
        this.dataSourceFabricDetail = data;
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetFabricDetail + productionorderNo + "," + lotNo).subscribe(data => {
    //   console.log("getAPIFabricDetail", data);
    //   if (data != null && data != undefined) {
    //     this.dataSourceFabricDetail = data;
    //   }
    // }, err => {
    //   console.log(err);
    // });
  }


  private async getAPICoatDetail(productionorderNo: any, lotNo: any) {

    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetCoatDetail + productionorderNo + "," + lotNo);
      if (data != null && data != undefined) {
        this.dataSourceCoatDetail = data;
      }
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetCoatDetail + productionorderNo + "," + lotNo).subscribe(data => {
    //   // console.log("UrlAPI_GetByPlanAndLot", data);
    //   if (data != null && data != undefined) {
    //     this.dataSourceCoatDetail = data;
    //   }
    // }, err => {
    //   console.log(err);
    // });

  }



}


