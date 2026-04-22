import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useRestaurants } from '../hooks/useRestaurants';
import { useLocationSearch } from '../../common/useLocationSearch';
import ZipSearchInput from '../../common/components/ZipSearchInput';
import '../../common/components/explorer.css';
import RestaurantMap from './RestaurantMap';
import './restaurants.css';

const SCHEDULE_FETCH_DELAY_MS = 180;
const MAX_VISIBLE_CUISINES = 12;

const RestaurantExplorer = () => {
    const { 
        restaurants = [], 
        loading = false, 
        error = null, 
        fetchByZipcode,
        fetchAll 
    } = useRestaurants() || {};

    const [mapTarget, setMapTarget] = useState(null);
    const [nameQuery, setNameQuery] = useState('');
    const [selectedCuisines, setSelectedCuisines] = useState([]);
    const [selectedGrades, setSelectedGrades] = useState([]);

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
        if (!fetchAll) return;

        let timeoutId = null;
        let idleId = null;
        let cancelled = false;

        const startFetch = () => {
            if (cancelled) return;
            fetchAll();
        };

        if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            idleId = window.requestIdleCallback(startFetch, { timeout: 1000 });
        } else {
            timeoutId = window.setTimeout(startFetch, SCHEDULE_FETCH_DELAY_MS);
        }

        return () => {
            cancelled = true;

            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }

            if (idleId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
                window.cancelIdleCallback(idleId);
            }
        };
    }, [fetchAll]);

    const cuisineOptions = useMemo(() => {
        const counts = new Map();

        for (const restaurant of restaurants) {
            const cuisine = restaurant.cuisine;
            if (!cuisine) continue;
            counts.set(cuisine, (counts.get(cuisine) || 0) + 1);
        }

        return [...counts.entries()]
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1];
                return a[0].localeCompare(b[0]);
            })
            .slice(0, MAX_VISIBLE_CUISINES)
            .map(([cuisine]) => cuisine);
    }, [restaurants]);

    const gradeOptions = useMemo(() => {
        return [...new Set(
            restaurants.map((restaurant) => restaurant.grade).filter(Boolean)
        )].sort();
    }, [restaurants]);

    const toggleSelection = (value, setSelectedValues) => {
        setSelectedValues((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };

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

    const filteredRestaurants = useMemo(() => {
        const normalizedQuery = nameQuery.trim().toLowerCase();

        return restaurants.filter((restaurant) => {
            if (normalizedQuery) {
                const matchesName = restaurant.name?.toLowerCase().includes(normalizedQuery);
                const matchesAddress = restaurant.address?.toLowerCase().includes(normalizedQuery);
                if (!matchesName && !matchesAddress) return false;
            }

            if (selectedCuisines.length > 0 && !selectedCuisines.includes(restaurant.cuisine)) {
                return false;
            }

            if (selectedGrades.length > 0 && !selectedGrades.includes(restaurant.grade)) {
                return false;
            }

            return true;
        });
    }, [nameQuery, restaurants, selectedCuisines, selectedGrades]);
    const deferredFilteredRestaurants = useDeferredValue(filteredRestaurants);
    const deferredVisibleRestaurantIds = useMemo(() => {
        return new Set(deferredFilteredRestaurants.map((restaurant) => restaurant.id).filter(Boolean));
    }, [deferredFilteredRestaurants]);

    const clearFilters = () => {
        setNameQuery('');
        setSelectedCuisines([]);
        setSelectedGrades([]);
    };

    const derivedMapTarget = useMemo(() => {
        if (mapTarget) return mapTarget;
        if (loading || restaurants.length === 0) return null;

        const hasActiveFilters = Boolean(nameQuery.trim()) || selectedCuisines.length > 0 || selectedGrades.length > 0;
        const first = hasActiveFilters ? filteredRestaurants[0] : restaurants[0];
        if (!first?.latitude || !first?.longitude) return null;

        return {
            lat: Number(first.latitude),
            lng: Number(first.longitude)
        };
    }, [filteredRestaurants, loading, mapTarget, nameQuery, restaurants, selectedCuisines.length, selectedGrades.length]);

    return (
        <div className="restaurant-page-container">
            <div className="restaurant-search-section">
                <div className="header-flex">
                    <span className="pantry-search-title">RESTAURANT EXPLORER</span>
                    {!loading && (
                        <span className="res-count-badge">
                            {filteredRestaurants.length.toLocaleString()} locations found
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

                <div className="restaurant-filters-panel">
                    <div className="restaurant-filter-group">
                        <label htmlFor="restaurant-name-search" className="restaurant-filter-label">
                            Search Restaurants
                        </label>
                        <input
                            id="restaurant-name-search"
                            type="text"
                            className="restaurant-name-input"
                            value={nameQuery}
                            onChange={(event) => setNameQuery(event.target.value)}
                            placeholder="Search by restaurant name or address"
                        />
                    </div>

                    {cuisineOptions.length > 0 && (
                        <div className="restaurant-filter-group">
                            <span className="restaurant-filter-label">Cuisine</span>
                            <div className="restaurant-filter-chip-row">
                                {cuisineOptions.map((cuisine) => (
                                    <button
                                        key={cuisine}
                                        type="button"
                                        className={`restaurant-filter-chip ${selectedCuisines.includes(cuisine) ? 'is-selected' : ''}`}
                                        onClick={() => toggleSelection(cuisine, setSelectedCuisines)}
                                    >
                                        {cuisine}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {gradeOptions.length > 0 && (
                        <div className="restaurant-filter-group">
                            <span className="restaurant-filter-label">Inspection Grade</span>
                            <div className="restaurant-filter-chip-row">
                                {gradeOptions.map((grade) => (
                                    <button
                                        key={grade}
                                        type="button"
                                        className={`restaurant-filter-chip ${selectedGrades.includes(grade) ? 'is-selected' : ''}`}
                                        onClick={() => toggleSelection(grade, setSelectedGrades)}
                                    >
                                        {grade}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="restaurant-filter-footer">
                        <span className="restaurant-results-count">
                            Showing {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
                        </span>
                        <button
                            type="button"
                            className="restaurant-clear-filters"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
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
                    visibleRestaurantIds={deferredVisibleRestaurantIds}
                    target={derivedMapTarget} 
                />
            </div>
        </div>
    );
};

export default RestaurantExplorer;
