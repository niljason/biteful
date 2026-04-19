import { useState } from 'react';

const ZIP_CODE_PATTERN = /^\d{5}$/;

export const extractZipCode = (address = '') => {
    const zipMatch = address.match(/\b\d{5}(?:-\d{4})?\b/);
    return zipMatch ? zipMatch[0].slice(0, 5) : '';
};

export const useLocationSearch = (onLocationFound) => {
    const [zip, setZip] = useState("");
    const [zipError, setZipError] = useState("");
    const [geoLoading, setGeoLoading] = useState(false);

    const handleZipChange = (val) => {
        const cleanZip = val.replace(/\D/g, '').slice(0, 5);
        setZip(cleanZip);
        setZipError(cleanZip.length > 0 && cleanZip.length < 5 ? 'Enter a valid 5-digit ZIP code.' : '');
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) return alert("Geolocation not supported.");
        
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGeoLoading(false);
                onLocationFound({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {
                setGeoLoading(false);
                alert("Location access denied.");
            }
        );
    };

    const validateZip = () => {
        const isValid = ZIP_CODE_PATTERN.test(zip);
        if (!isValid) setZipError('Enter a valid 5-digit ZIP code.');
        return isValid;
    };

    return { zip, setZip, zipError, geoLoading, handleZipChange, handleMyLocation, validateZip };
};