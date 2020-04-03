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
import { FinalInspectionListDialogComponent } from './dialog/final-inspection-list-dialog/final-inspection-list-dialog.component';
import { DialogService } from '../../services/dialog.service';

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
  selector: 'app-final-inspection-list',
  templateUrl: './final-inspection-list.component.html',
  styleUrls: ['./final-inspection-list.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class FinalInspectionListComponent implements OnInit {
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "jobOrderNo",
    "lotNo",
    "productName",
    "startProductionTime",
    "endProductionTime",
    "productionLength"
  ];
  private UrlAPI_GetAllAvailableForInspect: string = "FinalInspection/GetAllAvailableForInspect";
  private Url_Detail: string = "/auth/productionrecord/final-inspection-detail";
  private UrlAPI_GetAll: string = "FinalInspection/GetAll";

  objRow: any;
  objAPIResponse: IAPIResponse;
  objRowSelected: FinalInspection;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  filter: any;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dialogService: DialogService, ) { }

  async ngOnInit() {
    let params = this.route.snapshot.paramMap;

    try {
      this.dialogService.showLoader();
      await this.showData();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  async showData() {

    try {
      let params = this.route.snapshot.paramMap;
      let data: any = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllAvailableForInspect);
      console.log("data", data);
      this.dataSource.data = data;

      if (params.get("filter") != null) {
        this.filter = params.get("filter");
        this.dataSource.filter = this.filter.toLowerCase();
      }

    } catch (error) {
      throw error;
    }
  }

  // sortData(event): void {
  //   this.assetsQueryService.setSorts(event);
  //   this.showData();
  // }

  addNew() {
    const dialogRef = this.dialog.open(FinalInspectionListDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      this.showData();
      if (result != undefined) {
        if (result.process != undefined) {
        }
      }
    });
  }

  rowClicked(row: any): void {
    this.objRowSelected = <FinalInspection>row;
    this.router.navigate([this.Url_Detail, { objProductionRecord: JSON.stringify(this.objRowSelected) }]);

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function (data: FinalInspection, filter): boolean {
      return (
        data.productionPlanId.toString().toLowerCase().includes(filter) ||
        data.startProductionTime.toString().toLowerCase().includes(filter) ||
        data.endProductionTime.toString().toLowerCase().includes(filter)
      );
    };
  }

}
