import { Response } from 'express';
import { IUserRequest } from '../interfaces';
import fetch from 'node-fetch';
import { User } from '../models/index.model';
import { Place, PlaceDetails } from '../interfaces';

const key = process.env['GOOGLE_API_KEY'] || '';
const googleKey = key;
const RADIUS = 4000;

async function findPlaces(req: IUserRequest, res: Response): Promise<void> {
  try {
    const { longitude, latitude, typeOfNight } = req.body;
    let pageToken = req.body.token || '';

    const user = await User.findOne({ where: { email: req.user.email } });
    await user!.update({ longitude, latitude, typeOfNight });

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${RADIUS}&rankBy=distance&keyword=${typeOfNight}&key=${key}&pagetoken=${pageToken}`;

    const data = await fetch(url);
    const result = await data.json();
    const places = result.results;
    const nextPageToken = result.next_page_token || '';

    let finalResults = places?.map(
      (place: any) =>
        <Place>{
          latitude: place.geometry?.location?.lat,
          longitude: place.geometry?.location?.lng,
          name: place.name,
          photoUrl: `https://maps.googleapis.com/maps/api/place/photo?photoreference=${
            place.photos && place.photos[0] && place.photos[0].photo_reference
          }&sensor=false&maxheight=1000&maxwidth=600&key=${googleKey}`,
          placeId: place.place_id,
          priceLevel: place.price_level,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          vicinity: place.vicinity,
          open: place.opening_hours?.open_now,
        }
    );
    finalResults = finalResults.filter((place: any) => {
      return place.photoUrl !== undefined || place.rating !== undefined;
    });

    res.status(200).send({ finalResults, nextPageToken });
  } catch (error) {
    res
      .status(401)
      .send({ error: error.message, message: 'Can not find places' });
  }
}

async function getPlaceDetails(
  req: IUserRequest,
  res: Response
): Promise<void> {
  try {
    const { placeId } = req.params;
    if (!placeId) throw new Error('placeId not passed');
    const url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${key}`;
    const data = await fetch(url);
    const result = await data.json();
    const place = result.result;

    const finalResult = <PlaceDetails>{
      address: place.formatted_address,
      phoneNumber: place.formatted_phone_number,
      latitude: place.geometry?.location?.lat,
      longitude: place.geometry?.location?.lng,
      name: place.name,
      openNow: place.opening_hours?.open_now,
      openingTime: place.opening_hours?.weekday_text,
      photos: place.photos
        ?.map(
          (photo: any) =>
            `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo.photo_reference}&sensor=false&maxheight=1000&maxwidth=600&key=${googleKey}`
        )
        .slice(0, 3),
      placeId: place.place_id,
      priceLevel: place.price_level,
      rating: place.rating,
      types: place.types,
      googleMapUrl: place.url,
      totalRatings: place.user_ratings_total,
      vicinity: place.vicinity,
      website: place.website,
    };
    res.status(200).send(finalResult);
  } catch (error) {
    res
      .status(401)
      .send({ error: error.message, message: 'Can not get place details' });
  }
}

export { findPlaces, getPlaceDetails };
