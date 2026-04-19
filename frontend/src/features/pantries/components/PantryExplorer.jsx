import { useState, useMemo } from 'react';
import { usePantries } from '../hooks/usePantries';
import PantryMap from './PantryMap';
import { useLocationSearch, extractZipCode } from '../../common/useLocationSearch'
import ZipSearchInput from '../../common/components/ZipSearchInput';
import './pantries.css';

const DAYS_OF_WEEK = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

const PantryExplorer = () => {
    const { groups, loading, error } = usePantries();
    const [mapTarget, setMapTarget] = useState(null);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const { 
        zip, 
        zipError, 
        geoLoading, 
        handleZipChange, 
        handleMyLocation, 
        validateZip,
        setZip 
    } = useLocationSearch((coords) => setMapTarget(coords));

    // filter(Boolean) removes falsy values for safety
    // useMemo to cache data
    const pantryTypes = useMemo(() => {
        return [...new Set(
            groups.flatMap(group => 
                group.programs.map(p => p.program?.trim()).filter(Boolean)
            )
        )].sort();
    }, [groups]);

    const toggleSelection = (value, setSelectedValues) => {
        setSelectedValues((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
        );
    };

    // groups is data loaded from backend
    // a pantry can have multiple programs, programs is an array
    const filteredGroups = useMemo(() => {
        return groups.filter((group) => {
            // Only filter by ZIP if the user has entered a full 5-digit code
            if (zip.length === 5) {
                if (extractZipCode(group.address) !== zip) return false;
            }

            if (selectedDays.length > 0) {
                const hasDay = group.programs.some(p => selectedDays.includes(p.day_of_week));
                if (!hasDay) return false;
            }

            if (selectedTypes.length > 0) {
                const hasType = group.programs.some(p => selectedTypes.includes(p.program?.trim()));
                if (!hasType) return false;
            }

            return true;
        });
    }, [groups, zip, selectedDays, selectedTypes]);

    const handleSearch = () => {
        if (!validateZip()) return;

        const match = filteredGroups.find((group) => extractZipCode(group.address) === zip);
        if (match) {
            setMapTarget({ lat: match.latitude, lng: match.longitude });
        } else {
            alert("No pantries found for the current filters.");
        }
    };

    const clearFilters = () => {
        setZip("");
        setSelectedDays([]);
        setSelectedTypes([]);
        setMapTarget(null);
    };

    // If loading, show a message instead of the map
    if (loading) return <div className="loading">Loading pantry data...</div>;
    // If error, show the error
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="pantry-page-container">
            <div>
                <span className="pantry-search-title">FIND LOCAL FOOD PANTRIES</span>

            <ZipSearchInput 
                    zip={zip}
                    onChange={handleZipChange}
                    onSearch={handleSearch}
                    onGeoClick={handleMyLocation}
                    loading={geoLoading}
                    error={zipError}
                />

                <div className="pantry-filters-panel">
                    <div className="pantry-filter-group">
                        <span className="pantry-filter-label">Open Days</span>
                        <div className="pantry-filter-chip-row pantry-filter-chip-row-days">
                            {DAYS_OF_WEEK.map((day) => (
                                <button
                                    key={day}
                                    type="button"
                                    className={`pantry-filter-chip ${selectedDays.includes(day) ? 'is-selected' : ''}`}
                                    onClick={() => toggleSelection(day, setSelectedDays)}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pantry-filter-group">
                        <span className="pantry-filter-label">Pantry Types</span>
                        <div className="pantry-filter-chip-row">
                            {pantryTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    className={`pantry-filter-chip ${selectedTypes.includes(type) ? 'is-selected' : ''}`}
                                    onClick={() => toggleSelection(type, setSelectedTypes)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pantry-filter-footer">
                        <span className="pantry-results-count">
                            Showing {filteredGroups.length} {filteredGroups.length === 1 ? 'pantry' : 'pantries'}
                        </span>
                        <button
                            type="button"
                            className="pantry-clear-filters"
                            onClick={clearFilters}
                        >
                            Clear filters
                        </button>
                    </div>
                </div>
            </div>

            <div className="map-frame">
                {!loading && <PantryMap pantries={filteredGroups} target={mapTarget} />}
            </div>
        </div>
    );
};

export default PantryExplorer;
