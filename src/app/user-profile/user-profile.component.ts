import {UserService} from './../service/user.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthService} from './../service/auth.service';
import {Component, OnInit} from '@angular/core';
import {TextToSpeechService} from '../service/text-to-speech-service';
import {MatSelectChange} from '@angular/material/select';
import {HttpClient} from '@angular/common/http';
import {GlobalConstants} from '../common/global-constants';

interface Language {
    value: string;
    viewValue: string;
};

interface Voice {
    value: string;
    viewValue: string;
    gender: string;
}


@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
    // private userSub:Subscription;
    isAuthenticated = false;
    languages: Language[] = [];
    voiceNames: Voice[] = [];
    dataLoaded = false;
    voiceLoader = false;
    voiceList: any[] = [];
    datalocal: any;
    shortName = '';
    languageName = '';
    genderName = '';
    notSelectedValidationFailed = true;
    playbackcount: any = 0;
    profileData: any
    loggedInUser: any;
    selectedVoice: any;

    fileUploadedAndApproved: any = false;


    constructor(private textToSpeechService: TextToSpeechService, private authService: AuthService, private router: Router,
                private userService: UserService,
                private http: HttpClient,
                private route: ActivatedRoute) {
        this.loggedInUser = JSON.parse(localStorage.getItem('userData'));
                    let routeUser: any;
        this.route.queryParams
        .subscribe(
          (queryParams: Params) => {
              this.dataLoaded = false;
            routeUser = queryParams['userId'] ;
            if (routeUser == null) {
                routeUser = this.loggedInUser.userId;
            }
            this.userService.loadUserData(routeUser).subscribe(res => {
                this.profileData = res;
                console.log(this.profileData.userid)
                console.log(this.loggedInUser.userId);
                this.getVoiceListData();
            });
          }
        );

    }


    ngOnInit() {

            this.userService.fileUploadedAndApproved.subscribe(data => {
                this.fileUploadedAndApproved = data;
            })
    }
    getVoiceListData() {
        this.textToSpeechService.getVoiceList().subscribe(
            data => {
                this.datalocal = data;
                this.languages = [];
                this.voiceList = [];
                console.log(data);
                // tslint:disable-next-line:no-shadowed-variable
                this.datalocal.forEach((element) => {
                    // if (element.LocaleName.indexOf('India') > -1 || element.LocaleName.indexOf('English') > -1) {
                        if (!(this.voiceList.includes(element.Locale + ':' + element.LocaleName))) {
                            this.voiceList.push(element.Locale + ':' + element.LocaleName)
                        // }
                    }
                });

                // tslint:disable-next-line:no-shadowed-variable
                this.voiceList.forEach((element) => {
                    this.languages.push({
                        value: element.substring(0, element.indexOf(':', 0)),
                        viewValue: element.substring(element.indexOf(':', 0) + 1)
                    });
                });

                if (this.profileData.locale !== null && this.profileData.locale !== '') {

                    this.languageName =  this.profileData.locale;
                    this.runValidation();
                    this.voiceNames = [];
                    this.datalocal.forEach(voicelist => {
                        if (voicelist.Locale === this.profileData.locale) {
                            this.voiceNames.push({
                                value: voicelist.ShortName + ':' + voicelist.Gender,
                                viewValue: voicelist.DisplayName + ' (' + voicelist.VoiceType + ')',
                                gender: voicelist.Gender
                            });

                            this.selectedVoice = voicelist.ShortName + ':' + voicelist.Gender;
                        }
                        ;
                    })
                    this.genderName = this.selectedVoice.substring(this.selectedVoice.indexOf(':', 0) + 1);
                    this.shortName = this.selectedVoice.substring(0, this.selectedVoice.indexOf(':', 0));
                    this.runValidation();
                }
                this.dataLoaded = true;
                 this.http.get(GlobalConstants.URL + 'employee/sound/count/' + this.profileData.employeeid).subscribe(count => {
                     this.playbackcount = count;
                     this.dataLoaded = true;
                    console.log(this.languages);
                });


            }
        )

    }

    onChange($event: MatSelectChange) {
        this.shortName = ''
        this.runValidation();
        this.languageName = $event.value;
        console.log($event.value);
        this.voiceNames = [];
        this.datalocal.forEach(data => {
            if (data.Locale === $event.value) {
                this.voiceNames.push({
                    value: data.ShortName + ':' + data.Gender,
                    viewValue: data.DisplayName + ' (' + data.VoiceType + ')',
                    gender: data.Gender
                });
            }
            ;
        });
    }


    onPlayStandard() {
        this.voiceLoader = true;
        const audio = new Audio();

        audio.src = GlobalConstants.URL +
            'employee/download?employeeId=' + this.profileData.employeeid +
            '&employeeName=' + this.profileData.preferedname
             + '&gender=' + this.genderName + '&lang=' +
            this.languageName + '&voiceName=' + this.shortName;

        audio.load();
        audio.play();
        this.setTimeout();

        this.http.get(GlobalConstants.URL + 'employee/sound/count/' + this.profileData.employeeid).subscribe(count => {
            this.playbackcount = count;

            console.log(this.languages);
        });

    }

    setTimeout() {
        setTimeout(() => {
            this.voiceLoader = false
        }, 7000)
    }

    onChangeofVoice(data: MatSelectChange) {
        this.shortName = ''
        this.runValidation();
        this.genderName = data.value.substring(data.value.indexOf(':', 0) + 1);
        this.shortName = data.value.substring(0, data.value.indexOf(':', 0));
        console.log(' The values are ' + this.genderName + ' ' + this.shortName + ' ' + this.languageName);

        this.runValidation();

    }

    runValidation() {
        if (this.shortName !== '' && this.languageName !== '') {
            this.notSelectedValidationFailed = false;
        } else {
            this.notSelectedValidationFailed = true
        }
    }

    checkPlay() {
        return (this.notSelectedValidationFailed || this.fileUploadedAndApproved);

    }
}
