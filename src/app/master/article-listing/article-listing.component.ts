import { Component, OnInit,  ViewChild, AfterViewInit } from '@angular/core';
import { BrokerAPIService } from '../../services/brokerapi.service';
import 'rxjs/add/operator/map'
import { IArticle } from '../../interfaces/productionrecords';
import { Observable } from 'rxjs/Observable';
import {
  MatSort,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-listing',
  templateUrl: './article-listing.component.html',
  styleUrls: ['./article-listing.component.scss']
})

export class ArticleListingComponent implements OnInit, AfterViewInit {

  isLoadingResults = true;

  dataSource = new MatTableDataSource();
  
  displayedColumns = ['articleName', 'inActivated'];
  objRowSelected: IArticle;
  filter:string="";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  private UrlAPI_GetAll: string = "Article/GetAll";
  private Url_Detail: string = "/auth/master/article-detail";


  constructor(private brokerAPIService: BrokerAPIService, private router: Router,private route: ActivatedRoute,) { }

  ngOnInit() {
    this.isLoadingResults = true;
    let params = this.route.snapshot.paramMap;
    this.brokerAPIService.get(this.UrlAPI_GetAll).subscribe(
      data => {
        console.log("UrlAPI_GetAll");
        console.log(data);
        this.dataSource.data = data;
        this.isLoadingResults = false;
        if(params.get("filter") != null ){
          this.filter = params.get("filter");
        }
        this.dataSource.filter = this.filter.toLowerCase();
      }
    );

    // this.brokerAPIService.downloadimage("Utility/DownloadFile/ae6774e2-7fbb-48ad-8301-3d213b635078.jpeg").subscribe(
    //   data => {
    //     console.log(data);
    //   // this.imageToShow = data;
    //     this.createImageFromBlob(data);
    //     console.log("DownloadFile");
    //     //console.log(data);

    //    // this.dataSource.data = data;
    //   }
    // );
  }

  imageToShow: any;

  createImageFromBlob(image: Blob) {
     let reader = new FileReader();
     reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
     }, false);
  
     if (image) {
        reader.readAsDataURL(image);
     }
  }


  btnNewClick() {
    this.router.navigate([this.Url_Detail, { id: "new", filter: this.filter }]);
  }

  rowClicked(row: any): void {
    console.log(row);
    this.objRowSelected = <IArticle>row;
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
    this.dataSource.filterPredicate = function(data: IArticle, filter: string): boolean {
      return (
        data.articleName.toString().toLowerCase().includes(filter) ||
        data.inActivated.toString().replace("true","Inactive").replace("false","Active").toLowerCase().includes(filter)
      );
    };
  }

}
