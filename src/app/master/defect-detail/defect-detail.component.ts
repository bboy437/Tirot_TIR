import { Component, OnInit } from '@angular/core';
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IDefect } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";

@Component({
  selector: 'app-defect-detail',
  templateUrl: './defect-detail.component.html',
  styleUrls: ['./defect-detail.component.scss']
})
export class DefectDetailComponent implements OnInit {

  version = VERSION;
  isLoadingResults = true;
  private RowID: string;

  objRow: any = {};
  objAPIResponse: any = {};

  private UrlAPI_GetSingleRow: string = "Defect/Get/";
  private UrlAPI_Update: string = "Defect/Update";
  private UrlAPI_Create: string = "Defect/Create";

  private Url_Listing: string = "/auth/master/defect-listing";

  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter:string;


  constructor(private brokerAPIService: BrokerAPIService,
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
      this.isLoadingResults = false;
      if (this.RowID == "new") {
        this.isLoadingResults = false;
      } else {
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <IDefect>data;
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
    this.router.navigate([this.Url_Listing,{ filter: this.filter }]);
  }

  save() {
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
      this.brokerAPIService
        .post(this.UrlAPI_Update, <IDefect>this.objRow)
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
    console.log(this.objRow.defectCode);
    let strValidate: string = "";

    if (this.objRow.defectCode == undefined || this.objRow.defectCode == "") {
      strValidate = "Defect Code";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    } 
    if (
      this.objRow.defectName == undefined ||
      this.objRow.defectName == ""
    ) {
      strValidate = "Defect Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
    }else {
      return true;
    }
   
  }

  showSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 2000
    });
  }

  showDialog(type: string, title: string, body: string) {
     this.dialogRef=this.dialog.open(MessageDialogComponent, {
      width:'300px',height:'200px',
      data: {
        Messagetype: type,
        Messagetitle: title,
        Messagebody: body
      },
      disableClose: true
    });
  }
}
