import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Jellyfin } from "@jellyfin/sdk";
import { Api } from "@jellyfin/sdk";
import { UserDto } from "@jellyfin/sdk/lib/generated-client/models";

interface JellyfinState {
  api: Api | null;
  serverUrl: string | null;
  authToken: string | null;
  user: UserDto | null;
  connect: (
    serverUrl: string,
    username: string,
    password: string
  ) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => void;
}

export const useJellyfinStore = create<JellyfinState>()(
  persist(
    (set, get) => ({
      api: null,
      serverUrl: null,
      authToken: null,
      user: null,

      // Function to connect to Jellyfin
      connect: async (
        serverUrl: string,
        username: string,
        password: string
      ) => {
        try {
          const jellyfin = new Jellyfin({
            clientInfo: {
              name: "My Jellyfin App",
              version: "1.0.0",
            },
            deviceInfo: {
              name: "Jellyfin Next",
              id: "26209dde-bcba-4d15-8ee5-bc03c2d8702c",
            },
          });

          const api = jellyfin.createApi(serverUrl);
          const authResponse = await api.authenticateUserByName(
            username,
            password
          );

          console.log("Auth response:", authResponse);
          const authToken = authResponse.data.AccessToken;
          
          set({ api, serverUrl, authToken, user: authResponse.data.User });
        } catch (error) {
          console.error("Failed to connect to Jellyfin:", error);
          throw new Error(
            "Authentication failed. Please check your credentials and try again."
          );
        }
      },

      // Function to restore the session on app reload
      restoreSession: async () => {
        const { serverUrl, authToken } = get();

        if (serverUrl && authToken) {
          try {
            const jellyfin = new Jellyfin({
              clientInfo: {
                name: "My Jellyfin App",
                version: "1.0.0",
              },
              deviceInfo: {
                name: "My Device",
                id: "unique-device-id",
              },
            });

            const api = jellyfin.createApi(serverUrl);
            api.accessToken = authToken;

            // Example: Verify token by making a test request

            set({ api });
          } catch (error) {
            console.error("Session restoration failed:", error);
            set({ api: null, serverUrl: null, authToken: null, user: null });
          }
        } else {
          throw new Error("No session to restore");
        }
      },

      logout: () => {
        set({ api: null, serverUrl: null, authToken: null });
        localStorage.removeItem("jellyfin-store");
      },
    }),
    {
      name: "jellyfin-store", // Key for localStorage
      partialize: (state) => ({
        serverUrl: state.serverUrl,
        authToken: state.authToken,
        user: state.user,
      }), // Only persist serverUrl and authToken
    }
  )
);
