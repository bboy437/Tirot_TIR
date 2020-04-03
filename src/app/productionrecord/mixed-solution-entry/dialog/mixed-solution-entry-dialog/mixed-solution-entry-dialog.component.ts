import { Component, OnInit, Inject } from '@angular/core';
import { BrokerAPIService } from '../../../../services/brokerapi.service';
import { DialogService } from '../../../../services/dialog.service';
import { IAPIResponse } from '../../../../interfaces/apiResponse';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DIALOG_DATA
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";
import { MixedSolution } from '../../../../interfaces/productionrecords';
import { DatePipe } from '@angular/common';

export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY"
  },
  display: {
    dateInput: "DD/MM/YYYY ",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY"
  }
};


@Component({
  selector: 'app-mixed-solution-entry-dialog',
  templateUrl: './mixed-solution-entry-dialog.component.html',
  styleUrls: ['./mixed-solution-entry-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class MixedSolutionEntryDialogComponent implements OnInit {

  version = VERSION;
  objRow: any = {};
  objAPIResponse: any = {};
  mixingdate: Moment = moment();
  startUseTime: string;

  public maskTime = [/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/];

  private UrlAPI_AddMixedSolution: string = "ProductionRecord/AddMixedSolution";
  private UrlAPI_UpdateMixedSolution: string = "ProductionRecord/UpdateMixedSolution";

  pipe: DatePipe;
  ProductionRecordID: any;


  constructor(
    public dialogRef: MatDialogRef<MixedSolutionEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dataMixedSolution: MixedSolution,
    private brokerAPIService: BrokerAPIService,
    private dialogService: DialogService) { }

  ngOnInit() {

    this.startUseTime = moment(new Date()).format('HH:mm');

    console.log("this.dataMixedSolution", this.dataMixedSolution)
    if (this.dataMixedSolution.id == null) {
      console.log("null");
      this.ProductionRecordID = this.dataMixedSolution.productionRecordId;
    }
    else {
      this.pipe = new DatePipe('en');
      this.ProductionRecordID = this.dataMixedSolution.productionRecordId;
      this.objRow = <MixedSolution>this.dataMixedSolution;
      this.mixingdate = moment(this.objRow.mixingDate);
      this.startUseTime = moment(this.objRow.startUseTime).format("HH:mm");
      // this.startUseTime = this.pipe.transform(this.objRow.startUseTime, "YYYY-MM-DDTHH:mm:ss")
      console.log("ProductionRecordID", this.ProductionRecordID);
      console.log("this.objRow", this.objRow);

    }

  }

  async btnSaveClick() {
    this.dialogService.showLoader()
    try {
      await this.sava();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
      this.dialogService.hideLoader();
    }

    //this.getdata();
  }


  async sava() {
    try {
      if (this.dataMixedSolution.id == null) {
        await this.postAPISave(this.UrlAPI_AddMixedSolution);
      }
      else {
        await this.postAPISave(this.UrlAPI_UpdateMixedSolution);
      }
    } catch (error) {
      throw error;
    }

  }

  async postAPISave(UrlAPI: string) {
    try {
      let data: any = await this.brokerAPIService.postAwait(UrlAPI, this.getdata());
      this.objAPIResponse = <IAPIResponse>data;
      if (this.objAPIResponse.success) {
        this.dialogService.showSnackBar("Save Complete");

      } else {
        this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
      }
    } catch (error) {
      throw error;
    }
    this.dialogRef.close();
    // this.brokerAPIService.post(UrlAPI, this.getdata()).subscribe(
    //   data => {
    //     this.objAPIResponse = <IAPIResponse>data;
    //     if (this.objAPIResponse.success) {
    //       this.showSnackBar("Save Complete");
    //       this.isLoadingResults = false;
    //       this.dialogRef.close();

    //     } else {
    //       this.isLoadingResults = false;
    //       console.log(
    //         "this.objAPIResponse.success :" + this.objAPIResponse
    //       );
    //     }
    //   },
    //   err => {
    //     // กรณี error
    //     this.isLoadingResults = false;
    //     console.log("Something went wrong!");
    //   }
    // );
  }

  private getdata() {
    let objdata: any = {};

    if (this.objRow.id != null && this.objRow.id != undefined) {
      objdata.id = this.objRow.id;
     
      objdata.updateBy = localStorage.getItem("currentUserName");
    }
    else
    {
      objdata.createBy = localStorage.getItem("currentUserName");
      objdata.updateBy = localStorage.getItem("currentUserName");
    }

    objdata.productionRecordId = this.ProductionRecordID;
    objdata.tankNo = this.objRow.tankNo;
    objdata.solidContext = this.objRow.solidContext;
    objdata.referToDDNo = this.objRow.referToDDNo;
    objdata.mixedIn = this.objRow.mixedIn;
    objdata.mixedOut = this.objRow.mixedOut;
    objdata.vesselWeigth = this.objRow.vesselWeigth;
    objdata.referToCNNo = this.objRow.referToCNNo;
    // objdata.workerId = 1;
    objdata.mixingDate = this.mixingdate.format("YYYY-MM-DDTHH:mm:ss");
    objdata.startUseTime = this.getStartUseTime();// this.startUseTime.format("YYYY-MM-DDTHH:mm:ss");


    console.log("dialog mix getdata", objdata);

    return objdata;
  }

  onNoClick() {
    this.dialogRef.close();

  }

  private getStartUseTime(): string {
    let result: string = "";
    if (this.startUseTime != null && this.startUseTime != "") {
      let arrstartUseTime: String[];
      arrstartUseTime = this.startUseTime.split(":");
      let UseTime: Moment = moment(this.mixingdate.toDate().setHours(+ arrstartUseTime[0].replace('_', '0').replace('_', '0'), +arrstartUseTime[1].replace('_', '0').replace('_', '0'))
      );
      result = UseTime.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      let UseTime: Moment = moment(this.mixingdate.toDate().setHours(new Date().getHours(), new Date().getMinutes()));
      // result = this.mixingdate.format("YYYY-MM-DDTHH:mm:ss");
      result = UseTime.format("YYYY-MM-DDTHH:mm:ss");
    }

    return result;
  }


  // showSnackBar(message: string) {
  //   this.snackBar.open(message, "", {
  //     duration: 2000
  //   });
  // }

  setTwoNumberDecimal($event) {
    $event.target.value = parseFloat($event.target.value).toFixed(1);
    this.objRow.workingDuration = $event.target.value
  }

}
