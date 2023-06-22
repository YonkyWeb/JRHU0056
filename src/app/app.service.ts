import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    private readonly PDF_EXTENSION_REGEX = /\.pdf$/i;

    constructor(private router: Router,
        private http: HttpClient,
        private sanitizer: DomSanitizer) { }

    manageHttpError(error: HttpErrorResponse) {
        if (error.status === 404) {
            this.router.navigate(['/error-404']);
        } else if (error.status === 500) {
            this.router.navigate(['/error-500']);
        } else if (error.message === 'Timeout has occurred') {
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

    sanarUrl(unsafeUrl: string) {
        let safeUrl: SafeResourceUrl;
        safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        return safeUrl;
    }

    sanarStringCoding(textoEnfermo: string) {
        return this.decodeText(textoEnfermo);
    }

    decodeText(text: string): string {
        const decoder = new TextDecoder('iso-8859-1');
        const decodedText = decoder.decode(new Uint8Array([...text].map((c) => c.charCodeAt(0))));
        return decodedText;
    }

    convertStringFirstCapitalLetter(str: string): string {
        let lowercaseStr = str.toLowerCase();
        let capitalizedStr = lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1); // capitalize first letter
        return capitalizedStr;
    }

    capitalizeWords(str: string): string {
        const words = str.split(/\s+/);
        const capitalizedWords = words.map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
        return capitalizedWords.join(' ');
    }

    downloadPDF(base64: string, fileName: string): void {
        const blob = this.base64ToBlob(base64);
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
    }

    base64ToBlob(base64: string): Blob {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
      
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
      
        return new Blob([bytes], { type: 'application/pdf' });
      }

}
