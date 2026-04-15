import { useState, useEffect } from 'react';
import { restaurantService } from '../services/restaurantService';

export const useRestaurants = () => {
    const [state, setState] = useState({
        restaurants: [], // Initialized as empty array to prevent .map() undefined errors
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const rawData = await restaurantService.getAll();
                
                // Grouping Logic: Coordinates as the unique key
                const grouped = rawData.reduce((acc, item) => {
                    const lat = parseFloat(item.latitude);
                    const lng = parseFloat(item.longitude);
                    
                    if (isNaN(lat) || isNaN(lng)) return acc;

                    const key = `${lat}_${lng}`;
                    
                    if (!acc[key]) {
                        acc[key] = {
                            id: key,
                            name: item.name?.trim() || "Unknown Restaurant",
                            address: item.address?.trim() || "",
                            latitude: lat,
                            longitude: lng,
                            rating: item.rating != null ? Number(item.rating) : null,
                            rating_count: item.rating_count != null ? Number(item.rating_count) : null,
                            price_category: item.price_category != null ? Number(item.price_category) : null,
                            url: item.url?.trim() || "",
                            zip_code: item.zip_code?.trim() || ""
                        };
                    }
                    return acc;
                }, {});

                setState({
                    groups: Object.values(grouped),
                    loading: false,
                    error: null
                });
            } catch (err) {
                console.error("Failed to load restaurants:", err);
                setState({
                    groups: [],
                    loading: false,
                    error: err.message || "Failed to fetch restaurant data"
                });
            }
        };

        fetchRestaurants();
    }, []);

    return state;
};