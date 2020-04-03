import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IStation } from "../../interfaces/productionrecords";
import {
  MatSnackBar,
  MatDialog,
  MatDialogRef,
  VERSION
} from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";

@Component({
  selector: "app-station-detail",
  templateUrl: "./station-detail.component.html",
  styleUrls: ["./station-detail.component.scss"]
})
export class StationDetailComponent implements OnInit {
  version = VERSION;
  isLoadingResults = true;
  private RowID: string;
  StationGroupID: number;
  objRow: any = {};
  objAPIResponse: any = {};
  objStationGroup: any = [];
  objMachine: any = [];

  private UrlAPI_GetSingleRow: string = "Station/Get/";
  private UrlAPI_Update: string = "Station/Update";
  private UrlAPI_Create: string = "Station/Create";

  private UrlAPI_GetAllStationGroup: string = "StationGroup/GetAll";
  private UrlAPI_GetListMachine: string = "Station/GetListMachine";
  private Url_Listing: string = "/auth/master/station-listing";

  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter: string;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isLoadingResults = true;
    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.RowID = params.get("id");
      this.filter = params.get("filter");

      this.brokerAPIService
        .get(this.UrlAPI_GetAllStationGroup)
        .subscribe(data => {
          this.objStationGroup = data;
          this.brokerAPIService
            .get(this.UrlAPI_GetListMachine)
            .subscribe(data => {
              this.objMachine = data;
              console.log(data);
              this.isLoadingResults = false;
            });
        });

      if (this.RowID == "new") {
        this.objRow.inStationGroup = {};
        this.objRow.inMachine = {};
      } else {
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <IStation>data;
            this.StationGroupID = this.objRow.stationGroupId;
            console.log(this.objRow);
          });
      }
    }
  }

  btnSaveClick() {
    if (this.validate()) {
      this.save();
    }
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing, { filter: this.filter }]);
  }

  save() {
    this.objRow.stationGroupId = this.StationGroupID;
    if (this.RowID == "new") {
      //Create

      this.objRow.createBy = "admin";
      this.objRow.updateBy = "admin";
      this.objRow.inActivated = false;

      this.brokerAPIService.post(this.UrlAPI_Create, this.objRow).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.showSnackBar("Save Complete");
            this.router.navigate([this.Url_Listing]);
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
      console.log("UrlAPI_Update");
      console.log(<IStation>this.objRow);

      let arrobjStationGroupfilter: any = [];
      arrobjStationGroupfilter = this.objStationGroup.filter(
        obj => obj.id === this.StationGroupID
      );
      if (arrobjStationGroupfilter.length == 1) {
        this.objRow.inStationGroup = arrobjStationGroupfilter[0];
      }

      this.brokerAPIService
        .post(this.UrlAPI_Update, <IStation>this.objRow)
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.showSnackBar("Save Complete");
              this.router.navigate([this.Url_Listing]);
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

  validate() {
    console.log(this.objRow.stationName);
    let strValidate: string = "";

    if (this.objRow.stationName == undefined || this.objRow.stationName == "") {
      strValidate = "Station Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    } else {
      return true;
    }
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  showDialog(type: string, title: string, body: string) {
    this.dialogRef = this.dialog.open(MessageDialogComponent, {
      width: "300px",
      height: "200px",
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }
}
