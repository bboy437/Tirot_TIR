import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { BrokerAPIService } from "../../services/brokerapi.service";
import "rxjs/add/operator/map";
import { MixedSolution } from "../../interfaces/productionrecords";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog,
  MatSnackBar
} from "@angular/material";
import { Router, ActivatedRoute } from "@angular/router";
import { MixedSolutionEntryDialogComponent } from "./dialog/mixed-solution-entry-dialog/mixed-solution-entry-dialog.component";
import { ConfirmDeleteDialogComponent } from "../../dialogs/confirm-delete-dialog/confirm-delete-dialog.component";
import { IAPIResponse } from "../../interfaces/apiResponse";
import { ForkJoinObservable } from "rxjs/observable/ForkJoinObservable";
import { DialogService } from "../../services/dialog.service";

@Component({
  selector: 'app-mixed-solution-entry',
  templateUrl: './mixed-solution-entry.component.html',
  styleUrls: ['./mixed-solution-entry.component.scss']
})
export class MixedSolutionEntryComponent implements OnInit, AfterViewInit {
  //isLoadingResults = false;
  dataSource = new MatTableDataSource();
  objAPIResponse: any = {};
  displayedColumns = [
    "index",
    "tankNo",
    "mixingDate",
    "solidContext",
    "referToDDNo",
    "startUseTime",
    "mixedIn",
    "mixedOut",
    "vesselWeigth",
    "referToCNNo"
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  //ProductionPlanID: string;
  //LotNo: string;
  private Url_Listing: string = "/auth/productionrecord/production-plan-detail";
  private UrlAPI_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/";
  private UrlAPI_GetListMixedSolution: string = "ProductionRecord/GetListMixedSolution/";
  private UrlAPI_RemoveRowMixedSolution: string = "ProductionRecord/RemoveRowMixedSolution";
  private UrlAPI_GetByPlanAndLot: string = "ProductionRecord/GetByPlanAndLot/"
  private UrlAPI_GetMachickListByPRId: string = "MachineCheckList/GetMachickListByPRId/";

  objCurrentJob: any = {};
  objListMixedSolution: any = {};
  objRowSelected: MixedSolution;
  //PlanStatus: string;
  //DateSelected: string;
  ProductionRecordID: any;
  IsSupervisor: boolean;
  //StandardID: string;
  objParams: any = {};

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private dialogService: DialogService,
  ) { }

