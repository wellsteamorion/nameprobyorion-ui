import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

declare const $: any

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/user-profile', title: 'Dashboard',  icon: 'person', class: '' },
    { path: '/dashboard', title: 'Admin',  icon: 'dashboard', class: '' },

    // { path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
    loggedInUser: any;
    isAdmin : any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
      this.isAdmin = JSON.parse(localStorage.getItem('userData')).roles.includes('ADMIN') ? true : false;

    this.menuItems = ROUTES.filter(menuItem => menuItem);
      this.loggedInUser = JSON.parse(localStorage.getItem('userData'))
      console.log('menu data' + JSON.stringify(this.menuItems))
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

    onClick(title: any) {
        if (title === 'Dashboard') {
            this.router.navigate(['/user-profile'], { relativeTo: this.route ,
                queryParams: { userId: this.loggedInUser.userId }},
            );
        } else {
            this.router.navigate(['/dashboard']
            );
        }
    }
}
