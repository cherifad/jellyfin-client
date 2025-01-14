import { Api } from "@jellyfin/sdk";
import {
  BaseItemDto,
  BaseItemDtoQueryResult,
} from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { getTvShowsApi } from "@jellyfin/sdk/lib/utils/api/tv-shows-api";
import { ApiResult } from "./types";
import { TvShowsApiGetSeasonsRequest } from "@jellyfin/sdk/lib/generated-client/api/tv-shows-api";

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

export const getSeasons = async (
  api: Api,
  tvId: string,
  userId: string
): Promise<ApiResult<BaseItemDto[]>> => {
  try {
    const tvShowsApi = getTvShowsApi(api);
    const response = await tvShowsApi.getSeasons({
      seriesId: tvId,
      userId: userId,
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
