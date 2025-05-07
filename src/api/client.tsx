import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const apiClient = axios.create({
    baseURL: 'https://<your-api-domain>'
});

// Store for the refresh token promise to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if this was a protected route (has Authorization header)
        const hasAuthHeader = !!originalRequest.headers['Authorization'];
        
        // Only handle 401s for protected routes
        if (!hasAuthHeader || error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            // If refresh is in progress, queue this request
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return apiClient(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            console.log('-> -> ->  -> -> -> Refreshing token <- <- <- <- <- <-')

            // Get stored tokens and deviceId
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const deviceId = await AsyncStorage.getItem('deviceId');
            
            if (!refreshToken || !deviceId) {
                // Clear any remaining tokens
                await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
                
                console.log('-> -> ->  -> -> -> Navigating to Login <- <- <- <- <- <-')
                // Navigate to Login
                // @ts-ignore
                if (global.navigation) {
                    console.log('-> -> ->  -> -> -> Navigating to Login Possible <- <- <- <- <- <-')
                    // @ts-ignore
                    global.navigation.navigate('Login');
                }
                
                throw new Error('No refresh token or device ID found');
            }

            // Call refresh token endpoint directly
            const response = await axios.post(
                `${apiClient.defaults.baseURL}/users/refresh-token/`,
                { 
                    refresh: refreshToken,
                    deviceId 
                }
            );

            if (response.status === 200) {
                const { accessToken, refreshToken: newRefreshToken, userName } = response.data;
                
                // Store new tokens
                await AsyncStorage.setItem('accessToken', accessToken);
                await AsyncStorage.setItem('refreshToken', newRefreshToken);
                
                // Update authorization header
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Process queued requests
                processQueue(null, accessToken);
                
                // Retry the original request
                return apiClient(originalRequest);
            }
        } catch (refreshError) {
            processQueue(refreshError, null);
            // Clear stored tokens on refresh failure
            await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
            console.log('-> -> ->  -> -> -> Navigating to Login <- <- <- <- <- <-')
            // Navigate to Login
            // @ts-ignore
            if (global.navigation) {
                console.log('-> -> ->  -> -> -> Navigating to Login Possible <- <- <- <- <- <-')
                // @ts-ignore
                global.navigation.navigate('Login');
            }
            
            throw refreshError;
        } finally {
            isRefreshing = false;
        }

        return Promise.reject(error);
    }
);

// Add request interceptor to automatically add Authorization header
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);