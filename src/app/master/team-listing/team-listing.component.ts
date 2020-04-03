import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import { ITeam } from '../../interfaces/productionrecords';
import {
  MatSort,
  MatPaginator,
  MatTableModule,
  MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-team-listing',
  templateUrl: './team-listing.component.html',
  styleUrls: ['./team-listing.component.scss']
})
export class TeamListingComponent implements OnInit, AfterViewInit{

  
  dataSource = new MatTableDataSource();
  isLoadingResults = true;
  displayedColumns = ['id', 'teamName', 'inActivated'];
  objRowSelected: ITeam;
  filter:string = "" ;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private UrlAPI_GetAll : string = "Team/GetAll";
  private Url_Detail : string = "/auth/master/team-detail";

  constructor(private brokerAPIService: BrokerAPIService,
    private router: Router,
    private route: ActivatedRoute,) { }

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
    this.objRowSelected = <ITeam>row;
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
    this.dataSource.filterPredicate = function(data: ITeam, filter: string): boolean {
      return (
        data.id.toString().toLowerCase().includes(filter) ||
        data.teamName.toString().toLowerCase().includes(filter) ||
        data.inActivated.toString().replace("true","Inactive").replace("false","Active").toLowerCase().includes(filter)
      );
  };
  }


}
