import { CoreEntity } from '@grandlinex/kernel';

export default class ExampleEntity extends CoreEntity {
  title: string;

  age?: number;

  description?: string;

  constructor(title: string, age?: number, description?: string) {
    super(0);
    this.title = title;
    this.age = age;
    this.description = description;
  }
}
