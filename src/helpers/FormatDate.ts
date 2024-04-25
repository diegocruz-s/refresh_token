import { IFormateDate } from "../useCases/globalInterfaces";

export class FormatDate implements IFormateDate {
  async execute(date: Date, timeToIncrease: string = '7d'): Promise<Date> {    
    const regex = /^(\d+)([smhd])$/;
    if(!regex.test(timeToIncrease)) timeToIncrease = '7d';

    const match = timeToIncrease.match(regex);
    if(!match) throw new Error('Format time increase invalid!');

    let multiplier = 0;

    switch (match[2]) {
        case 's':
            multiplier = 1000;
            break;
        case 'm':
            multiplier = 1000 * 60;
            break;
        case 'h':
            multiplier = 1000 * 60 * 60;
            break;
        case 'd':
            multiplier = 1000 * 60 * 60 * 24;
            break;
        default:
            break;
    }

    const amountToIncrease = parseInt(match[1]) * multiplier;

    const increasedDate = new Date(date.getTime() + amountToIncrease);

    return increasedDate;
  };
};
