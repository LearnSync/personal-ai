import { updateStateIfChanged } from "@/lib/isEqual";

describe("updateStateIfChanged", () => {
  it("should update state when data changes", () => {
    const mockSetState = jest.fn();
    const prevData = { key: "oldValue" };
    const newData = { key: "newValue" };

    updateStateIfChanged(newData, mockSetState);

    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the state update callback with previous data
    const callback = mockSetState.mock.calls[0][0];
    const result = callback(prevData);

    expect(result).toEqual(newData);
  });

  it("should not update state when data is the same", () => {
    const mockSetState = jest.fn();
    const prevData = { key: "sameValue" };
    const sameData = { key: "sameValue" };

    updateStateIfChanged(sameData, mockSetState);

    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the state update callback with previous data
    const callback = mockSetState.mock.calls[0][0];
    const result = callback(prevData);

    expect(result).toEqual(prevData);
  });

  it("should handle nested object changes correctly", () => {
    const mockSetState = jest.fn();
    const prevData = { key: "value", nested: { subKey: "subValue" } };
    const newData = { key: "value", nested: { subKey: "newSubValue" } };

    updateStateIfChanged(newData, mockSetState);

    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the state update callback with previous data
    const callback = mockSetState.mock.calls[0][0];
    const result = callback(prevData);

    expect(result).toEqual(newData);
  });

  it("should handle array changes correctly", () => {
    const mockSetState = jest.fn();
    const prevData = [1, 2, 3];
    const newData = [1, 2, 4];

    updateStateIfChanged(newData, mockSetState);

    expect(mockSetState).toHaveBeenCalledTimes(1);
    expect(mockSetState).toHaveBeenCalledWith(expect.any(Function));

    // Simulate the state update callback with previous data
    const callback = mockSetState.mock.calls[0][0];
    const result = callback(prevData);

    expect(result).toEqual(newData);
  });

  it("should return updated data if data changes, otherwise previous data", () => {
    const mockSetState = jest.fn();
    const prevData = { key: "oldValue" };
    const newData = { key: "newValue" };

    // Mock setState function to return data directly
    const result = updateStateIfChanged(newData, mockSetState);

    expect(result).toEqual(newData);
  });
});
