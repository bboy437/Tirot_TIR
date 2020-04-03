import { Component, OnInit, ViewEncapsulation } from "@angular/core";
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

import { DatePipe } from "@angular/common";
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
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from "angular-calendar";
import { BrokerAPIService } from "../../services/brokerapi.service";
import { Router } from "@angular/router";
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
import { FormControl } from "../../../../node_modules/@angular/forms";
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
  selector: "app-production-planing",
  templateUrl: "./production-planing.component.html",
  styleUrls: ["./production-planing.component.scss"],
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
export class ProductionPlaningComponent implements OnInit {
  isLoadingResults = false;
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
    "standard"
  ];

  private UrlAPI_GetProductionPlanByMonthAndShift: string =
    "ProductionOrder/GetProductionPlanByMonthAndShift/";
  private UrlAPI_GetProductionPlanByDateAndShift: string =
    "ProductionOrder/GetProductionPlanByDateAndShift/";
  private UrlAPI_GetAllShift: string = "ShiftSchedule/GetAll";

  private Url_Detail: string = "/auth/transaction/production-planing-entry";

  @ViewChild("modalContent") modalContent: TemplateRef<any>;
  view: string = "month";

  arrobjShift: any = [];

  shiftID: number;
  DateSelected: Moment = moment(new Date());
  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent("Edited", event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent("Deleted", event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: "A 3 day event",
  //     color: colors.red,
  //     actions: this.actions
  //   },
  //   {
  //     start: startOfDay(new Date()),
  //     title: "An event with no end date",
  //     color: colors.yellow,
  //     actions: this.actions
  //   },
  //   {
  //     start: subDays(endOfMonth(new Date()), 3),
  //     end: addDays(endOfMonth(new Date()), 3),
  //     title: "A long event that spans 2 months",
  //     color: colors.blue,
  //     draggable: true
  //   },
  //   {
  //     start: addHours(startOfDay(new Date()), 2),
  //     end: new Date(),
  //     title: "A draggable and resizable event",
  //     color: colors.yellow,
  //     actions: this.actions,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true
  //     },
  //     draggable: true
  //   }
  // ];

  activeDayIsOpen: boolean = true;

  constructor(
    private brokerAPIService: BrokerAPIService,
    private router: Router,
    public datepipe: DatePipe
  ) {}

  // dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  //   console.log("dayClicked");
  //   console.log(date);
  //   day.cssClass = 'cal-day-selected';
  //   if (isSameMonth(date, this.viewDate)) {
  //     if (
  //       (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
  //       events.length === 0
  //     ) {
  //       this.activeDayIsOpen = false;
  //     } else {
  //       this.activeDayIsOpen = true;
  //       this.viewDate = date;

  //     }
  //   }
  // }

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
      this.getProductionPlanByMonthAndShift();
    }

    //console.log("this.viewDate");

    day.cssClass = "cal-day-selected";
    this.selectedMonthViewDay = day;
  }

  public onDateChanged(event): void {
    console.log(event);
    this.viewDate = event;

    // this.selectedMonthViewDay.cssClass = "cal-day-selected";
    this.DateSelected = event;
    this.getProductionPlanByMonthAndShift();
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent("Dropped or resized", event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    console.log(this.modalData);
    if (action == "Edited") {
      this.router.navigate([this.Url_Detail, { id: event.id }]);
    }

    // this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: "New event",
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }

  ngOnInit() {
    this.isLoadingResults = true;
    this.setYear();
    this.setMonth();

    this.setSelectShift();
  }

  MonthChange(monthdata) {
    this.numMonthSelected = monthdata;
    let datemonth: Date = new Date();
    datemonth.setMonth(monthdata - 1, 15);
    this.viewDate = datemonth;
    console.log(this.viewDate);

    this.getProductionPlanByMonthAndShift();
  }

  YearChange(yeardata) {
    this.numYearSelected = yeardata;
    let datemonth: Date = new Date();
    datemonth.setFullYear(yeardata, this.numMonthSelected - 1, 15);
    this.viewDate = datemonth;
    this.getProductionPlanByMonthAndShift();
  }

  ShiftChange() {
    localStorage.setItem("shiftID", this.shiftID.toString());
    this.getProductionPlanByMonthAndShift();
  }

  btnClickChange() {
    this.changeView();
  }

  private changeView() {
    this.activeDayIsOpen = false;
    console.log(this.viewDate);
    this.numMonthSelected = this.viewDate.getMonth() + 1;
    this.numYearSelected = this.viewDate.getFullYear();
    this.getProductionPlanByMonthAndShift();
  }

  btnPreviousClick() {
    let date = this.DateSelected.add(-1, "days").toDate();
    this.DateSelected = moment(date);
    this.viewDate = this.DateSelected.toDate();
    this.changeView();
  }

  btnTodayClick() {
    let date: Date = new Date();
    this.DateSelected = moment(date);
    this.viewDate = this.DateSelected.toDate();
    this.changeView();
  }

  btnNextClick() {
    let date = this.DateSelected.add(+1, "days").toDate();
    this.DateSelected = moment(date);
    this.viewDate = this.DateSelected.toDate();
    this.changeView();
  }

  events: CalendarEvent[] = [];
  getProductionPlanByMonthAndShift() {
    this.isLoadingResults = true;

    this.brokerAPIService
      .get(
        this.UrlAPI_GetProductionPlanByMonthAndShift +
          this.numMonthSelected +
          "," +
          this.numYearSelected +
          "," +
          this.shiftID
      )
      .subscribe(data => {
        this.arrobjProductionPlan = <IProductionPlanByMonthAndShift[]>data;

        function custom_sort(a, b) {
          return (
            new Date(a.planStartTime).getTime() -
            new Date(b.planStartTime).getTime()
          );
        }

        this.arrobjProductionPlan.sort(custom_sort);
        let i: number = 0;
        let dataCalendarEvent: any = [];
        console.log(this.arrobjProductionPlan);
        this.arrobjProductionPlan.forEach(element => {
          
          dataCalendarEvent[i] = {};
          dataCalendarEvent[i].id = element.id;
          (dataCalendarEvent[i].start = new Date(element.planDate)),
            (dataCalendarEvent[i].end = new Date(element.planDate)),
            (dataCalendarEvent[i].title =
              moment(element.planStartTime).format("HH:mm") +
              " - " +
              element.caption),
            (dataCalendarEvent[i].color = {
              primary : element.bgColor,
              secondary : element.bgColor
            }),
            (dataCalendarEvent[i].actions = this.actions),
            (dataCalendarEvent[i].resizable = {
              beforeStart: true,
              afterEnd: true
            });
        
          // ,(dataCalendarEvent[i].draggable = true);
          i++;
        });
        //  console.log(dataCalendarEvent);
        this.events = dataCalendarEvent;
        this.isLoadingResults = false;
        //console.log(this.arrobjProductionPlan);
        //console.log(this.events);

        this.getProductionPlanByMonthAndShift_List();
      });
  }

  getProductionPlanByMonthAndShift_List() {
    this.isLoadingResults = true;
    let strselecteddate: String;
    // strselecteddate = this.datepipe.transform(this.DateSelected, "MM-dd-yyyy");
    strselecteddate = moment(this.DateSelected).format("MM-DD-YYYY");
    //selecteddate.setDate(this.DateSelected.getDate);
    console.log(
      this.UrlAPI_GetProductionPlanByDateAndShift +
        strselecteddate +
        "," +
        this.shiftID
    );
    this.brokerAPIService
      .get(
        this.UrlAPI_GetProductionPlanByDateAndShift +
          strselecteddate +
          "," +
          this.shiftID
      )
      .subscribe(data => {
        this.dataSource.data = data;
        console.log(data);
        this.isLoadingResults = false;
      });
  }

  btnNewClick() {
    this.router.navigate([
      this.Url_Detail,
      { id: "new", date: this.DateSelected.format("YYYY-MM-DDTHH:mm:ss") }
    ]);
  }

  rowClicked(row: any): void {
    this.router.navigate([this.Url_Detail, { id: row.id }]);
  }

  setSelectShift() {
    this.brokerAPIService.get(this.UrlAPI_GetAllShift).subscribe(data => {
      this.arrobjShift = <IShiftSchdule[]>data.sort(function(a, b){return a.shiftNo - b.shiftNo;});

      // console.log(this.arrobjShift);
      if (localStorage.getItem("shiftID") == null) {
        this.shiftID = this.arrobjShift[0].id;
        localStorage.setItem("shiftID", this.shiftID.toString());
      } else {
        this.shiftID = +localStorage.getItem("shiftID");
      }
      console.log(localStorage.getItem("shiftID"));
      //this.shiftID = this.arrobjShift[0].id;
      // console.log(this.arrobjFG);
      this.getProductionPlanByMonthAndShift();
    });
  }

  
}
