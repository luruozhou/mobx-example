import { mAction } from '../../../mobx/action';
import { IRootAction, IRootStore } from '../../../typings';

@mAction
export default class GoodsListAction {
  constructor(
    public stores: IRootStore['goods'],
    public actions: IRootAction['goods']
  ) {}

  async setCurrentGoods(goods) {
    this.stores.goodsDetailStore.setLoading(true);
    await this.stores.goodsDetailStore.getCurrentGoodsDetail(goods.id);
    this.stores.goodsDetailStore.setLoading(false);
  }
}
