import { v4 as uuidv4 } from 'uuid';

export class Project {
  public id: string;
  public name: string;
  public customer: string;
  public startDate: Date;
  public finalDate: Date;
  public coverImage?: {
    url: string;
    name: string;
  };
  public isFavorite?: boolean;
  
  constructor(name: string, customer: string, startDate: Date, finalDate: Date, coverImage?: {
    url: string;
    name: string;
  }, id?: string) {
    this.id = id || uuidv4();
    this.isFavorite = false;
    this.name = name;
    this.customer = customer;
    this.startDate = startDate;
    this.finalDate = finalDate;
    this.coverImage = coverImage;
  }
}