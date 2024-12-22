import { Api, Jellyfin } from '@jellyfin/sdk';
import { getUserApi } from '@jellyfin/sdk/lib/utils/api/user-api';
import { UserDto } from '@jellyfin/sdk/lib/generated-client/models';

let jellyfin: Jellyfin | null = null;

export const initializeJellyfin = (serverUrl: string) => {
    if (!jellyfin) {
        jellyfin = new Jellyfin({
            clientInfo: {
                name: 'Jellyfin Next.js Client',
                version: '1.0.0',
            },
            deviceInfo: {
                name: 'Next.js Client',
                id: 'unique-device-id', // Generate this dynamically per user/device
            },
        });

        const api = jellyfin.createApi(serverUrl);
        return api;
    }

    throw new Error('Jellyfin instance already initialized.');
};

export const getJellyfinApi = () => {
    if (!jellyfin) {
        throw new Error('Jellyfin is not initialized. Call initializeJellyfin first.');
    }

    return jellyfin;
};

export const connectToJellyfin = async (serverUrl: string, username: string, password: string) => {
    const jellyfin = new Jellyfin({
        clientInfo: {
            name: 'My Jellyfin App',
            version: '1.0.0',
        },
        deviceInfo: {
            name: 'My Device',
            id: 'unique-device-id',
        },
    });

    // Connect to the server and authenticate the user
    const api = jellyfin.createApi(serverUrl);
    const authResponse = await api.authenticateUserByName(username, password);

    // Save the token and serverUrl to localStorage
    if (authResponse.data.AccessToken) {
        localStorage.setItem('authToken', authResponse.data.AccessToken);
    } else {
        throw new Error('Authentication token is undefined.');
    }
    localStorage.setItem('serverUrl', serverUrl);

    return api; // Return the authenticated API instance
};

// Function to restore a session using the saved token
export const restoreJellyfinSession = async () => {
    const serverUrl = localStorage.getItem('serverUrl');
    const authToken = localStorage.getItem('authToken');

    if (serverUrl && authToken) {
        const jellyfin = new Jellyfin({
            clientInfo: {
                name: 'My Jellyfin App',
                version: '1.0.0',
            },
            deviceInfo: {
                name: 'My Device',
                id: 'unique-device-id',
            },
        });

        const api = jellyfin.createApi(serverUrl);

        // Set the token manually for the API instance
        api.accessToken = authToken;

        return api;
    }

    return null; // Return null if no valid session exists
};

export const getConnectedUser = async (api: Api): Promise<UserDto | null> => {
    try {
        const userApi = getUserApi(api);  // Get the User API instance
        const response = await userApi.getCurrentUser();  // Get current user data
        return response.data || null;  // Return the user data or null if not found
    } catch (error) {
        console.error('Error fetching the connected user:', error);
        return null;  // Return null in case of an error
    }
};