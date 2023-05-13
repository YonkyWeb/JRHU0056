import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private readonly PDF_EXTENSION_REGEX = /\.pdf$/i;

    constructor(private router:Router,
        private http:HttpClient,
        private sanitizer: DomSanitizer) { }

    manageHttpError(error: HttpErrorResponse) {
        if (error.status === 404) {
            this.router.navigate(['/error-404']);
        } else if (error.status === 500) {
            this.router.navigate(['/error-500']);
        } else if(error.message === 'Timeout has occurred') {
            this.router.navigate(['/unknown-error']);
        } else {
            this.router.navigate(['/unknown-error']);
        }
    }

    getIPAddress() {
        return this.http.get('https://api.ipify.org?format=json');
    }

    getIPAddress1() {
        return this.http.get('https://ipapi.co/json/');
    }

    goOutErrorApp() {
        this.router.navigate(['dashboard']);
    }

    isFileValid(file: File): boolean {
        return this.PDF_EXTENSION_REGEX.test(file.name);
    }

    sanarUrl(unsafeUrl:string) {
        let safeUrl: SafeResourceUrl;
        return safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    }
}
