import { useState, useCallback } from 'react';

export function useLocation() {
  const [locationError, setLocationError] = useState('');

  const requireCoordinates = useCallback(() => {
    return new Promise((resolve, reject) => {
      setLocationError('');

      if (!navigator.geolocation) {
        const err = 'Geolocation is not supported by your browser.';
        setLocationError(err);
        return reject(err);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy_meters: position.coords.accuracy,
          });
        //   console.log('User location obtained:', position);
        },
        (error) => {
          let errMessage = 'Location request failed.';
          if (error.code === error.PERMISSION_DENIED) {
            errMessage = 'Location access is required to generate a better personalized itinerary. Please enable location permissions in your browser.';
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            errMessage = 'Unable to detect your location. Please check your device location settings.';
          } else {
            errMessage = 'Location request timed out. Please try again.';
          }
          setLocationError(errMessage);
          reject(errMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 9000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { requireCoordinates, locationError, setLocationError };
}