import { mAction } from '../../../mobx/action';
import { IRootAction, IRootStore } from '../../../typings';

@mAction
export default class GoodsDetailAction {
  constructor(
    public stores: IRootStore['goods'],
    public actions: IRootAction['goods']
  ) {}
}
