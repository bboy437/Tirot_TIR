import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { IProduct } from "../../interfaces/productionrecords";
import {
  IArticle,
  IOperationInstruction
} from "../../interfaces/productionrecords";
import { ArticleDialogComponent } from "../article-detail/dialogs/article-dialog/article-dialog.component";
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { MessageDialogComponent } from "../../dialogs/message-dialog/message-dialog.component";
import { Observable } from "rxjs/Observable";

import {
  MatDialog,
  MatSort,
  MatPaginator,
  MatTableDataSource,MatDialogRef, VERSION
} from "@angular/material";

@Component({
  selector: "app-article-detail",
  templateUrl: "./article-detail.component.html",
  styleUrls: ["./article-detail.component.scss"]
})
export class ArticleDetailComponent implements OnInit, AfterViewInit {

  version = VERSION;
  isLoadingResults = true;
  dialogRef: MatDialogRef<MessageDialogComponent>;
  dialogRefDelete: MatDialogRef<ConfirmDeleteDialogComponent>;
  dialogRefArticle: MatDialogRef<ArticleDialogComponent>;
  filter:string;


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

  private RowID: string;
  arrobjFG: any = [];
  objRow: any = {};
  objAPIResponse: any = {};
  objoperationInstruction: any = {};

  private intDelID: number;
  private UrlAPI_GetSingleRow: string = "Article/Get/";
  private UrlAPI_Update: string = "Article/Update";
  private UrlAPI_Create: string = "Article/Create";
  private UrlAPI_GetAllFG: string = "Product/GetAllFG";
  private Url_Listing: string = "/auth/master/article-listing";

  @ViewChild("MatPaginatorArticle") paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("fileInput") fileInput;

  ngOnInit() {
    this.setSelectArticle();
    this.isLoadingResults = true;

    let params = this.route.snapshot.paramMap;
    if (params.has("id")) {
      console.log(params.get("id"));
      this.RowID = params.get("id");
      this.filter = params.get("filter");
      this.isLoadingResults = false;
      
      if (this.RowID == "new") {
        this.objRow.useForProductId = null;
      } else {
        this.brokerAPIService
          .get(this.UrlAPI_GetSingleRow + this.RowID)
          .subscribe(data => {
            this.objRow = <IArticle>data;
            console.log(this.objRow);
            this.dataSource.data = this.objRow.operationInstruction;
            
          });
      }
    }
    // this.isLoadingResults = false;
  }

