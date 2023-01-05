import {
  Component,
  isDevMode,
  OnDestroy,
  OnInit,
  Renderer2,
} from "@angular/core";
import { Router } from "@angular/router";
/* import { single } from '../../../assets/json/data'; */

import { ViewChild } from "@angular/core";
import { SortEvent } from "primeng/api";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { ProgressSpinnerModule } from "primeng/progressspinner";

import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from "ngx-bootstrap/datepicker";

import * as xml2js from "xml2js";

import Swal from "sweetalert2";

import * as moment from "moment";
import { NgxPermissionsService, NgxRolesService } from "ngx-permissions";
import { HttpClient } from "@angular/common/http";
declare var $: any;
const exp = /^EXT-/g;
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  /* rm -rf node_modules/
  npm cache clear
  npm install

  npm install jquery --save

npm install datatables.net --save

npm install datatables.net-dt --save

npm install angular-datatables --save

npm install @types/jquery --save-dev

npm install @types/datatables.net --save-dev

npm install bootstrap --save

https://github.com/xbox2204/SpringBoot-JPA-Swagger-Angular/blob/master/app/Angular/src/app/book-list/book-list.component.ts
 */
  /* Para datepicker

https://valor-software.com/ngx-bootstrap/#/datepicker#min-mode
 */
  datePickerValue: Date = new Date();
  dateRangePickerValue: Date[];
  minMode: BsDatepickerViewMode = "year";
  minDate: Date = new Date(2009, 0);
  maxDate: Date = new Date();
  datePickerInvalidState: boolean;
  datePickerInvalidText: string;
  loadingButton: boolean;

  bsConfig: Partial<BsDatepickerConfig>;

  progressPercent: number;

  cols: any[];

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private ps: NgxPermissionsService,
    private rs: NgxRolesService,
    private http: HttpClient
  ) {}
  permissions$ = this.ps.permissions$;
  roles$ = this.rs.roles$;
  
  ngOnInit(): void {null}

  ngAfterViewInit(): void {
    this.renderer.listen("document", "click", (event) => {
      if (event.target.hasAttribute("view-link-id")) {
        if (isDevMode()) console.log(event);
      }
    });
  }

  ngOnDestroy() {null}
  onSelect(data): void {
    if (isDevMode())
      console.log("Item clicked", JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    if (isDevMode()) console.log("Activate", JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    if (isDevMode())
      console.log("Deactivate", JSON.parse(JSON.stringify(data)));
  }
}
