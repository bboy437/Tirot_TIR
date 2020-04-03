import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { IDefect } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-defect-listing',
  templateUrl: './defect-listing.component.html',
  styleUrls: ['./defect-listing.component.scss']
})

export class DefectListingComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource();
  isLoadingResults = true;
  displayedColumns = ['defectCode', 'defectName', 'inActivated'];

  objRowSelected: IDefect;
  filter:string="";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll : string = "Defect/GetAll";
  private Url_Detail : string = "/auth/master/defect-detail";

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,) { 
      
    }

  ngOnInit() {
    this.isLoadingResults = true;
    let params = this.route.snapshot.paramMap;
      this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(data => {
        this.dataSource.data = data;
        this.isLoadingResults = false;
        if(params.get("filter") != null ){
          this.filter = params.get("filter");
        }
        this.dataSource.filter = this.filter.toLowerCase();
        
      });
  }

  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <IDefect>row;
    this.router.navigate([this.Url_Detail, { id: this.objRowSelected.id, filter: this.filter } ]);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = function(data: IDefect, filter: string): boolean {
      return (
        data.defectCode.toString().toLowerCase().includes(filter) ||
        data.defectName.toString().toLowerCase().includes(filter) ||
        data.inActivated.toString().replace("true","Inactive").replace("false","Active").toLowerCase().includes(filter)
      );
  };
  }

}
