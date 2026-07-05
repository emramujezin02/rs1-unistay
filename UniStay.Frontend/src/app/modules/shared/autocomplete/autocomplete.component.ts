import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone:false,
})
export class AutocompleteComponent implements OnInit {

  @Input() entity!: string;          // halls, equipment, faults...
  @Input() placeholder: string = '';
  @Output() selected = new EventEmitter<string>();

  searchControl = new FormControl('');
  suggestions: string[] = [];
  showDropdown = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value || value.length < 1) {
          return of([]);
        }

        return this.http.get<string[]>(
          `/api/autocomplete?entity=${this.entity}&term=${value}`
        );
      })
    ).subscribe(results => {
      this.suggestions = results;
      this.showDropdown = results.length > 0;
    });
  }

  selectSuggestion(value: string) {
    this.searchControl.setValue(value, { emitEvent: false });
    this.selected.emit(value);
    this.showDropdown = false;
  }

  onBlur() {
    setTimeout(() => this.showDropdown = false, 200);
  }
}