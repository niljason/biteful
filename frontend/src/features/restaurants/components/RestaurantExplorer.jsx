import { useEffect, useMemo, useState } from 'react';
import { useRestaurants } from '../hooks/useRestaurants';
import { useLocationSearch } from '../../common/useLocationSearch';
import ZipSearchInput from '../../common/components/ZipSearchInput';
import '../../common/components/explorer.css';
import RestaurantMap from './RestaurantMap';
import './restaurants.css';

const RestaurantExplorer = () => {
    const { 
        restaurants = [], 
        loading = false, 
        error = null, 
        fetchByZipcode,
        fetchAll 
    } = useRestaurants() || {};

    const [mapTarget, setMapTarget] = useState(null);

    const locationSearch = useLocationSearch((coords) => setMapTarget(coords)) || {};
    
    const { 
        inputRef, 
        committedZip = "",
        zipError = "", 
        setZipError = () => {},
        geoLoading = false, 
        handleZipChange = () => {}, 
        handleMyLocation = () => {},
        commitZip = () => {}
    } = locationSearch;

    useEffect(() => {
        if (fetchAll) {
            fetchAll();
        }
    }, [fetchAll]);

    const handleSearch = () => {
        const currentZip = inputRef?.current?.value || "";
        if (currentZip.length !== 5) {
            setZipError("Enter a valid 5-digit ZIP.");
            return;
        }
        setZipError("");
        commitZip(currentZip);
        if (fetchByZipcode) fetchByZipcode(currentZip);
    };

    const derivedMapTarget = useMemo(() => {
        if (mapTarget) return mapTarget;
        if (loading || !committedZip || restaurants.length === 0) return null;

        const first = restaurants[0];
        if (!first?.latitude || !first?.longitude) return null;

        return {
            lat: Number(first.latitude),
            lng: Number(first.longitude)
        };
    }, [committedZip, loading, mapTarget, restaurants]);

    return (
        <div className="restaurant-page-container">
            <div className="restaurant-search-section">
                <div className="header-flex">
                    <span className="pantry-search-title">RESTAURANT EXPLORER</span>
                    {!loading && (
                        <span className="res-count-badge">
                            {restaurants.length.toLocaleString()} locations found
                        </span>
                    )}
                </div>

                <ZipSearchInput 
                    inputRef={inputRef}
                    onChange={handleZipChange}
                    onSearch={handleSearch}
                    onGeoClick={handleMyLocation}
                    loading={geoLoading || loading}
                    error={zipError || error}
                />
            </div>

            <p className="restaurant-map-hint">Double-click a pin to view restaurant details.</p>

            <div className="map-frame" style={{ position: 'relative' }}>
                {loading && (
                    <div className="map-loading-overlay">
                        <div className="spinner"></div>
                        <p>Loading {restaurants.length === 0 ? 'City Data' : 'Clusters'}...</p>
                    </div>
                )}

                <RestaurantMap 
                    restaurants={restaurants} 
                    target={derivedMapTarget} 
                />
            </div>
        </div>
    );
};

export default RestaurantExplorer;
