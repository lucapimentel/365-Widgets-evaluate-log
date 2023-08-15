
export type SensorData = {
    date: string,
    time: string,
    value: number,
}

export type Sensor = Thermometer | Humidity | Monoxide;

export interface BaseSensor {
    name: string,
    referenceValue: number,
    data: SensorData[],
}

type PrecisionFunction = (mean: number, deviation: number, referenceValue: number) => Status;
type DiscartingFunction = (readingRefValue: number, referenceValue: number, sensorData: SensorData[]) => Status;

export interface Thermometer extends BaseSensor {
    type: 'thermometer'
    evaluate: PrecisionFunction;
}

export interface Humidity extends BaseSensor {
    type: 'humidity'
    evaluate: DiscartingFunction;
}

export interface Monoxide extends BaseSensor {
    type: 'monoxide'
    evaluate: DiscartingFunction;
}

export type EvaluateConfig = Record<SensorType, PrecisionFunction | DiscartingFunction>;

export enum Status {
    ULTRA_PRECISE = 'ultra precise',
    VERY_PRECISE = 'very precise',
    PRECISE = 'precise',
    DISCARD = 'discard',
    KEEP = 'keep',
}

export enum SensorReferencePosition {
    thermometer,
    humidity,
    monoxide,
}

export type SensorType = keyof typeof SensorReferencePosition;
