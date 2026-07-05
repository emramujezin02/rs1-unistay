import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InviteSendEndpointService } from '../../../endpoints/invite-endpoints/invite-send-endpoint.service';

@Component({
  selector: 'app-invite-friend',
  standalone: false,
  templateUrl: './invite-friend.component.html',
  styleUrls: ['./invite-friend.component.scss']
})
export class InviteFriendComponent implements OnInit {
  form!: FormGroup;
  inviteLink = 'http://localhost:4200/';
  submitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private inviteService: InviteSendEndpointService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendInvite(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.inviteService.sendInvite({
      email: this.form.value.email
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.form.reset();
        this.snackBar.open('Invite sent', 'Close', { duration: 3000 });
      },
      error: () => {
        this.submitting = false;
        this.snackBar.open('Error sending invite', 'Close', { duration: 4000 });
      }
    });
  }
}
