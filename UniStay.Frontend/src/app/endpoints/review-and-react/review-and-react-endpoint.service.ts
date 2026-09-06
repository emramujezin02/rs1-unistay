import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateReviewRequest, ReactToReviewRequest, RoomReview } from './review-and-react.models';

@Injectable({providedIn:'root'})
export class ReviewService{

constructor(private http:HttpClient){}

getReviews(roomId:number): Observable<RoomReview[]> {
return this.http.get<RoomReview[]>(`http://localhost:5177/api/reviews/${roomId}`);
}

addReview(data: CreateReviewRequest): Observable<number> {
return this.http.post<number>(`http://localhost:5177/api/reviews/add`,data);
}

react(data: ReactToReviewRequest): Observable<object> {
return this.http.post<object>(`http://localhost:5177/api/reviews/react`,data);
}

}
