
import { Http, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { IAppConfig } from './interfaces/app-config';


@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    constructor(private http: Http) {}

    load() {
        const jsonFile = 'assets/config/config.json';
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response : Response) => {
                AppConfig.settings = <IAppConfig>response.json();
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}