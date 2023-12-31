import "reflect-metadata";
const loggedParamMetadataKey = Symbol("loggedParam");
import { performance } from "perf_hooks";
import { WithPerfData, hasPerfData } from "./utils";

/**
 *
 * Save the index of the decorated parameter (parameterIndex) as metadata of the current class (target) and method (propertyKey)
 */
export function logParam(
  target: NonNullable<unknown>,
  propertyKey: string | symbol,
  parameterIndex: number
) {
  // get existing method decorated params's indices
  const existingRequiredParameters: number[] =
    Reflect.getOwnMetadata(loggedParamMetadataKey, target, propertyKey) || [];
  // add current param index to existing
  existingRequiredParameters.push(parameterIndex);
  // save indices as metadata of the method
  Reflect.defineMetadata(
    loggedParamMetadataKey,
    existingRequiredParameters,
    target,
    propertyKey
  );
}

export function perf(
  target: NonNullable<unknown>,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value!;
  descriptor.value = async function (...args: unknown[]) {
    const requiredParamsIndices: number[] =
      Reflect.getOwnMetadata(loggedParamMetadataKey, target, propertyKey) || [];
    const loggedParamsValues = requiredParamsIndices.map(
      (parameterIndex) => args[parameterIndex]
    );
    const start = performance.now();
    const output = await originalMethod.apply(this, args);
    const end = performance.now();
    const execTime = end - start;
    if (hasPerfData(this)) {
      this.__perfData.push({
        method: propertyKey,
        time: execTime,
        loggedParametersValues: loggedParamsValues,
      });
    } else {
      console.log(execTime);
    }
    return output;
  };
}

export function logPerf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends { new (...args: any[]): NonNullable<unknown> },
>(constructor: T) {
  return class extends constructor implements WithPerfData {
    __perfData = [];
    logPref = () => {
      console.log("pref report:", JSON.stringify(this.__perfData));
    };
  };
}

export function Prop(target: unknown, propertyName: string) {
  let value: unknown;

  Object.defineProperty(target, propertyName, {
    set(newVal: unknown) {
      console.log(`setting ${propertyName} value to '${newVal}'`);
      value = newVal;
    },
    get() {
      console.log(`getting ${propertyName} value...`);
      return value;
    },
  });
}
