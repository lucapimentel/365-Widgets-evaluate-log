import { evaluateLogFile } from './evaluateLogFile';

describe('evaluateLogFile', () => {
    it('correctly evaluates log file', () => {
        const logContentsStr = [
            'reference 70.0 45.0 6',
            'thermometer temp-1',
            '2022-01-01T12:00 72.4',
            '2022-01-01T12:01 76.0',
            'humidity hum-1',
            '2022-01-01T12:00 45.2',
            'monoxide mon-1',
            '2022-01-01T12:00 5',
        ];

        const result = evaluateLogFile(logContentsStr);

        expect(result['temp-1']).toBe('precise');
        expect(result['hum-1']).toBe('keep');
        expect(result['mon-1']).toBe('keep');
    });

    it('handles different types of sensors correctly', () => {
        const logContentsStr = [
            'reference 70.0 45.0 6',
            'thermometer temp-2',
            '2022-01-01T12:00 69.5',
            '2022-01-01T12:01 70.1',
            'humidity hum-2',
            '2022-01-01T12:00 44.4',
            'monoxide mon-2',
            '2022-01-01T12:00 2',
        ];

        const result = evaluateLogFile(logContentsStr);

        expect(result['temp-2']).toBe('ultra precise');
        expect(result['hum-2']).toBe('keep');
        expect(result['mon-2']).toBe('discard');
    });
});