import { Humidity, Thermometer } from '../types';
import { calculateDeviationAndMean, mapLogFileToSensorMetric } from './util';

describe('calculateDeviationAndMean', () => {
    it('calculates mean and deviation correctly', () => {
        const data = [
            { date: '2022-01-01', time: '12:00', value: 70 },
            { date: '2022-01-01', time: '12:01', value: 72 },
            { date: '2022-01-01', time: '12:02', value: 68 },
        ];

        const result = calculateDeviationAndMean(data);

        expect(result.mean).toBeCloseTo(70, 2);
        expect(result.deviation).toBeCloseTo(1.63299, 2);
    });
});

describe('mapLogFileToSensorMetric', () => {
    it('correctly maps log file to sensor data', () => {
        const logContentsStr = [
            'reference 70.0 45.0 6',
            'thermometer temp-1',
            '2022-01-01T12:00 72.4',
            '2022-01-01T12:01 76.0',
            'humidity hum-1',
            '2022-01-01T12:00 45.2',
        ];

        const mappedData = mapLogFileToSensorMetric(logContentsStr);

        expect(mappedData.length).toBe(2);


        const thermometer = mappedData.find(sensor => sensor.type === 'thermometer') as Thermometer;
        expect(thermometer).toBeDefined();
        expect(thermometer?.name).toBe('temp-1');
        expect((thermometer)?.evaluate(72.8, 2.5, thermometer.referenceValue)).toBe('precise');


        const humidity = mappedData.find(sensor => sensor.type === 'humidity') as Humidity;
        expect(humidity?.name).toBe('hum-1');
        expect((humidity)?.evaluate(1, humidity.referenceValue, humidity.data)).toBe('keep');
    });
});