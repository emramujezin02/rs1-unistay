import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MyBaseFormControlComponent} from '../my-base-form-control-component';
import {ControlContainer} from '@angular/forms';
import { SkipSelf } from '@angular/core';
import { Optional } from '@angular/core';

export enum MyInputTextType {
  Text = 'text',
  Password = 'password',
  Email = 'email',
  Number = 'number',
  Tel = 'tel',
  Url = 'url'
}

@Component({
  selector: 'app-my-input-text',
  standalone: false,
  templateUrl: './my-input-text.component.html',
  styleUrls: ['./my-input-text.component.scss'],
  viewProviders:[
    {
      provide:ControlContainer,
      useFactory:(container:ControlContainer)=>container,
      deps:[[new SkipSelf(),new Optional(),ControlContainer]]
    }
  ]
})
export class MyInputTextComponent extends MyBaseFormControlComponent implements OnInit {
 @Output() focus = new EventEmitter<void>();
 
  @Input() myLabel!: string; 
  @Input() myId: string = ''; 
  @Input() myPlaceholder: string = ''; 
  @Input() myType: MyInputTextType = MyInputTextType.Text;

  @Input() override customMessages: Record<string, string> = {};
  @Input() override myControlName: string = "";

  constructor(protected override controlContainer: ControlContainer) {
    super(controlContainer);
  }

    

  ngOnInit(): void {
    if (!this.myId && this.myId === '' && this.formControl) {
      this.myId = this.getControlName();
    }
  }

  onFocus(event:FocusEvent) {
  this.focus.emit();
}

}
