import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import {
  IProduct,
  ITeam,
  IShiftSchdule,
  IProcess,
  IProductionOrder
} from "../../interfaces/productionrecords";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";
import * as moment from "moment";
import { Moment } from "moment";
import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialogRef,
  VERSION,
  MAT_DATE_FORMATS,
  DateAdapter,
  MAT_DATE_LOCALE
} from "@angular/material";
import { startWith, map } from "rxjs/operators";
import { FormControl } from "@angular/forms";

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
  selector: "app-production-planing-entry",
  templateUrl: "./production-planing-entry.component.html",
  styleUrls: ["./production-planing-entry.component.scss"],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class ProductionPlaningEntryComponent implements OnInit {
  version = VERSION;
  isLoadingResults = false;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  //planType: string = "PR";
  public maskTime = [/[0-2]/, /[0-9]/, ":", /[0-5]/, /[0-9]/];
  filteredOpenProductionOrder: Observable<any[]>;
  allOpenProductionOrder: any = [];
  myControl = new FormControl();
  defaultStandard : string;
  ProductionOrderNoReadOnly : boolean = false;
  constructor(
    private brokerAPIService: BrokerAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {}

  dataSource = new MatTableDataSource();
  displayedColumns = [
    "process.processName",
    "rawmaterialName",
    "product.productName",
    "process.defaultStandard",
    "actions"
  ];
  ProductionOrderNo: string;
  JobOrderNo: string;
  ProcessID_PR: number;
  ProcessID_NR: number;
  ProductID: number;

  TotalOrderLength: number;
  PlanedLength: number;
  WIPLength: number;
  FGLength: number;
  OrderLength: number;
  RollNo_OrderNo: string;
  Standard: string;
  planQty : number;
  planDate: Moment = moment();
  private RowID: string;
  arrobjFG: any = [];
  objProductionPlaning: any = {};
  objAPIResponse: any = {};
  objoperationInstruction: any = {};
  planStartTime: any;
  planFinishTime: any;
  ///None Production
  arrobjActivity: any = [];
  arrobjProcessNR: any = [];
  arrobjProcessPR: any = [];
  arrobjShift: any = [];
  arrobjTeam: any = [];
  arrobjProduct: any = [];
  objProductNP: any = {};

  private UrlAPI_GetAllShift: string = "ShiftSchedule/GetAll";
  private UrlAPI_GetAllTeam: string = "Team/GetAll";
  private UrlAPI_GetAllNR: string = "Process/GetAllNR";
  private UrlAPI_GetGetProcessByProduct: string =
    "Article/GetProcessByProduct/";

  private UrlAPI_GetProductionOrder: string = "ProductionOrder/Get/";
  private UrlAPI_GetNP: string = "Product/GetNP";

  private UrlAPI_GetSingleRow: string = "ProductionOrder/GetProductionPlan/";
  private UrlAPI_Update: string = "ProductionOrder/UpdateProductionPlan";
  private UrlAPI_Create: string = "ProductionOrder/CreateProductionPlan";
  private UrlAPI_GetAllFG: string = "Product/GetAllFG";
  private UrlAPI_GetListOpenProductionOrderNo: string =
    "ProductionOrder/GetListOpenProductionOrderNo";
  private Url_Listing: string = "/auth/transaction/production-planing";

  @ViewChild("MatPaginatorArticle")
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;
  @ViewChild("fileInput")
  fileInput;

  ngOnInit() {
    this.isLoadingResults = true;
    this.setOpenProductionOrder();
    this.setSelectArticle();
    this.setSelectTeam();
    this.setSelectShift();
    this.setSelectNR();
    this.setProductNP();

    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("date"));
      this.RowID = params.get("id");

      if (this.RowID == "new") {
        this.ProductionOrderNoReadOnly = false;
        this.objProductionPlaning.useForProductId = null;
        this.planDate = moment(params.get("date"));
       
        this.JobOrderNo = "<Auto Gen.>";
        // this.objProductionPlaning.shiftID = + localStorage.getItem("shiftID")
        this.objProductionPlaning.planType = "PR";
        this.isLoadingResults = false;
      } else {
        this.ProductionOrderNoReadOnly = true;
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objProductionPlaning = data;
            this.planDate = moment(this.objProductionPlaning.planDate);
            this.planStartTime = moment(
              this.objProductionPlaning.planStartTime
            ).format("HH:mm");
            this.planFinishTime = moment(
              this.objProductionPlaning.planFinishTime
            ).format("HH:mm");
            this.JobOrderNo = this.objProductionPlaning.jobOrderNo;
            this.planQty = this.objProductionPlaning.planQty;
            if (this.objProductionPlaning.planType == "PR") {
            
              this.ProductionOrderNo = this.objProductionPlaning.productionOrderNo;

              let objOpenProductionOrder = this.allOpenProductionOrder.filter(option =>
                option.productionOrderNo.toLowerCase().includes(this.ProductionOrderNo)
              );
             
              if (objOpenProductionOrder.length == 1) {
                console.log(objOpenProductionOrder[0].id);
                this.setProductEdit(objOpenProductionOrder[0].id,this.objProductionPlaning.productId,this.objProductionPlaning.processId);
              }

              //this.ProcessID_PR = ;

              this.Standard = this.objProductionPlaning.standard;
              this.RollNo_OrderNo = this.objProductionPlaning.rollNo;
            } else if (this.objProductionPlaning.planType == "NR") {
              this.ProcessID_NR = this.objProductionPlaning.processId;
            }

            console.log(this.objProductionPlaning);
            this.isLoadingResults = false;
          });
      }
    }
  }

  planStartTimeOnChange(planStartTimeValue: string) {
    console.log("onValueUpdate " + this.planStartTime);
  }

  planStartTimeOnInput(planStartTimeValue: string) {
    console.log(this.planStartTime);
  }

  btnSaveClick() {
    this.save();
  }

  uploadfile(fi: any): Observable<string> {
    let strUrl: string = "";
    if (fi.files && fi.files[0]) {
      let fileToUpload = fi.files[0];
      this.brokerAPIService
        .upload("Utility/UploadFile", fileToUpload)
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              strUrl = this.objAPIResponse.data;
            } else {
              console.log(
                "this.objAPIResponse.success :" + this.objAPIResponse.success
              );
              strUrl = "error";
            }
          },
          err => {
            // กรณี error
            console.log("Something went wrong!");
            strUrl = "error";
          }
        );
    }

    return Observable.of(strUrl);
  }

  save() {
    this.objProductionPlaning.planDate = this.planDate.format(
      "YYYY-MM-DDTHH:mm:ss"
    );
    this.objProductionPlaning.planStartTime = this.getPlanStartTime();
    this.objProductionPlaning.planFinishTime = this.getPlanFinishTime();

    if (this.RowID == "new") {
      //Create
      this.objProductionPlaning.createBy = "admin";
      this.objProductionPlaning.updateBy = "admin";
      // this.getdata();

      this.brokerAPIService.post(this.UrlAPI_Create, this.getdata()).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.router.navigate([this.Url_Listing]);
          } else {
            this.dialogRef = this.dialog.open(MessageDialogComponent, {
              width: "300px",
              height: "200px",
              data: {
                Messagetype: "error",
                Messagetitle: "Error",
                Messagebody: "Save Error"
              },
              disableClose: true
            });
          }
        },
        err => {
          // กรณี error
          console.log("Something went wrong!");
        }
      );
    } else {
      //Update
      console.log("Update");
      console.log(this.objProductionPlaning);
      // let plandate : Date = this.objProductionPlaning.planDate.toDate();
      // console.log(plandate.toDateString());
      // this.objProductionPlaning.planDate = plandate.toDateString();
      if (this.objProductionPlaning.planType == "PR") {
        this.objProductionPlaning.processId = this.ProcessID_PR;
        this.objProductionPlaning.process = this.arrobjProcessPR.find(
          x => x.id === this.ProcessID_PR
        );
        this.objProductionPlaning.productId = this.ProductID;
        this.objProductionPlaning.product = this.arrobjProduct.find(
          x => x.id === this.ProductID
        );
        this.objProductionPlaning.rollNo = this.RollNo_OrderNo;
        this.objProductionPlaning.standard = this.Standard;
      }
      this.brokerAPIService
        .post(this.UrlAPI_Update, this.objProductionPlaning)
        .subscribe(
          data => {
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              this.router.navigate([this.Url_Listing]);
            } else {
              this.dialogRef = this.dialog.open(MessageDialogComponent, {
                width: "300px",
                height: "200px",
                data: {
                  Messagetype: "error",
                  Messagetitle: "Error",
                  Messagebody: "Save Error"
                },
                disableClose: true
              });
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

  private getPlanFinishTime() {
    let result: string = "";
    if (this.planFinishTime != null && this.planFinishTime != "") {
      let arrplanFinishTime: String[];
      arrplanFinishTime = this.planFinishTime.split(":");
      let planFinishTime: Moment = moment(
        this.planDate
          .toDate()
          .setHours(+arrplanFinishTime[0], +arrplanFinishTime[1])
      );
      result = planFinishTime.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      result = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
    }
    return result;
  }

  private getPlanStartTime(): string {
    let result: string = "";
    if (this.planStartTime != null && this.planStartTime != "") {
      let arrplanStartTime: String[];
      arrplanStartTime = this.planStartTime.split(":");
      let planStartTime: Moment = moment(
        this.planDate
          .toDate()
          .setHours(+arrplanStartTime[0], +arrplanStartTime[1])
      );
      result = planStartTime.format("YYYY-MM-DDTHH:mm:ss");
    } else {
      result = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
    }

    return result;
  }

  getdata() {
    let objdata: any = {};
    if (this.objProductionPlaning.id !== undefined) {
      objdata.id = this.objProductionPlaning.id;
    }

    // this.objProductionPlaning.planType = this.planType;
    objdata.planType = this.objProductionPlaning.planType;
    objdata.planDate = this.planDate.format("YYYY-MM-DDTHH:mm:ss");
    objdata.shiftId = this.objProductionPlaning.shiftId;
    objdata.wokingTeamId = this.objProductionPlaning.wokingTeamId;
    objdata.planStartTime = this.getPlanStartTime();
    objdata.planFinishTime = this.getPlanFinishTime();
    objdata.remark = "";
    objdata.planQty = this.planQty;
    if (this.objProductionPlaning.planType == "PR") {
      objdata.productionOrderNo = this.ProductionOrderNo;
      objdata.processId = this.ProcessID_PR;
      objdata.productId = this.ProductID;
      objdata.rollNo = this.RollNo_OrderNo;
      objdata.standard = this.Standard;
    } else if (this.objProductionPlaning.planType == "NR") {
      objdata.processId = this.ProcessID_NR;
      objdata.productId = this.objProductNP.id;
    }

    objdata.createBy = this.objProductionPlaning.createBy;
    if (this.objProductionPlaning.createDate !== undefined) {
      objdata.createDate = this.objProductionPlaning.createDate;
    }

    objdata.updateBy = this.objProductionPlaning.updateBy;
    if (this.objProductionPlaning.updateDate !== undefined) {
      objdata.updateDate = this.objProductionPlaning.updateDate;
    }
    console.log("getdata");
    console.log(objdata);
    return objdata;
  }

  setSelectArticle() {
    this.brokerAPIService.get(this.UrlAPI_GetAllFG).subscribe(data => {
      this.arrobjFG = <IProduct[]>data;
      // console.log(this.arrobjFG);
    });
  }

  setOpenProductionOrder() {
    this.brokerAPIService
      .get(this.UrlAPI_GetListOpenProductionOrderNo)
      .subscribe(data => {
        this.allOpenProductionOrder = <IProductionOrder[]>data;

        this.filteredOpenProductionOrder = this.myControl.valueChanges.pipe(
          startWith(""),
          map(value => this._filter(value))
        );
      });
  }

  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    //console.log(this.allOpenProductionOrder.filter(option => option.productionOrderNo.toLowerCase().includes(filterValue)));
    let objOpenProductionOrder = this.allOpenProductionOrder.filter(option =>
      option.productionOrderNo.toLowerCase().includes(filterValue)
    );
    if (objOpenProductionOrder.length == 1) {
      console.log(objOpenProductionOrder[0].id);
      this.setProduct(objOpenProductionOrder[0].id);
    } else {
      this.arrobjProduct = [];
      this.ProductID = undefined;

      this.arrobjProcessPR = [];
      this.ProcessID_PR = undefined;
     // console.log(this.ProductID);
    }

    return this.allOpenProductionOrder.filter(option =>
      option.productionOrderNo.toLowerCase().includes(filterValue)
    );
  }

  setSelectShift() {
    this.brokerAPIService.get(this.UrlAPI_GetAllShift).subscribe(data => {
      this.arrobjShift = <IShiftSchdule[]>data;
      if (this.RowID == "new") {
        this.objProductionPlaning.shiftId = +localStorage.getItem("shiftID");
      }
      // console.log(this.arrobjFG);
    });
  }

  ShiftChange(data) {
    this.objProductionPlaning.shift = this.arrobjShift.find(x => x.id === data);
    console.log(this.objProductionPlaning);
  }

  setSelectTeam() {
    this.brokerAPIService.get(this.UrlAPI_GetAllTeam).subscribe(data => {
      this.arrobjTeam = <ITeam[]>data;
      // console.log(this.arrobjFG);
    });
  }

  TeamChange(data) {
    this.objProductionPlaning.wokingTeam = this.arrobjTeam.find(
      x => x.id === data
    );
    console.log(this.objProductionPlaning);
  }

  setSelectNR() {
    this.brokerAPIService.get(this.UrlAPI_GetAllNR).subscribe(data => {
      this.arrobjProcessNR = <IProcess[]>data;
      console.log(this.arrobjProcessNR);
    });
  }

  setSelectPR(id: number) {
    this.brokerAPIService
      .get(this.UrlAPI_GetGetProcessByProduct + String(id))
      .subscribe(data => {
        this.arrobjProcessPR = <IProcess[]>data;

        console.log("this.arrobjProcessPR");
      });
  }

  setProductNP() {
    this.brokerAPIService.get(this.UrlAPI_GetNP).subscribe(data => {
      this.objProductNP = <IProduct>data;
    });
  }

  setProduct(id: number) {
    this.brokerAPIService
      .get(this.UrlAPI_GetProductionOrder + String(id))
      .subscribe(data => {
        let objProductionOrder = <IProductionOrder>data;
        for (let i = 0; i < objProductionOrder.orderItems.length; i++) {
          this.arrobjProduct[i] = objProductionOrder.orderItems[i].product;
        }
     //   console.log(this.arrobjProduct);
      });
  }

  setProductEdit(id: number,ProductID : number,ProcessID_PR : number) {
    this.brokerAPIService
      .get(this.UrlAPI_GetProductionOrder + String(id))
      .subscribe(data => {
        let objProductionOrder = <IProductionOrder>data;
        for (let i = 0; i < objProductionOrder.orderItems.length; i++) {
          this.arrobjProduct[i] = objProductionOrder.orderItems[i].product;
        }
        
       
    
      //  
       
        
        this.ProductID = ProductID;
        this.setSelectPREdit(this.ProductID,ProcessID_PR)
        
     //   console.log(this.arrobjProduct);
      });
  }

  setSelectPREdit(id: number,ProcessID_PR : number) {
    this.brokerAPIService
      .get(this.UrlAPI_GetGetProcessByProduct + String(id))
      .subscribe(data => {
        this.arrobjProcessPR = <IProcess[]>data;
        this.ProcessID_PR = ProcessID_PR;
        this.changeProcess(ProcessID_PR);
        console.log("this.arrobjProcessPR");
      });
  }


  changeProcess(id: number) {
   console.log("changeProcess");
    let objProcess = this.arrobjProcessPR.filter(option => option.id == id);
    if(objProcess.length == 1)
    {
      this.defaultStandard = objProcess[0].defaultStandard;
    }
    console.log(objProcess);
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing]);
  }

  ngAfterViewInit() {
    console.log(this.paginator);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (obj, property) =>
      this.getProperty(obj, property);
    this.dataSource.sort = this.sort;
  }

  getProperty = (obj, path) => path.split(".").reduce((o, p) => o && o[p], obj);
}
