import { Request } from 'express';
import User from './models/user.model';

interface IUserRequest extends Request {
  user?: any;
  event?: any;
}

interface TokenInterface {
  email: string;
}

interface userToken extends User {
  token?: any;
}

interface Place {
  latitude: string;
  longitude: string;
  name: string;
  photoUrl?: string;
  placeId: string;
  priceLevel?: number;
  rating?: number;
  userRatingsTotal?: number;
  vicinity?: string;
}

interface PlaceDetails {
  address?: string;
  phoneNumber?: string;
  latitude?: string;
  longitude?: string;
  name?: string;
  openNow?: string;
  openingTime?: string;
  photos?: string[];
  placeId?: string;
  priceLevel?: number;
  rating?: number;
  types?: string[];
  googleMapUrl?: string;
  totalRatings?: number;
  vicinity?: string;
  website?: string;
}

export { IUserRequest, TokenInterface, userToken, Place, PlaceDetails };
