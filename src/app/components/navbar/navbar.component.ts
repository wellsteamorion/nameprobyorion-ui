import { UserService } from './../../service/user.service';
import { GlobalConstants } from './../../common/global-constants';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private toggleButton: any;
    private sidebarVisible: boolean;
    users: any = [];
    usersCopy: any = [];
    usersLoaded = false;
    loggedInUser: any;

    constructor(location: Location, private element: ElementRef, private router: Router, private authService: AuthService,
        private userService: UserService,
                private route: ActivatedRoute) {
        this.location = location;
        this.sidebarVisible = false;
    }

    ngOnInit() {
        this.loggedInUser= JSON.parse(localStorage.getItem('userData'));
        console.log('Logged oin user is'+JSON.stringify(this.loggedInUser));
        this.userService.loadUsers().subscribe(res => {
            this.users = res
            this.usersCopy = res;
            console.log(this.users);
            this.usersLoaded = !this.usersLoaded;
        });
        this.listTitles = ROUTES.filter(listTitle => listTitle);
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.router.events.subscribe((event) => {
            this.sidebarClose();
            var $layer: any = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
                this.mobile_menu_visible = 0;
            }
        });
    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);

        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };
    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const body = document.getElementsByTagName('body')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            body.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function () {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function () {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            } else if (body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function () {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function () { //asign a function
                body.classList.remove('nav-open');
                this.mobile_menu_visible = 0;
                $layer.classList.remove('visible');
                setTimeout(function () {
                    $layer.remove();
                    $toggle.classList.remove('toggled');
                }, 400);
            }.bind(this);

            body.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };

    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(1);
        }

        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }

    logout() {
        this.authService.logout();
    }

    // @ViewChild("something") something: ElementRef;
    // source: any;
    // ngAfterViewInit(): void {
    //     this.source = fromEvent(this.something.nativeElement, 'keyup');
    //     this.source.pipe(debounceTime(1200)).subscribe(c => {
    //         console.log("This is hit");
    //     }
    //     );
    // }

    searchConfigTree() {

    }

    filter = '';
    private timer: any;

    searchChange(filter: string, to = false) {
        filter = filter.toLowerCase();

        if (to) {
            clearTimeout(this.timer);

            this.timer = setTimeout(() => {
                console.log("This is hit with delay" + filter);
                this.users = [];
                this.usersCopy.forEach((loop) => {

                    if (loop.userid.toLowerCase().indexOf(filter) > -1 ||
                        loop.fullname.toLowerCase().indexOf(filter) > -1
                    ) {
                        this.users.push(loop);
                    };


                });
                console.log(this.users);

                // this.userService.loadUsersBYSearch(filter).subscribe(
                //     (data: any)=>{
                //         this.users=data;
                //         console.log("This is hit without delay" + filter)
                //     }
                // );
            }, 100);
        } else {
            console.log("This is hit without delay" + filter)
        }
    }

    onUserClick(userid: any) {

        console.log('This userID is'+ userid)
        this.router.navigate(['/user-profile'], { relativeTo: this.route ,
                queryParams: { userId: userid }},
            );
        // this.router.navigate(['/user-profile'], { queryParams: { userId: userid }, skipLocationChange: true });
    }
}
