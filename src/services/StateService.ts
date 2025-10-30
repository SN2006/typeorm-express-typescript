import { getRepository, Repository } from 'typeorm';

import { State } from '../orm/entities/states/State';
import { CustomError } from '../utils/response/custom-error/CustomError';

class StateService {
  private stateRepository: Repository<State> = getRepository(State);

  async createState(name: string, userId: number): Promise<State> {
    try {
      const state = new State();
      state.name = name;
      state.userId = userId;

      return await this.stateRepository.save(state);
    } catch (err) {
      throw new CustomError(400, 'Raw', `State can't be created.`, null, err);
    }
  }

  async getAllStates(): Promise<State[]> {
    try {
      const states = await this.stateRepository.find({
        relations: ['user'],
        select: ['id', 'name', 'created_at', 'updated_at'],
      });
      return states;
    } catch (err) {
      throw new CustomError(400, 'Raw', `Can't retrieve list of states.`, null, err);
    }
  }

  async getMyStates(userId: number): Promise<State[]> {
    try {
      const states = await this.stateRepository.find({
        where: { userId },
        relations: ['user'],
        select: ['id', 'name', 'created_at', 'updated_at'],
      });
      return states;
    } catch (err) {
      throw new CustomError(400, 'Raw', `Can't retrieve list of states.`, null, err);
    }
  }

  async getStateById(id: string | number): Promise<State | null> {
    try {
      const state = await this.stateRepository.findOne(id, {
        relations: ['user'],
        select: ['id', 'name', 'created_at', 'updated_at'],
      });

      if (!state) {
        throw new CustomError(404, 'General', `State with id:${id} not found.`, ['State not found.']);
      }

      return state;
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async updateState(id: string | number, name: string, currentUserId: number): Promise<State> {
    try {
      const state = await this.stateRepository.findOne({ where: { id } });

      if (!state) {
        throw new CustomError(404, 'General', `State with id:${id} not found.`, ['State not found.']);
      }

      if (state.userId !== currentUserId) {
        throw new CustomError(403, 'General', 'Access denied', ['You can only edit your own states.']);
      }

      if (name) {
        state.name = name;
      }

      try {
        return await this.stateRepository.save(state);
      } catch (err) {
        throw new CustomError(409, 'Raw', `State can't be updated.`, null, err);
      }
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }

  async deleteState(id: string | number, currentUserId: number): Promise<{ id: number; name: string }> {
    try {
      const state = await this.stateRepository.findOne({ where: { id } });

      if (!state) {
        throw new CustomError(404, 'General', 'Not Found', [`State with id:${id} doesn't exist.`]);
      }

      if (state.userId !== currentUserId) {
        throw new CustomError(403, 'General', 'Access denied', ['You can only delete your own states.']);
      }

      await this.stateRepository.delete(id);

      return { id: state.id, name: state.name };
    } catch (err) {
      if (err instanceof CustomError) {
        throw err;
      }
      throw new CustomError(400, 'Raw', 'Error', null, err);
    }
  }
}

export default StateService;
