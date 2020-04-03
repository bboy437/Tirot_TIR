import { Component, OnInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { ICustomer } from "../../interfaces/productionrecords";
import { MatSnackBar, MatDialog, MatDialogRef, VERSION } from "@angular/material";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";

@Component({
  selector: "app-customer-detail",
  templateUrl: "./customer-detail.component.html",
  styleUrls: ["./customer-detail.component.scss"]
})
export class CustomerDetailComponent implements OnInit {
  version = VERSION;
  isLoadingResults = true;
  private RowID: string;

  objRow: any = {};
  objAPIResponse: any = {};

  private UrlAPI_GetSingleRow: string = "Customer/Get/";
  private UrlAPI_Update: string = "Customer/Update";
  private UrlAPI_Create: string = "Customer/Create";

  private Url_Listing: string = "/auth/master/customer-listing";
  dialogRef: MatDialogRef<MessageDialogComponent>;
  filter:string;

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
      this.isLoadingResults = false;
      if (this.RowID == "new") {
      } else {
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <ICustomer>data;
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


  validate() {
    console.log(this.objRow.customerCode);
    let strValidate: string = "";

    if (this.objRow.customerCode == undefined || this.objRow.customerCode == "") {
      strValidate = "Customer Code";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
      
    } 
    if (this.objRow.customerName == undefined || this.objRow.customerName == "") {
      strValidate = "Customer Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
      
    } 
    if (this.objRow.customerShortName == undefined || this.objRow.customerShortName == "") {
      strValidate = "Short Name";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
      
    } 
    if (this.objRow.address1 == undefined || this.objRow.address1 == "") {
      strValidate = "Address1";
    }

    if (strValidate != "") {
      this.showDialog("error", "Error", strValidate);
      return false;
      
    } 
    
    
    else {
      return true;
    }
  }

  save() {
    if (this.RowID == "new") {
      //Create

      this.objRow.createBy = "admin";
      this.objRow.updateBy = "admin";

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
        .post(this.UrlAPI_Update, <ICustomer>this.objRow)
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
