import { State } from '../../orm/entities/states/State';

export class UpdateStateDTO {
  id: number;
  name: string;

  constructor(state: State) {
    this.id = state.id;
    this.name = state.name;
  }
}
