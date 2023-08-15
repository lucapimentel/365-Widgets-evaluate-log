import { calculateDeviationAndMean, mapLogFileToSensorMetric } from "./Utils/util";
import { Humidity, Monoxide, Status, Thermometer } from "./types";

export function evaluateLogFile(logContentsStr: string[]): Record<string, string> {
    const mappedData = mapLogFileToSensorMetric(logContentsStr);

    return mappedData.reduce<Record<string, Status>>((acc, sensor) => {

        if (sensor.type === 'humidity' || sensor.type === 'monoxide') {
            const readingRefValue = sensor.type === 'humidity' ? 1 : 3;
            const status = (sensor as Humidity | Monoxide).evaluate(readingRefValue, sensor.referenceValue, sensor.data)
            acc[sensor.name] = status;
        }

        if (sensor.type === 'thermometer') {
            const { mean, deviation } = calculateDeviationAndMean(sensor.data);
            acc[sensor.name] = (sensor as Thermometer).evaluate(mean, deviation, sensor.referenceValue)
        }
        return acc;
    }, {});
}