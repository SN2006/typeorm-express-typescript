import { State } from '../../orm/entities/states/State';

export class StateDTO {
  id: number;
  name: string;
  owner: object;

  constructor(state: State) {
    this.id = state.id;
    this.name = state.name;
    this.owner = {
      id: state.user.id,
      name: state.user.name,
      email: state.user.email,
    };
  }
}
