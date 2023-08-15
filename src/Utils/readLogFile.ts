import { promises as fsPromises } from 'fs';
import { join } from 'path';
export default async function readLogFile(): Promise<string[]> {
    try {
        const contents = await fsPromises.readFile(
            join(__dirname, './example.txt'),
            'utf-8',
        );

        const lines = contents.split(/\r?\n/);

        return lines.filter((line) => line !== '');
    } catch (err) {
        console.error(err)
        throw new Error('Error while reading file')
    }
}