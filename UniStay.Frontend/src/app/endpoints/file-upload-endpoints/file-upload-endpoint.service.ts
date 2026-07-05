import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import { UploadEvent, UploadFileApiResponse } from './file-upload.models';

@Injectable({
  providedIn: 'root'
})
export class FileUploadEndpointService {
  private readonly apiUrl = `${MyConfig.baseUrl}/api/files/upload`;

  constructor(private http: HttpClient) {}

  upload(file: File): Observable<UploadEvent> {
    const formData = new FormData();
    formData.append('file', file);

    return new Observable<UploadEvent>(observer => {
      const subscription = this.http.post<UploadFileApiResponse>(this.apiUrl, formData, {
        observe: 'events',
        reportProgress: true
      }).subscribe({
        next: event => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            observer.next({
              type: 'progress',
              percent: Math.round(100 * event.loaded / event.total)
            });
          }

          if (event.type === HttpEventType.Response) {
            const body = event.body ?? {};
            observer.next({
              type: 'complete',
              fileId: body.fileId ?? body.FileId ?? '',
              fileName: body.fileName ?? body.FileName ?? file.name,
              url: body.url ?? body.Url ?? ''
            });
            observer.complete();
          }
        },
        error: error => observer.error(error)
      });

      return () => subscription.unsubscribe();
    });
  }
}
