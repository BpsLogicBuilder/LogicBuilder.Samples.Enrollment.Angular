import { Service } from '@angular/core';

@Service()
export class DateService {

    constructor() { }

    convertToDate(e: any): Date | undefined | null {
        if (!e)
            return null;
            
        const parts = e.split('-');

        if (parts.length > 2 && !Number.isNaN(Number.parseInt(parts[0])) && !Number.isNaN(Number.parseInt(parts[1])) && !Number.isNaN(Number.parseInt(parts[2]))) {
            let year = Number.parseInt(parts[0]);
            let month = Number.parseInt(parts[1]);
            let day = Number.parseInt(parts[2]);

            return new Date(year, month - 1, day);
        }

        return null;
    }
}
