import { useState, useEffect } from 'react';
import { restaurantService } from '../services/restaurantService';

export const useRestaurants = () => {
    const [state, setState] = useState({
        restaurants: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const rawData = await restaurantService.getAll();

                const restaurants = rawData
                    .filter(item => {
                        const lat = parseFloat(item.latitude);
                        const lng = parseFloat(item.longitude);
                        return !isNaN(lat) && !isNaN(lng);
                    })
                    .map(item => {
                        const parts = [item.building, item.street, item.boro, item.zipcode ? `NY ${item.zipcode}` : null];
                        const address = parts.filter(Boolean).join(', ');
                        return {
                            id: item.camis,
                            name: item.name?.trim() || "Unknown Restaurant",
                            address,
                            latitude: parseFloat(item.latitude),
                            longitude: parseFloat(item.longitude),
                            boro: item.boro?.trim() || "",
                            cuisine: item.cuisine?.trim() || "",
                            phone: item.phone?.trim() || "",
                            grade: item.grade?.trim() || "",
                            inspection_date: item.inspection_date || null,
                        };
                    });

                setState({ restaurants, loading: false, error: null });
            } catch (err) {
                console.error("Failed to load restaurants:", err);
                setState({
                    restaurants: [],
                    loading: false,
                    error: err.message || "Failed to fetch restaurant data"
                });
            }
        };

        fetchRestaurants();
    }, []);

    return state;
};