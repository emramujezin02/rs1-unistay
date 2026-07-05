import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AutocompleteOption{
    name:string;
    equipmentType:string;
  }

type AutocompleteSuggestion = string | {
  value?: string;
  name?: string;
};
@Injectable({
  providedIn: 'root'
})



export class AutocompleteEndpointService {

  private baseUrl = 'http://localhost:5177/api/autocomplete';

  constructor(private http: HttpClient) {}

  getSuggestions(entity: string, term: string): Observable<string[]> {
    return this.http.get<AutocompleteSuggestion[]>(
      `${this.baseUrl}?entity=${entity}&term=${term}`
    ).pipe(
      map((results) => results
        .map((item) => typeof item === 'string' ? item : item.value || item.name || '')
        .filter((item) => !!item)
      )
    );


  }

   getEquipmentSuggestions(entity: string, term: string): Observable<AutocompleteOption[]> {
    return this.http.get<AutocompleteOption[]>(
      `${this.baseUrl}?entity=${entity}&term=${term}`
    );

    
  }
}
