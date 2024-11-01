import { Dispatch, SetStateAction } from "react";
import isEqual from "lodash.isequal";

/**
 * Updates state only if data has changed.
 *
 * @param data - The new data to compare with the previous state.
 * @param setState - The state setter function to update the state if data has changed.
 * @returns The updated data if changed, otherwise the previous data.
 */
export function updateStateIfChanged<T>(
  data: T,
  setState: Dispatch<SetStateAction<T>>
): T {
  setState((prevData) => {
    if (!isEqual(prevData, data)) {
      return data;
    }
    return prevData;
  });

  return data;
}
