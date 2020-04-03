import { Component, OnInit, ViewEncapsulation, ViewChild, Inject } from '@angular/core';

import { BrokerAPIService } from '../../../../services/brokerapi.service';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatDialog, MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";
import { DialogService } from '../../../../services/dialog.service';

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};



@Component({
  selector: 'app-final-inspection-detail-dialog',
  templateUrl: './final-inspection-detail-dialog.component.html',
  styleUrls: ['./final-inspection-detail-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FinalInspectionDetailDialogComponent implements OnInit {
  isLoadingResults = false;
  UrlAPI_GradeGetAllActive: string = "Grade/GetAllActive";

  objarrGrade: any = [];
  objfinishGoodsDetails: any = {};

  strDialogStatus: string;
  beforeRollNo = null;
  beforeLength = null;
  beforeWidth = null;
  beforeDiameter = null;
  beforeSpindleWeight = null;
  beforeTotalWeight = null;
  beforeSampleInLength = null;
  beforeSampleInQty = null;
  beforeRemark = null;
  beforeGradeID: any;

  RollNo = null;
  Length = null;
  Width = null;
  Diameter = null;
  SpindleWeight = null;
  TotalWeight = null;
  SampleInLength = null;
  SampleInQty = null;
  Remark = null;
  GradeID: any;
  isInvalidData: boolean;
  constructor(private brokerAPIService: BrokerAPIService,
    @Inject(MAT_DIALOG_DATA) public dataFinishGoodsDetails: any,
    private dialogRef: MatDialog,
    private dialogService: DialogService) { }

  async ngOnInit() {

    try {
      console.log("this.dataFinishGoodsDetails", this.dataFinishGoodsDetails.data);
      if (this.dataFinishGoodsDetails.papram.id == 0) {
        this.strDialogStatus = "A";
        this.RollNo = this.dataFinishGoodsDetails.papram.rollNo;
      }
      else {
        this.strDialogStatus = "E";
        this.objfinishGoodsDetails = this.dataFinishGoodsDetails.data.find(x => x.rollNo === this.dataFinishGoodsDetails.papram.rollNo);

        this.RollNo = this.objfinishGoodsDetails.rollNo;
        this.Length = this.objfinishGoodsDetails.length;
        this.Width = this.objfinishGoodsDetails.width;
        this.Diameter = this.objfinishGoodsDetails.diameter;
        this.SpindleWeight = this.objfinishGoodsDetails.spindleWeight;
        this.TotalWeight = this.objfinishGoodsDetails.totalWeight;
        this.GradeID = this.objfinishGoodsDetails.gradeId;
        this.SampleInLength = this.objfinishGoodsDetails.sampleInLength;
        this.SampleInQty = this.objfinishGoodsDetails.sampleInQty;
        this.Remark = this.objfinishGoodsDetails.remark;
        //  this.objfinishGoodsDetails = this.dataFinishGoodsDetails;
        //  this.orgRollNO = this.dataFinishGoodsDetails.rollNo;
      }
      this.dialogService.showLoader();
      await this.setGrade();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }


  async setGrade() {

    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GradeGetAllActive);
      this.objarrGrade = data;
    } catch (error) {
      throw error;
    }
  }

  btnSaveClick() {
    this.save()
  }

  validate() {

  }

  save() {
    // console.log(this.getdata());
  }



  getdata(): any {

    let objdata: any = {};
    objdata.length = 0;
    objdata.width = 0;
    objdata.diameter = 0;
    objdata.spindleWeight = 0;
    objdata.totalWeight = 0;
    objdata.sampleInLength = 0;
    objdata.sampleInQty = 0;
    objdata.remark = "";

    objdata.rollNo = Number(this.RollNo);

    if (!this.isNull(this.Length)) {
      objdata.length = Number(this.Length);
    }

    if (!this.isNull(this.Width)) {
      objdata.width = Number(this.Width);
    }

    if (!this.isNull(this.Diameter)) {
      objdata.diameter = Number(this.Diameter);
    }

    if (!this.isNull(this.SpindleWeight)) {
      objdata.spindleWeight = Number(this.SpindleWeight);
    }

    if (!this.isNull(this.TotalWeight)) {
      objdata.totalWeight = Number(this.TotalWeight);
    }

    if (!this.isNull(this.SampleInLength)) {
      objdata.sampleInLength = Number(this.SampleInLength);
    }

    if (!this.isNull(this.SampleInQty)) {
      objdata.sampleInQty = Number(this.SampleInQty);
    }

    if (!this.isNull(this.GradeID)) {
      objdata.gradeId = this.GradeID;
      // objdata.grade = this.objarrGrade.find(obj => obj.id === this.GradeID);
    }
    else {
      objdata.gradeId = null;
      objdata.grade = {};
    }

    if (this.dataFinishGoodsDetails.data !== undefined) {
      objdata.finalInspectionId = this.dataFinishGoodsDetails.data[0].finalInspectionId;
    } 

    objdata.remark = this.Remark;
    objdata.createBy = localStorage.getItem("currentUserName");
    objdata.updateBy = localStorage.getItem("currentUserName");
    objdata.createDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");
    objdata.updateDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss");

    return objdata;

  }


  private isNull(objdata: any) {
    if (objdata != undefined && objdata != "") {
      return false;
    }
    else {
      return true;
    }
  }



  onNoClick() {

    // this.objfinishGoodsDetails.rollNo = this.beforeRollNo;
    // this.objfinishGoodsDetails.length = this.beforeLength
    // this.objfinishGoodsDetails.width = this.beforeWidth;
    // this.objfinishGoodsDetails.diameter = this.beforeDiameter;
    // this.objfinishGoodsDetails.spindleWeight = this.beforeSpindleWeight;
    // this.objfinishGoodsDetails.totalWeight = this.beforeTotalWeight;
    // this.objfinishGoodsDetails.gradeId = this.beforeGradeID;
    // this.objfinishGoodsDetails.sampleInLength = this.beforeSampleInLength;
    // this.objfinishGoodsDetails.sampleInQty = this.beforeSampleInQty;
    // this.objfinishGoodsDetails.remark = this.beforeRemark;

    this.dialogRef.closeAll();
  }

  //keynumber
  keydecimal(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/g;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  keynumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  rollNochange(newValue: any) {

    console.log("rollNochange", newValue);
    if (newValue != "") {
      console.log("dataFinishGoodsDetails.data", this.dataFinishGoodsDetails.data);
      if (this.strDialogStatus == "A") {
        if (this.dataFinishGoodsDetails.data != undefined) {
          if (this.dataFinishGoodsDetails.data.length > 0) {
            this.isInvalidData = this.checkDuplicateRollNo(newValue);
          }
          else {
            this.isInvalidData = false;
          }
        }
        else {
          this.isInvalidData = false;
        }
      }
      else if (this.strDialogStatus == "E") {
        if (Number(newValue) != this.dataFinishGoodsDetails.papram) {
          this.isInvalidData = this.checkDuplicateRollNo(newValue);
        }
        else {
          this.isInvalidData = false;
        }
      }
    } else {
      this.isInvalidData = true;
    }

  }


  private checkDuplicateRollNo(newValue: any) {
    let arrobjDupRollNo = this.dataFinishGoodsDetails.data.filter(x => x.rollNo === Number(newValue));
    if (arrobjDupRollNo.length > 0) {
      console.log("Duplicate Data", arrobjDupRollNo);
      return true;
    }
    else {
      return false;
    }
  }
}
