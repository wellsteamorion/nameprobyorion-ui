import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from "app/common/global-constants";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  loadPendingApprovals() {
    return this.http.get<any>(GlobalConstants.URL + 'employee/sound/pending');
  }

}
