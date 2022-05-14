import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import * as RecordRTC from 'recordrtc'
import {GlobalConstants} from '../../common/global-constants';
import {UserService} from '../../service/user.service';

@Component({
    selector: 'app-recorded',
    templateUrl: './recordedvoice.component.html',
    styleUrls: ['./recordedvoice.component.scss']
})
export class RecordedvoiceComponent implements OnInit, OnChanges {
    title = 'micRecorder';
    fileUploadInProgress = false;
    fileFound = false;
    @Input('employeeId') employeeID: any;
    @Input('userid') userid: any;


    // Lets declare Record OBJ
    record: any;
    // Will use this flag for toggeling recording
    recording = false;
    // URL of Blob
    url: any;
    urlRecorded: any;
    approvalDto: any;
    error: any;
    voiceLoader = false;
    isRecordedVoicePresent = false;
    loader = false;
    recordedData: any;
    isAdmin: any;
    isLoggedInUser: any;
    loggedInUser: any;
    file: File = null;
    fileAttr: any = 'Upload a sound file(.wav)';

    invalidFileFormat = false;
    ngOnInit() {




      this.isAdmin = JSON.parse(localStorage.getItem('userData')).roles.includes('ADMIN') ? true : false;
      this.loggedInUser = JSON.parse(localStorage.getItem('userData'));
      this.isLoggedInUser = this.userid == this.loggedInUser.userId ? true : false;
        this.recordedData = {'status' : 'Not Found',
            'recordedData' : new Date(),
            'recordedbyname': this.loggedInUser.userId

        };
        this.fileFound = false;
        this.loader = true;
        this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
            .subscribe((data: any) => {
                console.log('data here' + JSON.stringify(data));
                if (data) {
                    this.recordedData = data;
                    this.fileFound = true
                    if (this.recordedData.status === 'Approved') {
                        this.userService.fileUploadedAndApproved.next(true);
                    }


                } else {
                    this.userService.fileUploadedAndApproved.next(false);
                }
                this.loader = false;
            });

    }

    constructor(private domSanitizer: DomSanitizer, private http: HttpClient,
                private userService: UserService) {
    }

    sanitize(url: string) {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }

    /**
     * Start recording.
     */
    initiateRecording() {
        this.invalidFileFormat = false;
        this.recording = true;
        const mediaConstraints = {
            video: false,
            audio: true
        };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then(this.successCallback.bind(this), this.errorCallback.bind(this));
    }

    /**
     * Will be called automatically.
     */
    successCallback(stream: any) {
        const options = {
            mimeType: 'audio/wav',
            numberOfAudioChannels: 1,
            sampleRate: 44100
        };
        // Start Actuall Recording
        const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
        this.record = new StereoAudioRecorder(stream, options);
        this.record.record();
    }

    /**
     * Stop recording.
     */
    stopRecording() {
        this.recording = false;
        this.loader = true;
        this.record.stop(this.processRecording.bind(this));
    }

    /**
     * processRecording Do what ever you want with blob
     * @param  {any} blob Blog
     */

    processRecording(blob: any) {
        this.url = URL.createObjectURL(blob);
        console.log('blob', blob);
        console.log('url', this.url);
        const formData = new FormData();


        formData.append('Recorded-' + this.employeeID + '.wav', blob);

        this.send(blob);


    }

    send(audioFile: File) {
        const formData: FormData = new FormData();
        formData.append('file', audioFile, 'Recorded-' + this.employeeID + '.wav');
        this.http.post(GlobalConstants.URL + 'employee/sound/' + this.employeeID
            , formData, {responseType: 'blob'}).subscribe(data => {
         ;
            this.urlRecorded =
                GlobalConstants.URL + 'blob/getBlob?blobName=Recorded-' + this.employeeID + '.wav';
            console.log('recorded data is' + JSON.stringify(data) )
            this.recordedData.status = 'Pending'
            this.recordedData.recordedbydate = new Date();
            this.recordedData.recordedbyname = this.loggedInUser.userId;
            this.fileFound = true;
            this.loader = false

        });


    }


    /**
     * Process Error.
     */
    errorCallback(error: any) {
        this.error = 'Can not play audio in your browser';
    }


    onPlayStandard() {

        const audio = new Audio();
        this.loader = true;
        audio.src = GlobalConstants.URL + 'blob/getBlob?blobName=Recorded-' + this.employeeID + '.wav';
        audio.load();
        audio.play();
        this.setTimeout()

    }

    setTimeout() {
        setTimeout(() => {
            this.loader = false
        }, 5000)
    }

    onDelete() {
        this.loader = true;
        this.http.delete(GlobalConstants.URL + 'employee/sound/' + this.employeeID, {
            responseType: 'blob'
        })
            .subscribe(data => {
                this.loader = false;
                this.fileFound = false
                this.userService.fileUploadedAndApproved.next(false);
            })


    }

    onApprove() {
        this.loader = true;

        this.http.post(GlobalConstants.URL + 'employee/sound/approve',
            {
                'employeeId': this.employeeID,
                'approvalEmployeeId': 1989197,
                'approved': 1,
                'reason': '',
            }, {responseType: 'blob'})
            .subscribe(data => {
                this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
                    .subscribe((localdata: any) => {
                        console.log('data here' + JSON.stringify(localdata));
                        if (localdata) {
                            this.recordedData = localdata
                        }
                        this.loader = false;
                        this.fileFound = true;
                        this.userService.fileUploadedAndApproved.next(true);
                    });

            });
    }

    ngOnChanges() {
        // create header using child_id
        console.log(this.employeeID);
        this.loggedInUser = JSON.parse(localStorage.getItem('userData'));
        this.isLoggedInUser = this.userid == this.loggedInUser.userId ? true : false;
        this.loader = true;
        this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
            .subscribe((data: any) => {
                console.log('data here' + JSON.stringify(data));
                if (data) {
                    this.recordedData = data;
                    this.fileFound = true;
                    if (this.recordedData.status === 'Approved') {

                        this.userService.fileUploadedAndApproved.next(true);

                    }
                }
                this.loader = false;
            });
    }

showRecording() {
    return (this.fileFound && (this.isLoggedInUser || this.isAdmin))
    || (this.fileFound && !this.isLoggedInUser && this.recordedData?.status === 'Approved')
}
    onDecline() {
        this.loader = true;

        this.http.post(GlobalConstants.URL + 'employee/sound/approve',
            {
                'employeeId': this.employeeID,
                'approvalEmployeeId': 1989197,
                'approved': 0,
                'reason': 'declined',
            }, {responseType: 'blob'})
            .subscribe(data => {
                this.http.get(GlobalConstants.URL + 'employee/sound/' + this.employeeID)
                    .subscribe((localdata: any) => {
                        console.log('data here' + JSON.stringify(localdata));
                        if (localdata) {
                            this.recordedData = localdata
                        }
                        this.loader = false;
                        this.fileFound = true;

                        this.userService.fileUploadedAndApproved.next(false);
                    });

            });
    }

    onChange(event: any) {
        this.invalidFileFormat = false;
        this.file = event.target.files[0];
        this.fileAttr = this.file.name;
        if (this.fileAttr.indexOf('.wav') === -1) {
            this.invalidFileFormat = true;
            return;

        }
        this.loader = true;
        this.send(this.file); ;

    }

    uploadFileEvt($event: Event) {

    }
}
