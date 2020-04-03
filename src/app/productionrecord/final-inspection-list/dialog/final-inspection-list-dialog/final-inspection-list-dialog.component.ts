import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { BrokerAPIService } from '../../../../services/brokerapi.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { IAPIResponse } from '../../../../interfaces/apiResponse';
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  MatSnackBar, MatDialog, MatDialogRef, VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import * as moment from "moment";
import { Moment } from "moment";
import { AvailableForInspect } from '../../../../interfaces/productionrecords';

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
  selector: 'app-final-inspection-list-dialog',
  templateUrl: './final-inspection-list-dialog.component.html',
  styleUrls: ['./final-inspection-list-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FinalInspectionListDialogComponent implements OnInit {
  objarrAvailableForInspect: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  enddate: Moment = moment();
  private UrlAPI_GetAllAvailableForInspect: string = "FinalInspection/GetAllAvailableForInspect";
  private UrlAPI_Create: string = "FinalInspection/Create";

  constructor(private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute, private router: Router,
    private dialogRef: MatDialog,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.gettAllAvailableForInspect();

  }

  gettAllAvailableForInspect() {
    this.brokerAPIService.get(this.UrlAPI_GetAllAvailableForInspect).subscribe(
      data => {
        console.log("data", data);
        this.objarrAvailableForInspect = <AvailableForInspect>data;

      }
    );
  }

  btnSaveClick() {
    this.save()
  }

  save() {
    
    this.brokerAPIService.post(this.UrlAPI_Create, this.getdata()).subscribe(
      data => {
        this.objAPIResponse = <IAPIResponse>data;
        if (this.objAPIResponse.success) {
          this.showSnackBar("Save Complete");
          this.dialogRef.closeAll();
        } else {
          console.log("this.objAPIResponse.success :" + this.objAPIResponse.success);
        }
      },
      err => {
        // กรณี error
        console.log("Something went wrong!");
      }
    );

  }

  

  getdata() {
    let objdata: any = {};

  // objdata.packingNo = this.objRow.packingNo = 1;
   // this.objRow.finishGoodsId = 1;
    this.objRow.productionRecordId = 1;
    this.objRow.packerId = 1;
    this.objRow.startWorkTime = this.enddate.format("YYYY-MM-DDTHH:mm:ss");
    this.objRow.endWorkTime = this.enddate.format("YYYY-MM-DDTHH:mm:ss");

      return objdata;
  
  }


  onNoClick() {
    this.dialogRef.closeAll();

  }


  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }
}
