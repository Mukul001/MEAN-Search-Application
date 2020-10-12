import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,  of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Issue } from './issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService
{
  uri = 'http://localhost:3001';
  constructor(private http: HttpClient) { }

    fetchIssues(regNumber:String): Observable<Issue[]>
    {
      return this.http.get<Issue[]>(`${this.uri}/${regNumber}`).pipe(
        catchError(err => of([])))
    };
}

//--------------------------------------------------------------------------------------------------------------------
// private API_URL = 'https://www.googleapis.com/youtube/v3/search';
  // private API_TOKEN = 'YOUR_API_KEY';
  // constructor(private http: HttpClient) {}
  // getVideos(query: string): Observable <any> {
  //   const url = `${this.API_URL}?q=${query}&key=${this.API_KEY}&part=snippet&type=video&maxResults=10`;
  //   return this.http.get(url)
  //     .pipe(
  //       map((response: any) => response.items)
  //     );
  // }
