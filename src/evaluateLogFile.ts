import { calculateDeviationAndMean, mapLogFileToSensorMetric } from "./Utils/util";
import { Humidity, Monoxide, Status, Thermometer } from "./types";


/**
 * Evaluates sensor data from a log file and generates device classifications.
 * @param {string[]} logContentsStr - Array of log file contents.
 * @returns {Record<string, string>} - return object that container a string key for the sensor name and string value for the evaluation.
 */
export function evaluateLogFile(logContentsStr: string[]): Record<string, string> {
    // Step 1: Map the log file contents to sensor data objects.
    const mappedData = mapLogFileToSensorMetric(logContentsStr);
    // Step 2: Reduce the mapped data to generate the output.
    return mappedData.reduce<Record<string, Status>>((acc, sensor) => {
        // For humidity and monoxide sensors, evaluate and classify based on specified range.
        if (sensor.type === 'humidity' || sensor.type === 'monoxide') {
            const readingRefValue = sensor.type === 'humidity' ? 1 : 3;
            const status = (sensor as Humidity | Monoxide).evaluate(readingRefValue, sensor.referenceValue, sensor.data)
            acc[sensor.name] = status;
        }
        // For thermometers, calculate mean and deviation, then classify accordingly.
        if (sensor.type === 'thermometer') {
            const { mean, deviation } = calculateDeviationAndMean(sensor.data);
            acc[sensor.name] = (sensor as Thermometer).evaluate(mean, deviation, sensor.referenceValue)
        }
        return acc;
    }, {});
}