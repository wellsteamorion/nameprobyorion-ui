import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {GlobalConstants} from '../common/global-constants';

@Injectable({ providedIn: 'root' })
export class TextToSpeechService {
    constructor(private http: HttpClient) {}

    getVoiceList() {
       return  this.http.get(GlobalConstants.URL + 'texttospeech/voicelist');
    }
}
