import { Api } from "@jellyfin/sdk";
import {
  BaseItemDto,
  UserItemDataDto,
} from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import {
  UserLibraryApi,
  UserLibraryApiGetItemRequest,
} from "@jellyfin/sdk/lib/generated-client/api";
import { ApiResult } from "./types";
import { getUserLibraryApi } from "@jellyfin/sdk/lib/utils/api/user-library-api";
import { getVideosApi } from "@jellyfin/sdk/lib/utils/api/videos-api";

export const fetchMovies = async (
  api: Api,
  limit: number = 10
): Promise<ApiResult<BaseItemDto[]>> => {
  try {
    const itemsApi = getItemsApi(api);
    const response = await itemsApi.getItems({
      recursive: true,
      includeItemTypes: ["Movie"],
      limit: limit,
    });
    if (response.data.Items) {
      return { success: true, data: response.data.Items };
    } else {
      return {
        success: false,
        error: "No items found",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { success: false, error: "Error fetching movies", status: 500 };
  }
};

export const fetchTvShows = async (
  api: Api,
  limit: number = 10
): Promise<ApiResult<BaseItemDto[]>> => {
  try {
    const itemsApi = getItemsApi(api);
    const response = await itemsApi.getItems({
      recursive: true,
      includeItemTypes: ["Series"],
      limit: limit,
      fields: ["PrimaryImageAspectRatio", "Genres", "SeasonUserData"],
    });
    if (response.data.Items) {
      return { success: true, data: response.data.Items };
    } else {
      return {
        success: false,
        error: "No items found",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching TV shows:", error);
    return { success: false, error: "Error fetching TV shows", status: 500 };
  }
};

export const fetchRecentItems = async (
  api: Api,
  limit: number = 10
): Promise<ApiResult<BaseItemDto[]>> => {
  try {
    const itemsApi = getItemsApi(api);
    const response = await itemsApi.getItems({
      recursive: true,
      includeItemTypes: ["Movie", "Series"],
      sortBy: ["DateCreated"],
      sortOrder: ["Descending"],
      limit: limit,
    });
    if (response.data.Items) {
      return { success: true, data: response.data.Items };
    } else {
      return {
        success: false,
        error: "No items found",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching recent items:", error);
    return {
      success: false,
      error: "Error fetching recent items",
      status: 500,
    };
  }
};

export const fetchResumeItems = async (
  api: Api,
  limit: number = 10
): Promise<ApiResult<BaseItemDto[]>> => {
  try {
    const itemsApi = getItemsApi(api);
    const response = await itemsApi.getItems({
      recursive: true,
      includeItemTypes: ["Movie", "Series"],
      filters: ["IsResumable"],
      limit: limit,
    });
    if (response.data.Items) {
      return { success: true, data: response.data.Items };
    } else {
      return {
        success: false,
        error: "No items found",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching resume items:", error);
    return {
      success: false,
      error: "Error fetching resume items",
      status: 500,
    };
  }
};

export const getDetails = async (
  api: Api,
  itemId: string,
  userId: string
): Promise<ApiResult<BaseItemDto>> => {
  try {
    const userLibraryApi = getUserLibraryApi(api);
    const response = await userLibraryApi.getItem({
      itemId: itemId,
      userId: userId,
    });
    if (response.data) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: "No item found",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    return {
      success: false,
      error: "Error fetching item details",
      status: 500,
    };
  }
};

export const getVideoStream = async (
  api: Api,
  itemId: string,
): Promise<ApiResult<File>> => {
  try {
    const videosApi = getVideosApi(api);
    const response = await videosApi.getVideoStream({
      itemId: itemId,
    });
    if (response.data) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: "No video stream found",
        status: response.status,
      };
    }
  } catch (error) {
    console.error("Error fetching video stream:", error);
    return {
      success: false,
      error: "Error fetching video stream",
      status: 500,
    };
  }
};
