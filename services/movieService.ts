import { Api } from "@jellyfin/sdk";
import { BaseItemDto } from "@jellyfin/sdk/lib/generated-client/models";
import { getItemsApi } from "@jellyfin/sdk/lib/utils/api/items-api";
import { ApiResult } from "./types";

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
