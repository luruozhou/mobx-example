import { mAction } from '../../../mobx/action';
import { IRootAction, IRootStore } from '../../../typings';

@mAction
export default class AComponentAction {
  constructor(
    public stores: IRootStore['AComponent'],
    public actions: IRootStore['AComponent']
  ) {}
}
