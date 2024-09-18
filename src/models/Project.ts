import { v4 as uuidv4 } from 'uuid';

export class Project {
  public id: string;
  public name: string;
  public customer: string;
  public startDate: Date;
  public finalDate: Date;
  public coverImage?: File | null;
  public isFavorite?: boolean;
  
  constructor(name: string, customer: string, startDate: Date, finalDate: Date, coverImage?: File | null) {
    this.id = uuidv4();
    this.name = name;
    this.customer = customer;
    this.startDate = startDate;
    this.finalDate = finalDate;
    this.coverImage = coverImage;
  }

  // // Exemplo de método de regra de negócio
  // isValid(): boolean {
  //   return this.name.trim() !== '' && this.customer.trim() !== '';
  // }

  // // Outros métodos relacionados ao projeto
}