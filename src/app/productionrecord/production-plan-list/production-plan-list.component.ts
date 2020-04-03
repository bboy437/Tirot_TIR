import { Component, OnInit, ViewEncapsulation, AfterViewInit } from "@angular/core";
import { ChangeDetectionStrategy, ViewChild, TemplateRef } from "@angular/core";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from "date-fns";

import { DatePipe, JsonPipe } from "@angular/common";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  MatSort,
  MatPaginator,
  MatTableDataSource,
  MatDialog
} from "@angular/material";
import { Subject } from "rxjs";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from "angular-calendar";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  IProductionPlanByMonthAndShift,
  IShiftSchdule
} from "../../interfaces/productionrecords";

const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3"
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF"
  },
  yellow: {
    primary: "#e3bc08",
    secondary: "#FDF1BA"
  }
};

import * as moment from "moment";
import { Moment } from "moment";
import { FormControl } from "@angular/forms";
import { DialogService } from "../../services/dialog.service";
import { resolve } from "q";
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/

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
  selector: 'app-production-plan-list',
  templateUrl: './production-plan-list.component.html',
  styleUrls: ['./production-plan-list.component.scss'],
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
  ],
  encapsulation: ViewEncapsulation.None

})

export class ProductionPlanListComponent implements OnInit, AfterViewInit {
  objParams: any = {};
  // DateSelected : string;
  objarrYear: any = [];
  objarrMonth: any = [];
  numYearSelected: number;
  numMonthSelected: number;
  arrobjProductionPlan: any = [];
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "jobOrderNo",
    "productCode",
    "planQty",
    "rollNo",
    "processName",
    "planStartTime",
    "teamName",
    "standard",
    "status"
  ];
  private UrlAPI_GetProductionPlanByMonthAndShift: string =
    "ProductionOrder/GetProductionPlanByMonthAndShift/";
  private UrlAPI_GetProductionPlanByDateAndShift: string =
    "ProductionOrder/GetProductionPlanByDateAndShift/";
  private UrlAPI_GetAllShift: string = "ShiftSchedule/GetAll";
  private UrlAPI_GetCurrentShift: string = "Visualization/GetCurrentShift";
  private Url_MachineCheckList: string = "/auth/productionrecord/machine-check-list";
  private Url_Detail: string = "/auth/productionrecord/production-plan-detail";
  private Url_GetCurrentJob: string = "ProductionRecord/GetCurrentJob/"
  @ViewChild("modalContent") modalContent: TemplateRef<any>;
  @ViewChild(MatSort) sort: MatSort;
  view: string = "list";

  arrobjShift: any = [];
  Date: string = "";

  shiftID: number;
  DateSelected: Moment = moment();
  viewDate: Date = new Date();


  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = true;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router, private route: ActivatedRoute,
    public datepipe: DatePipe,
    private dialogService: DialogService
  ) { }

  setYear() {
    var year = new Date();
    this.numYearSelected = year.getFullYear();
    for (let index = 0; index < 11; index++) {
      if (index != 0) {
        year.setFullYear(year.getFullYear() - 1);
      }

      this.objarrYear.push({ year: year.getFullYear() });
    }
    //console.log(this.objarrYear);
  }

  setMonth() {
    var month = new Date();
    this.numMonthSelected = month.getMonth() + 1;
    for (let index = 0; index < 12; index++) {
      month.setMonth(index, 15);
      this.objarrMonth.push({
        month: month.getMonth() + 1,
        name: month.getMonth() + 1
      });
    }

    //  console.log(this.objarrMonth);
  }

  selectedMonthViewDay: CalendarMonthViewDay;
  dayClicked(day: CalendarMonthViewDay): void {
    this.DateSelected = moment(day.date);

    if (this.selectedMonthViewDay) {
      delete this.selectedMonthViewDay.cssClass;
    }

    // console.log(day);
    if (isSameMonth(day.date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, day.date) && this.activeDayIsOpen === true) ||
        day.events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = day.date;
      }
      this.getProductionPlanByMonthAndShift_List();
    } else {
      this.viewDate = day.date;
      this.numMonthSelected = day.date.getMonth() + 1;
      this.getProductionPlanByMonthAndShift_List();
    }

    //console.log("this.viewDate");

    day.cssClass = "cal-day-selected";
    this.selectedMonthViewDay = day;
  }

  async onDateChanged(event) {
    try {
      console.log(event);
      this.viewDate = event;
      // this.selectedMonthViewDay.cssClass = "cal-day-selected";
      this.DateSelected = event;
      this.dialogService.showLoader();
      await this.getProductionPlanByMonthAndShift_List();
    } catch (error) {
      this.dialogService.showDialog("error", "error", error.message);
    }
    this.dialogService.hideLoader();
  }



  async ngOnInit() {
    this.dialogService.showLoader();
    try {

      let params = this.route.snapshot.paramMap;
      if (params.get("objParams") != null) {
        this.objParams = JSON.parse(params.get("objParams"));
        this.DateSelected = moment(this.objParams.dateSelected);
        console.log("DateSelected", this.DateSelected);
      }
      
      await this.getAPIGetCurrentShift();
      //this.shiftID = 30;
      await this.getProductionPlanByMonthAndShift_List();
      // this.getCurrentJob();

    } catch (error) {
      //  console.log(error);
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // getCurrentJob() {
  //   this.brokerAPIService
  //     .get(this.Url_GetCurrentJob + "3")
  //     .subscribe(data => {
  //       console.log("getCurrentJob", data);
  //     });
  // }


  async changeView() {

    try {
      this.activeDayIsOpen = false;
      console.log(this.viewDate);
      this.numMonthSelected = this.viewDate.getMonth() + 1;
      this.numYearSelected = this.viewDate.getFullYear();
      await this.getProductionPlanByMonthAndShift_List();
    } catch (error) {
      console.log("changeView", error);
      throw error;
    }

  }

  async btnPreviousClick() {
    this.dialogService.showLoader();
    try {
      let date = this.DateSelected.add(-1, "days").toDate();
      this.DateSelected = moment(date);
      this.viewDate = this.DateSelected.toDate();
      await this.changeView();
    } catch (error) {
      console.log("btnPreviousClick", error);
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

 async btnTodayClick() {
    this.dialogService.showLoader();
    try {
      let date: Date = new Date();
      this.DateSelected = moment(date);
      this.viewDate = this.DateSelected.toDate();
     await this.changeView();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

 async btnNextClick() {
    this.dialogService.showLoader();
    try {
      let date = this.DateSelected.add(+1, "days").toDate();
      this.DateSelected = moment(date);
      this.viewDate = this.DateSelected.toDate();
     await this.changeView();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
    this.dialogService.hideLoader();
  }

  ShiftChange() {
    try {
      localStorage.setItem("shiftID", this.shiftID.toString());
      this.getProductionPlanByMonthAndShift_List();
    } catch (error) {
      this.dialogService.showErrorDialog(error);
    }
  }

  events: CalendarEvent[] = [];
  async getProductionPlanByMonthAndShift_List() {
    try {

      let strselecteddate: String;
      // strselecteddate = this.datepipe.transform(this.DateSelected, "MM-dd-yyyy");
      strselecteddate = moment(this.DateSelected).format("MM-DD-YYYY");
      //selecteddate.setDate(this.DateSelected.getDate);

      console.log(this.UrlAPI_GetProductionPlanByDateAndShift + strselecteddate + "," + this.shiftID);
      let data: any = [];
      data = await this.brokerAPIService.getAwait(this.UrlAPI_GetProductionPlanByDateAndShift + strselecteddate + "," + this.shiftID);
      this.dataSource.data = data;
      console.log(data);

    } catch (error) {
      console.log("getProductionPlanByMonthAndShift_List", error);
      throw error
    }
  }



  btnNewClick() {
    this.router.navigate([
      this.Url_Detail,
      { id: "new", DateSelected: this.DateSelected.format("YYYY-MM-DDTHH:mm:ss") }
    ]);
  }

  rowClicked(row: any): void {

    //this.router.navigate([this.Url_MachineCheckList, { id: row.id }]);
    console.log("rowClicked", row.status);
    let status: any;
    if (row.status == null) {
      status = 0;
    }
    else {
      status = row.status;
    }

    console.log("objParams", this.objParams);
    //  this.objParams = {};
    this.objParams.productionPlanID = row.id;
    this.objParams.productId = row.productId
    this.objParams.lotNo = row.lotNo;
    this.objParams.dateSelected = this.DateSelected.format("YYYY-MM-DDTHH:mm:ss");
    this.objParams.planStatus = status;
    this.objParams.standardId = row.standardId;
    this.objParams.productionOrderNo = row.productionOrderNo;

    this.router.navigate([this.Url_Detail, { objParams: JSON.stringify(this.objParams) }]);
  }

  async getAPIGetCurrentShift() {
    try {
      let data = await this.brokerAPIService.getAwait(this.UrlAPI_GetCurrentShift);
      if (data != null) {
        this.shiftID = data.currentShift.id;
        localStorage.setItem("shiftID", this.shiftID.toString());
      }
    } catch (error) {
      throw error;
    }
  }

  async getAPIGetAllShift() {
    try {

      let dataAPIGetAllShift = await this.brokerAPIService.getAwait(this.UrlAPI_GetAllShift);
      if (dataAPIGetAllShift == null) {
        return false
      }
      this.arrobjShift = <IShiftSchdule[]>dataAPIGetAllShift.sort(function (a, b) { return a.shiftNo - b.shiftNo; });
      if (localStorage.getItem("shiftID") == null) {
        this.shiftID = this.arrobjShift[0].id;
        localStorage.setItem("shiftID", this.shiftID.toString());
      } else {
        this.shiftID = +localStorage.getItem("shiftID");
      }
      // console.log(localStorage.getItem("shiftID"));
      return true;

    } catch (error) {
      throw error;

    }

  }
}


