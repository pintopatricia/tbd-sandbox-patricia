import { createThrottlesBuilder } from "../../view-model-factories/connected-throttles";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("../../view-model-factories/connected-throttles", () => ({
  createThrottlesBuilder: jest.fn().mockReturnValue(jest.fn()),
}));

describe("Throttles makeMapStateToProps", () => {
  it("should call createThrottlesBuilder", () => {
    makeMapStateToProps()({ entities: { throttles: {} } });

    expect(createThrottlesBuilder).toHaveBeenCalled();
  });

  it("should call buildThrottles with throttles state", () => {
    const buildThrottlesSpy = jest.fn();

    createThrottlesBuilder.mockReturnValue(buildThrottlesSpy);
    makeMapStateToProps()({ entities: { throttles: {} } });

    expect(buildThrottlesSpy).toHaveBeenCalledWith({});
  });

  it("should return the built throttles", () => {
    createThrottlesBuilder.mockReturnValue(jest.fn().mockReturnValue(["THROTTLES"]));
    const props = makeMapStateToProps()({ entities: { throttles: {} } });

    expect(props.throttles).toEqual(["THROTTLES"]);
  });
});