  btnSaveClick() {
    //console.log(this.uploadfile(this.fileInput.nativeElement));
    // let strUrl : string = "";
    // let fi : any = this.fileInput.nativeElement;
    // if (fi.files && fi.files[0]) {
    //   let fileToUpload = fi.files[0];
    //   this.brokerAPIService.upload("Utility/UploadFile", fileToUpload).subscribe(
    //     data => {
    //       this.objAPIResponse = <IAPIResponse>data;
    //       if (this.objAPIResponse.success) {
    //         strUrl = this.objAPIResponse.data;
    //         console.log("strUrl");
    //         console.log(strUrl);

    //         console.log("save");
    //         this.save();
    //       }
    //       else {
    //         console.log('this.objAPIResponse.success :' + this.objAPIResponse.success);
    //         strUrl = "error";
    //       }
    //     },
    //     err => {
    //       // กรณี error
    //       console.log('Something went wrong!');
    //       strUrl = "error";
    //     });

    // }

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
    if (this.RowID == "new") {
      //Create
      this.objRow.createBy = "admin";
      this.objRow.updateBy = "admin";
      this.objRow.inActivated = false;

      this.brokerAPIService.post(this.UrlAPI_Create, this.getdata()).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.router.navigate([this.Url_Listing]);
          } else {
            this.dialogRef = this.dialog.open(MessageDialogComponent, {
              width:'300px',height:'200px',
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
      console.log(this.objRow);
      this.brokerAPIService.post(this.UrlAPI_Update, this.getdata()).subscribe(
        data => {
          this.objAPIResponse = <IAPIResponse>data;
          if (this.objAPIResponse.success) {
            this.router.navigate([this.Url_Listing]);
          } else {
            this.dialogRef = this.dialog.open(MessageDialogComponent, {
              width:'300px',height:'200px',
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

  getdata() {
    let objdata: any = {};
    if (this.objRow.id !== undefined) {
      objdata.id = this.objRow.id;
    }

    
    if (this.objRow.articleName !== undefined) {
      objdata.articleName = this.objRow.articleName;
    }

    let objFG : any = {};
    objFG = this.arrobjFG.filter(obj => obj.id === this.objRow.useForProductId);
    console.log("objFG");
    console.log(objFG[0]);
    if (objFG[0].productName !== undefined) {
      objdata.articleName = objFG[0].productName;
    }

    objdata.useForProductId = this.objRow.useForProductId;
    
    objdata.createBy = this.objRow.createBy;
    if (this.objRow.createDate !== undefined) {
      objdata.createDate = this.objRow.createDate;
    }
    objdata.updateBy = this.objRow.updateBy;
    if (this.objRow.updateDate !== undefined) {
      objdata.updateDate = this.objRow.updateDate;
    }

    objdata.inActivated = this.objRow.inActivated;

    let dataOperationInstruction: any = [];
    let i: number = 0;
    this.objRow.operationInstruction.forEach(element => {
      console.log(element);
      dataOperationInstruction[i] = {};
      if (element.id !== undefined && element.id !== null) {
        dataOperationInstruction[i].id = element.id;
      }
      dataOperationInstruction[i].processId = element.process.id;
      dataOperationInstruction[i].rawmaterialName = element.rawmaterialName;
      dataOperationInstruction[i].productId = element.product.id;
      if (element.usingStandard !== undefined && element.usingStandard !== null) {
        dataOperationInstruction[i].usingStandard = element.usingStandard;
      }
      dataOperationInstruction[i].createBy = element.createBy;
      if (element.createDate !== undefined) {
        dataOperationInstruction[i].createDate = element.createDate;
      }
      dataOperationInstruction[i].updateBy = element.updateBy;
      if (element.updateDate !== undefined) {
        dataOperationInstruction[i].updateDate = element.updateDate;
      }
     
      i++;
    });
    objdata.operationInstruction = dataOperationInstruction;

    console.log("getdata");
    console.log(objdata);
    return objdata;
  }

  addNew() {
    const dialogRefArticle = this.dialog.open(ArticleDialogComponent, {
      disableClose: true
    });

    dialogRefArticle.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (result.process != undefined) {
          if (this.objRow.operationInstruction == undefined) {
            this.objRow.operationInstruction = <IOperationInstruction[]>[];
            this.objRow.operationInstruction[0] = result;
          } else {
            this.objRow.operationInstruction.push(result);
          }
          this.dataSource.data = this.objRow.operationInstruction;
        }
      }
    });
  }

  startEdit(id: number) {
    this.objoperationInstruction = this.objRow.operationInstruction.find(
      x => x.id === id
    );
    // console.log("this.objoperationInstruction");
    // console.log(this.objoperationInstruction);

    const dialogRefArticle = this.dialog.open(ArticleDialogComponent, {
      
      data: this.objoperationInstruction,
      disableClose: true
    });

    dialogRefArticle.afterClosed().subscribe(result => {
      // console.log("afterClosed Edit");
      // console.log(result);
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }

      this.dataSource.data = this.objRow.operationInstruction;
    });
  }

  deleteItem(index: number, id: number) {
    const dialogRefDelete = this.dialog.open(ConfirmDeleteDialogComponent, {
      // data: {id: id, title: title, state: state, url: url}
      disableClose: true
    });

    dialogRefDelete.afterClosed().subscribe(result => {
      if (result) {
        console.log(id);
        // const foundIndex = this.objoperationInstruction.findIndex(x => x.id === id);
        // console.log(foundIndex);
        // for delete we use splice in order to remove single object from DataService
        this.objoperationInstruction = this.objRow.operationInstruction.find(
          x => x.id === id
        );
        this.objRow.operationInstruction = this.objRow.operationInstruction.filter(
          obj => obj !== this.objoperationInstruction
        );
        //delete this.objRow.operationInstruction[index];
        console.log(this.objRow);
        this.dataSource.data = this.objRow.operationInstruction;
      }
    });




  }

  setSelectArticle() {
    this.brokerAPIService.get(this.UrlAPI_GetAllFG).subscribe(data => {
      this.arrobjFG = <IProduct[]>data;
     // console.log(this.arrobjFG);
    });
  }

  btnCloseClick() {
    this.router.navigate([this.Url_Listing,{ filter: this.filter }]);
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
