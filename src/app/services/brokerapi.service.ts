import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient, HttpErrorResponse, HttpClientJsonpModule } from '@angular/common/http';
import { IAPIResponse } from '../interfaces/apiResponse';
import { AppConfig } from '../app.config';

@Injectable()
export class BrokerAPIService {
  protected ServerApiUrl = AppConfig.settings.ServerApiUrl;
  constructor(private http: HttpClient) {}

  getHeaderContentTypeJson() {
    const headerDict = {
      authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json"
    };
    return headerDict;
  }

  getHeader() {
    const headerDict = {
      authorization: "Bearer " + localStorage.getItem("token")
    };
    return headerDict;
  }

  getHeaderDownloadImage() {
    const headerDict = {
      authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwNi0wMDAwODAiLCJqdGkiOiI5MThiOTc3ZS1iYTExLTQyZDEtODc5ZS1lZWZiM2VjMDUxOWIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjFlMDk0ODQ5LTAyZjQtNGU0MS1iMmQ1LTc4NWNhMDQ2ZDdiYyIsImV4cCI6MTUzMjE0NzI3MiwiaXNzIjoiaHR0cDovL3d3dy5zb2xkZXYuY28udGgiLCJhdWQiOiJodHRwOi8vd3d3LnNvbGRldi5jby50aCJ9.5AwVeilLaXxHvGx4owTSUUCVie6ab91w5kfKu-JoP4U"
    };
    return headerDict;
  }

  async getAwait(
    strUrl: string,
    resolveCallBack: Function = null,
    rejectCallBack: Function = null
  ): Promise<any> {
    return new Promise((resolve, reject) => {

      
      this.get(strUrl).subscribe(
        data => {
          //  console.log("Complete Load : success");
          // setTimeout(() => {
          //   resolve(data);
          //   if (resolveCallBack != null) resolveCallBack(data);
          // }, 1000);
          resolve(data);
          if (resolveCallBack != null) resolveCallBack(data);
        },
        err => {
          // console.log("Complete Load : fail");
          // alert(err.message);
          reject(err);
          if (rejectCallBack != null) rejectCallBack(err);
        }
      );
    });
    // .then(data => {
    //   resolveCallBack(data);
    // })
    // .catch(err => {
    //   alert(err.message);

    //   console.log(err);
    //   switch (err.status) {
    //     case 404:
    //       console.log("Is 404");
    //       break;

    //     default:
    //       console.log("error code = " + err.status);
    //       break;
    //   }
    //   if (rejectCallBack != null) rejectCallBack(err);
    // });
  }

  async postAwait(
    strUrl: string,
    objbody: any,
    resolveCallBack: Function = null,
    rejectCallBack: Function = null
  ) {
    return new Promise((resolve, reject) => {
      this.post(strUrl, objbody).subscribe(
        data => {
          // console.log("Complete Load : success");
          // setTimeout(() => {
          //   resolve(data);
          //   if (resolveCallBack != null) resolveCallBack(data);
          // }, 1000);
          resolve(data);
          if (resolveCallBack != null) resolveCallBack(data);
        },
        err => {
          // console.log("Complete Load : fail");
          // alert(err.message);
          reject(err);
          if (rejectCallBack != null) rejectCallBack(err);
        }
      );
    });
    // .then(data => {
    //   resolveCallBack(data);
    // })
    // .catch(err => {
    //   alert(err.message);

    //   console.log(err);
    //   switch (err.status) {
    //     case 404:
    //       console.log("Is 404");
    //       break;

    //     default:
    //       console.log("error code = " + err.status);
    //       break;
    //   }
    //   if (rejectCallBack != null) rejectCallBack(err);
    // });
  }

  get(strUrl: string): Observable<any> {

    console.log("XXXXXX strUrl",this.ServerApiUrl + strUrl);
    return this.http.get<any>(this.ServerApiUrl + strUrl, {
      headers: this.getHeaderContentTypeJson()
    });
  }

  post(strUrl: string, objbody: any): Observable<IAPIResponse> {
    return this.http.post<IAPIResponse>(this.ServerApiUrl + strUrl, objbody, {
      headers: this.getHeaderContentTypeJson()
    });
  }

  upload(strUrl: string, objbody: any): Observable<IAPIResponse> {
    let input = new FormData();
    input.append("file", objbody);
    return this.http.post<IAPIResponse>(this.ServerApiUrl + strUrl, input, {
      headers: this.getHeader()
    });
  }

  downloadimage(strUrl: string): Observable<Blob> {
    return this.http.get(this.ServerApiUrl + strUrl, {
      responseType: "blob",
      headers: this.getHeaderDownloadImage()
    });
  }
}
