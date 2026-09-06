export interface RoomReview {
  roomReviewID?: number;
  roomReviewId?: number;
  RoomReviewID?: number;
  comment: string;
  rating: number;
  createdAt: string;
  user: string;
  likes: number;
  Likes?: number;
  dislikes: number;
  Dislikes?: number;
  userReaction?: boolean | null;
  UserReaction?: boolean | null;
}

export interface CreateReviewRequest {
  RoomID: number;
  Rating: number;
  Comment: string;
}

export interface ReactToReviewRequest {
  ReviewID: number;
  IsLike: boolean;
}
