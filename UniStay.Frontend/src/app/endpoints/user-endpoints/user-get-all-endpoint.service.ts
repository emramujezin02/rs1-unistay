import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MyConfig } from '../../my-config';
import { PageResult, UserDto, UserGetAllResponse, UserListFilters, UserListItem } from './user.models';

export type { UserGetAllResponse, UserListFilters, UserListItem } from './user.models';

type UserListApiResponse = Partial<PageResult<UserDto>> & {
  data?: UserDto[];
  students?: UserDto[];
  totalCount?: number;
  pageNumber?: number;
};

@Injectable({
  providedIn: 'root'
})
export class UserGetAllEndpointService {
  private apiUrl = `${MyConfig.baseUrl}/Users`;

  constructor(private http: HttpClient) {}

  getAll(filter: UserListFilters & { pageNumber?: number; pageSize?: number } = {}): Observable<UserGetAllResponse> {
    let params = new HttpParams()
      .set('Paging.Page', filter.pageNumber ?? 1)
      .set('Paging.PageSize', filter.pageSize ?? 10);

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '' && key !== 'pageNumber' && key !== 'pageSize') {
        params = params.set(key, value);
      }
    });

    return this.http.get<UserListApiResponse | UserDto[]>(this.apiUrl, { params }).pipe(
      map((result) => this.normalizeResponse(result, filter))
    );
  }

  private normalizeResponse(
    result: UserListApiResponse | UserDto[],
    filter: UserListFilters & { pageNumber?: number; pageSize?: number }
  ): UserGetAllResponse {
    const items = Array.isArray(result)
      ? result
      : result.items ?? result.data ?? result.students ?? [];
    const requestedPageSize = filter.pageSize ?? 10;
    const pageSize = Array.isArray(result)
      ? requestedPageSize
      : result.pageSize ?? requestedPageSize;
    const pageNumber = Array.isArray(result)
      ? filter.pageNumber ?? 1
      : result.currentPage ?? result.pageNumber ?? filter.pageNumber ?? 1;
    const totalCount = Array.isArray(result)
      ? items.length
      : result.totalItems ?? result.totalCount ?? items.length;
    const totalPages = Array.isArray(result)
      ? Math.ceil(totalCount / Math.max(pageSize, 1))
      : result.totalPages ?? Math.ceil(totalCount / Math.max(pageSize, 1));

    return {
      items,
      pageSize,
      currentPage: pageNumber,
      includedTotal: Array.isArray(result) ? true : result.includedTotal ?? true,
      totalItems: totalCount,
      totalPages,
      totalCount,
      pageNumber
    };
  }
}