  async ngOnInit() {



    try {
      this.IsSupervisor = JSON.parse(localStorage.getItem("IsSupervisor"));
      //this.isLoadingResults = true;
      let params = this.route.snapshot.paramMap;

      if (params.has("objParams")) {
        this.objParams = JSON.parse(params.get("objParams"));
        this.objParams.productionPlanID
        console.log("objParams", this.objParams);
        //this.ProductionPlanID = params.get("ProductionPlanID");
        //this.PlanStatus = params.get("PlanStatus");

        // this.DateSelected = params.get("DateSelected");
        // this.LotNo = params.get("LotNo");
        //this.StandardID = params.get("StandardId");
      }

      this.dialogService.showLoader();
      switch (this.objParams.planStatus) {
        case null:
        case "0": //Not Start

          break;
        case "1": //Running
        case "2": //Head Finish
          //this.getAPICurrentJob();
          await this.getAPIListMixedSolution();
          this.displayedColumns.push("actions");
          break;
        case "3": //Finished
        case "7": //Cancel
          await this.getAPIProductionRecordByPlanAndLot(this.objParams.productionPlanID, this.objParams.lotNo);
          if (this.IsSupervisor) {
            this.displayedColumns.push("actions");
          }
          break;
        default:

          break;
      }

    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  // getAPICurrentJob() {
  //   this.brokerAPIService.get(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false).subscribe(data => {
  //     this.objCurrentJob = data;
  //     this.ProductionRecordID = data.productionRecordId;
  //     console.log("objCurrentJob", data);
  //     this.getAPIListMixedSolution();
  //   });
  // }

  async getAPIProductionRecordByPlanAndLot(productionplanId: any, lotNo: any) {
    try {
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo);
      console.log("getAPIProductionRecordByPlanAndLot", data);

      this.ProductionRecordID = data.id;
      this.objListMixedSolution = data.mixedSolutions;
      this.dataSource.data = data.mixedSolutions;
    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetByPlanAndLot + productionplanId + "," + lotNo).subscribe(data => {
    //    console.log("UrlAPI_GetByPlanAndLot", data);
    //   this.ProductionRecordID = data.id;
    //   this.objListMixedSolution = data.mixedSolutions;
    //   this.dataSource.data = data.mixedSolutions;

    // }, err => {
    //   console.log(err);
    // });
  }


  async getAPIListMixedSolution() {
    try {
      console.log("MachineID ", this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID"));
      console.log("XXXXXX MachineID", localStorage.getItem("MachineID"));
      //let dataCurrentJob: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID"));
      let dataCurrentJob: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentJob + localStorage.getItem("MachineID") + "," + false);
      console.log("XXXXXX dataCurrentJob", dataCurrentJob);

      this.objCurrentJob = dataCurrentJob;
      console.log("objCurrentJob ", this.objCurrentJob);
      this.ProductionRecordID = dataCurrentJob.productionRecordId;
      let dataListMixedSolution: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetListMixedSolution + this.ProductionRecordID);
      console.log("getAPIListMixedSolution ", dataListMixedSolution);
      this.objListMixedSolution = dataListMixedSolution;
      this.dataSource.data = dataListMixedSolution;

    } catch (error) {
      throw error;
    }

    // this.brokerAPIService.get(this.UrlAPI_GetListMixedSolution + this.ProductionRecordID).subscribe(data => {
    //   console.log("getAPIListMixedSolution ", data);
    //   this.objListMixedSolution = data;
    //   this.dataSource.data = data;
    // });

  }


  async addNew() {
    try {
      const dialogRef = this.dialog.open(MixedSolutionEntryDialogComponent, {
        data: { productionRecordId: this.ProductionRecordID },
        disableClose: true
      });

      await dialogRef.afterClosed().subscribe(async result => {
        try {
          this.dialogService.showLoader();
          await this.getAPIListMixedSolution();
          this.dialogService.hideLoader();
          if (result != undefined) {
            if (result.process != undefined) {
            }
          }
        } catch (error) {
          this.dialogService.hideLoader();
          this.dialogService.showErrorDialog(error);
        }
      });
    } catch (error) {
      this.dialogService.hideLoader();
      this.dialogService.showErrorDialog(error);
    }
  }

  async startEdit(row: any) {
    try {
      const dialogRef = this.dialog.open(MixedSolutionEntryDialogComponent, {
        data: this.objRowSelected = <MixedSolution>row,
        disableClose: true
      });
      console.log(this.objRowSelected)

      await dialogRef.afterClosed().subscribe(async result => {
        try {
          this.dialogService.showLoader();
          await this.getAPIListMixedSolution();
          this.dialogService.hideLoader();
          if (result != undefined) {
            if (result.process != undefined) {
            }
          }
        } catch (error) {
          this.dialogService.hideLoader();
          this.dialogService.showErrorDialog(error);
        }
      });
    } catch (error) {
      this.dialogService.hideLoader();
      this.dialogService.showErrorDialog(error);
    }
  }

  async deleteItem(id: number) {
    try {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
        disableClose: true

      });

      await dialogRef.afterClosed().subscribe(async result => {
        try {
          if (result) {
            let objdelete = this.objListMixedSolution.find(x => x.id === id);
            this.dialogService.showLoader();
            let data: any = await this.brokerAPIService.postAwait(this.UrlAPI_RemoveRowMixedSolution, objdelete);
            this.objAPIResponse = <IAPIResponse>data;
            if (this.objAPIResponse.success) {
              await this.getAPIListMixedSolution();
              this.dialogService.hideLoader();
              this.dialogService.showSnackBar("Delete Complete");
            }
            else {
              this.dialogService.hideLoader();
              this.dialogService.showDialog("Error", "Error", this.objAPIResponse.message);
            }
            // let objdelete = this.objListMixedSolution.find(x => x.id === id);
            // this.brokerAPIService.post(this.UrlAPI_RemoveRowMixedSolution, objdelete).subscribe(
            //   data => {
            //     this.objAPIResponse = <IAPIResponse>data;
            //     if (this.objAPIResponse.success) {
            //       // this.router.navigate(['/auth/productionrecord/mixed-solution-entry']);
            //       this.getAPIListMixedSolution();
            //     }
            //     else {
            //       console.log('this.objAPIResponse.success :' + this.objAPIResponse.success);

            //     }
            //   });

          }
        } catch (error) {
          this.dialogService.hideLoader();
          this.dialogService.showErrorDialog(error);
        }
      });
    } catch (error) {
      this.dialogService.hideLoader();
      this.dialogService.showErrorDialog(error);
    }
  }


  btnCloseClick() {
    try {
      this.router.navigate([this.Url_Listing, { objParams: JSON.stringify(this.objParams) }]);
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

}
