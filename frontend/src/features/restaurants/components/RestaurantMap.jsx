import React, { useEffect, useMemo, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Link } from 'react-router-dom';
import BaseMap, { purpleIcon } from '../../common/components/BaseMap';
import 'leaflet/dist/leaflet.css';

// Utility to handle map movement when a target location changes
const MapRecenter = ({ target }) => {
    const map = useMap();
    useEffect(() => {
        if (target?.lat && target?.lng) {
            map.flyTo([target.lat, target.lng], 15, { animate: true });
        }
    }, [target, map]);
    return null;
};

const RestaurantMap = ({ restaurants = [], target }) => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);

    const validRestaurants = useMemo(() => {
        return (restaurants || []).filter(res => 
            res && 
            res.latitude != null && 
            res.longitude != null &&
            !isNaN(Number(res.latitude)) &&
            !isNaN(Number(res.longitude))
        );
    }, [restaurants]);

    const markerData = useMemo(() => {
        return validRestaurants.map((restaurant, index) => ({
            ...restaurant,
            markerKey: restaurant.id || `res-${index}`,
            position: [Number(restaurant.latitude), Number(restaurant.longitude)],
        }));
    }, [validRestaurants]);

    return (
        <BaseMap>
            <MapRecenter target={target} />
            
            <MarkerClusterGroup
                chunkedLoading={true}
                chunkInterval={120}
                chunkDelay={40}
                removeOutsideVisibleBounds={true}
                animate={false}
                animateAddingMarkers={false}
                showCoverageOnHover={false}
                maxClusterRadius={20}
                disableClusteringAtZoom={17}
                spiderfyOnMaxZoom={true}
            >
                {markerData.map((restaurant) => (
                    <Marker 
                        key={restaurant.markerKey}
                        position={restaurant.position}
                        icon={purpleIcon}
                        eventHandlers={{
                            click: () => setSelectedRestaurantId(restaurant.markerKey),
                            popupclose: () => setSelectedRestaurantId((currentId) => (
                                currentId === restaurant.markerKey ? null : currentId
                            )),
                        }}
                    >
                        {selectedRestaurantId === restaurant.markerKey && (
                            <Popup className="rpc-popup">
                                <div className="rpc">
                                    <p className="rpc-name">{restaurant.name || 'Unknown Restaurant'}</p>

                                    <div className="rpc-meta">
                                        {restaurant.cuisine && (
                                            <span className="rpc-cuisine">{restaurant.cuisine}</span>
                                        )}
                                        {restaurant.grade && (
                                            <span className="rpc-grade">Grade: {restaurant.grade}</span>
                                        )}
                                    </div>

                                    <div className="rpc-links" style={{ display: 'flex', flexDirection: 'column', gap: '5px', margin: '10px 0' }}>
                                        <Link 
                                            to={`/${restaurant.id}/menu`} 
                                            state={{ name: restaurant.name, address: restaurant.address, phone: restaurant.phone }}
                                        >
                                            View Menu
                                        </Link>
                                        <Link 
                                            to={`/${restaurant.id}/menu/upload`} 
                                            state={{ name: restaurant.name, address: restaurant.address, phone: restaurant.phone }}
                                        >
                                            Upload Menu
                                        </Link>
                                    </div>

                                    {restaurant.phone && (
                                        <div className="rpc-phone">📞 {restaurant.phone}</div>
                                    )}

                                    {restaurant.address && (
                                        <>
                                            <div className="rpc-divider" style={{ margin: '8px 0', borderTop: '1px solid #eee' }} />
                                            <span>📍 </span>
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="rpc-address"
                                                title="Open in Maps"
                                            >
                                                {restaurant.address}
                                            </a>
                                        </>
                                    )}
                                </div>
                            </Popup>
                        )}
                    </Marker>
                ))}
            </MarkerClusterGroup>
        </BaseMap>
    );
};

export default React.memo(RestaurantMap);
