import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { MyConfig } from '../../my-config';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ProfileSettingsApiDto,
  ProfileSettingsDto,
  ProfileSettingsUpdateRequest,
  ProfileTheme,
  SetThemeResponse
} from './profile-settings.models';

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsEndpointService {
  private readonly authUrl = `${MyConfig.baseUrl}/api/auth`;
  private readonly usersUrl = `${MyConfig.baseUrl}/api/users`;
  private readonly legacyUsersUrl = `${MyConfig.baseUrl}/Users`;

  constructor(private http: HttpClient) {}

  getCurrentProfile(): Observable<ProfileSettingsDto> {
    return this.http
      .get<ProfileSettingsApiDto>(`${this.authUrl}/me`)
      .pipe(
        map(profile => this.mapProfile(profile)),
        catchError(error => {
          const userId = Number(localStorage.getItem('id'));

          if (!userId) {
            return throwError(() => error);
          }

          return this.http
            .get<ProfileSettingsApiDto>(`${this.legacyUsersUrl}/${userId}`)
            .pipe(map(profile => this.mapProfile(profile)));
        })
      );
  }

  updateCurrentProfile(request: ProfileSettingsUpdateRequest): Observable<ProfileSettingsDto> {
    return this.http
      .put<ProfileSettingsApiDto>(`${this.usersUrl}/me`, request)
      .pipe(map(profile => this.mapProfile(profile)));
  }

  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    return this.http.post<ChangePasswordResponse>(`${this.usersUrl}/change-password`, request);
  }

  setTheme(theme: ProfileTheme): Observable<SetThemeResponse> {
    return this.http.post<SetThemeResponse>(`${this.usersUrl}/theme`, { theme });
  }

  private mapProfile(profile: ProfileSettingsApiDto): ProfileSettingsDto {
    const id = profile.id ?? profile.userId ?? profile.userID ?? profile.UserId ?? profile.UserID ?? 0;
    const rawTheme = profile.theme ?? profile.Theme ?? 'light';
    const theme: ProfileTheme = rawTheme?.toString().toLowerCase() === 'dark' ? 'dark' : 'light';

    return {
      id,
      userId: profile.userId ?? profile.UserId ?? id,
      userID: profile.userID ?? profile.UserID ?? id,
      email: profile.email ?? profile.Email ?? '',
      firstName: profile.firstName ?? profile.FirstName ?? '',
      lastName: profile.lastName ?? profile.LastName ?? '',
      username: profile.username ?? profile.Username ?? '',
      phone: profile.phone ?? profile.Phone ?? '',
      dateOfBirth: profile.dateOfBirth ?? profile.DateOfBirth ?? null,
      profileImage: profile.profileImage ?? profile.ProfileImage ?? '',
      theme,
      roleId: profile.roleId ?? profile.RoleId ?? null,
      roleName: profile.roleName ?? profile.RoleName ?? '',
      isEnabled: profile.isEnabled ?? profile.IsEnabled ?? true,
      createdAt: profile.createdAt ?? profile.CreatedAt ?? '',
      updatedAt: profile.updatedAt ?? profile.UpdatedAt ?? null
    };
  }
}
