import {
    Sensor,
    SensorType,
    SensorData,
    Status,
    SensorReferencePosition,
    EvaluateConfig
} from '../types';

export function calculateDeviationAndMean(data: SensorData[]): {
    mean: number,
    deviation: number,
} {
    const mean = data.reduce((sum, r) => sum + r.value, 0) / data.length;
    const deviation = Math.sqrt(
        data.reduce((sum, r) => sum + Math.pow(r.value - mean, 2), 0) / data.length
    );

    return {
        mean,
        deviation
    }
}

export const EVALUATE_CONFIG: EvaluateConfig = {
    thermometer: (mean: number, deviation: number, referenceValue: number) => {
        const meanDiff = Math.abs(mean - referenceValue);

        if (meanDiff <= 0.5 && deviation < 3) {
            return Status.ULTRA_PRECISE;
        } else if (meanDiff <= 0.5 && deviation < 5) {
            return Status.VERY_PRECISE;
        } else {
            return Status.PRECISE;
        }
    },
    humidity: (readingRefValue: number, referenceValue: number, sensorData: SensorData[]) => {
        const isInRange = sensorData.every((sensor) => {
            return Math.abs(sensor.value - referenceValue) <= readingRefValue
        })

        return !isInRange ? Status.DISCARD : Status.KEEP;
    },
    monoxide: (readingRefValue: number, referenceValue: number, sensorData: SensorData[]) => {
        const isInRange = sensorData.every((sensor) => {
            return Math.abs(sensor.value - referenceValue) <= readingRefValue
        })

        return !isInRange ? Status.DISCARD : Status.KEEP;
    }
}

export function mapLogFileToSensorMetric(logContentsStr: string[]): Sensor[] {
    const referenceValues: Record<SensorType, number> = {} as Record<SensorType, number>;
    let currentSensorName = '';

    const mappedData = logContentsStr.reduce<Sensor[]>((acc, line) => {
        const baseSensor: Sensor = {} as Sensor;
        const [type, ...values] = line.split(' ');
        if (type === 'reference') {
            referenceValues.thermometer = parseFloat(values[SensorReferencePosition.thermometer]);
            referenceValues.humidity = parseFloat(values[SensorReferencePosition.humidity]);
            referenceValues.monoxide = parseInt(values[SensorReferencePosition.monoxide]);
        } else if (type.includes('T')) {
            const [date, time] = type.split('T');
            const currentValue = parseFloat(values[0]);

            const currentSensor = acc.find((sensorData) => sensorData.name === currentSensorName);

            currentSensor && currentSensor.data.push({
                date,
                time,
                value: currentValue,
            })
        } else {
            const currentSensorType = type as SensorType;
            currentSensorName = values[0];
            baseSensor.type = currentSensorType;
            baseSensor.name = currentSensorName;
            baseSensor.referenceValue = referenceValues[currentSensorType];
            baseSensor.data = [];
            baseSensor.evaluate = EVALUATE_CONFIG[currentSensorType];

            acc.push(baseSensor);
        }

        return acc;
    }, []);

    return mappedData;
}