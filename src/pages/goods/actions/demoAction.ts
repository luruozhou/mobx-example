import { mAction } from '../../../mobx/action';
import { IRootStore, IRootAction } from '../../../typings/index';

@mAction
export default class DemoAction {
  constructor(
    public stores: IRootStore['goods'],
    public actions: IRootAction['goods']
  ) {}

  async init() {
    await this.stores.goodsListStore.getGoodsList();
    let firstGoods =
      this.stores.goodsListStore.goodsList &&
      this.stores.goodsListStore.goodsList[0];
    if (firstGoods) {
      this.stores.goodsDetailStore.setLoading(true);
      await this.stores.goodsDetailStore.getCurrentGoodsDetail(firstGoods.id);
      this.stores.goodsDetailStore.setLoading(false);
    }
  }
}
