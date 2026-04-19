import { useState } from 'react';
import { useRestaurants } from '../hooks/useRestaurants';
import RestaurantMap from './RestaurantMap';

const RestaurantExplorer = () => {
    const { restaurants, loading, error } = useRestaurants();
    const [searchZip, setSearchZip] = useState("");
    const [mapTarget, setMapTarget] = useState(null);

    // If loading, show a message instead of the map
    if (loading) return <div className="loading">Loading restaurant data...</div>;
    // If error, show the error
    if (error) return <div className="error">Error: {error}</div>;

    const handleSearch = () => {
        if (!searchZip) return;
        const match = restaurants.find(g => g.address.includes(searchZip));
        if (match) {
            setMapTarget({ lat: match.latitude, lng: match.longitude });
        } else {
            alert("No restaurants found for that zip code.");
        }
    }

    return (
        <div className="restaurant-page-container">
            <div className="search-header">
                <input 
                    type="text" 
                    placeholder="Enter Zip Code (e.g., 10011)" 
                    value={searchZip}
                    onChange={(e) => setSearchZip(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="map-frame">
                {!loading && <RestaurantMap restaurants={restaurants} target={mapTarget} />}
            </div>
        </div>
    );
};

export default RestaurantExplorer;