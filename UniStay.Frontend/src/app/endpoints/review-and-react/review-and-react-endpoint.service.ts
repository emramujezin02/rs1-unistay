import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn:'root'})
export class ReviewService{

constructor(private http:HttpClient){}

getReviews(roomId:number){
return this.http.get<any[]>(`http://localhost:5177/api/reviews/${roomId}`);
}

addReview(data:any){
return this.http.post(`http://localhost:5177/api/reviews/add`,data);
}

react(data:any){
return this.http.post(`http://localhost:5177/api/reviews/react`,data);
}

}