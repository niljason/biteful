import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Link } from 'react-router-dom';
import BaseMap, { purpleIcon } from '../../common/components/BaseMap';
import 'leaflet/dist/leaflet.css';

const RestaurantMap = ({ restaurants = [], target }) => {
    const [selectedRestaurantId, setSelectedRestaurantId] = useState(null);
    const markerRefs = useRef(new Map());

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

    useEffect(() => {
        if (!selectedRestaurantId) return;

        const selectedMarker = markerRefs.current.get(selectedRestaurantId);
        if (!selectedMarker) return;

        const frameId = requestAnimationFrame(() => {
            selectedMarker.openPopup();
        });

        return () => cancelAnimationFrame(frameId);
    }, [selectedRestaurantId]);

    return (
        <BaseMap target={target}>
            <MarkerClusterGroup
                chunkedLoading={true}
                chunkInterval={120}
                chunkDelay={40}
                removeOutsideVisibleBounds={true}
                animate={false}
                animateAddingMarkers={false}
                showCoverageOnHover={false}
                maxClusterRadius={20}
                spiderfyOnMaxZoom={true}
                spiderfyDistanceMultiplier={2.5}
                zoomToBoundsOnClick={false}
            >
                {markerData.map((restaurant) => (
                    <Marker 
                        key={restaurant.markerKey}
                        position={restaurant.position}
                        icon={purpleIcon}
                        ref={(markerInstance) => {
                            if (markerInstance) {
                                markerRefs.current.set(restaurant.markerKey, markerInstance);
                            } else {
                                markerRefs.current.delete(restaurant.markerKey);
                            }
                        }}
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
                                    <h3 className="rpc-name">{restaurant.name || 'Unknown Restaurant'}</h3>

                                    {restaurant.phone && (
                                        <a
                                            href={`tel:${restaurant.phone.replace(/\D/g, '')}`}
                                            className="rpc-phone"
                                        >
                                            {restaurant.phone}
                                        </a>
                                    )}

                                    {restaurant.address && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="rpc-address"
                                            title="Open in Maps"
                                        >
                                            {restaurant.address}
                                        </a>
                                    )}

                                    {(restaurant.cuisine || restaurant.grade) && (
                                        <div className="rpc-meta">
                                            {restaurant.cuisine && (
                                                <div className="rpc-category-group">
                                                    <span className="rpc-category-label">Cuisine</span>
                                                    <div className="rpc-detail-row">{restaurant.cuisine}</div>
                                                </div>
                                            )}
                                            {restaurant.grade && (
                                                <div className="rpc-category-group">
                                                    <span className="rpc-category-label">Grade</span>
                                                    <div className="rpc-detail-row">{restaurant.grade}</div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="rpc-links">
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
