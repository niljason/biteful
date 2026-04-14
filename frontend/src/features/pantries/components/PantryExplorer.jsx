import { useState } from 'react';
import { usePantries } from '../hooks/usePantries';
import PantryMap from './PantryMap';
import './pantries.css';

const PantryExplorer = () => {
    const { groups, loading, error } = usePantries();
    const [searchZip, setSearchZip] = useState("");
    const [mapTarget, setMapTarget] = useState(null);
    const [geoLoading, setGeoLoading] = useState(false);

    // If loading, show a message instead of the map
    if (loading) return <div className="loading">Loading pantry data...</div>;
    // If error, show the error
    if (error) return <div className="error">Error: {error}</div>;

    const handleSearch = () => {
        if (!searchZip) return;
        const match = groups.find(g => g.address.includes(searchZip));
        if (match) {
            setMapTarget({ lat: match.latitude, lng: match.longitude });
        } else {
            alert("No pantries found for that zip code.");
        }
    }

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setMapTarget({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setGeoLoading(false);
            },
            (err) => {
                setGeoLoading(false);
                alert("Unable to retrieve your location. Please check your permissions.");
            }
        );
    };

    return (
        <div className="pantry-page-container">
            <div className="pantry-search-block">
                <div className="pantry-search-header">
                    <span className="pantry-search-title">FIND LOCAL FOOD PANTRIES</span>
                </div>
                
                <div className="pantry-input-wrapper">
                    <div className="pantry-search-button-sq" onClick={handleSearch}>
                        🔍︎
                    </div>
                    <input 
                        type="text" 
                        placeholder="Input zip code..." 
                        className="pantry-zip-input"
                        value={searchZip}
                        onChange={(e) => setSearchZip(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <div
                        className={`pantry-geo-button-sq ${geoLoading ? 'is-loading' : ''}`}
                        onClick={handleUseMyLocation}
                        title="Use current location"
                    >
                        {geoLoading ? (
                            <span className="pantry-spinner"></span>
                        ) : (
                            <svg 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="geo-icon-svg"
                            >
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 2v3m0 14v3m10-10h-3M5 12H2"></path>
                                <circle cx="12" cy="12" r="7"></circle>
                            </svg>
                        )}
                    </div>
                </div>
            </div>

            <div className="map-frame">
                {!loading && <PantryMap pantries={groups} target={mapTarget} />}
            </div>
        </div>
    );
};

export default PantryExplorer;