import { action, observable, computed } from 'mobx';
import { mStore } from '../../../mobx/store';
import { getGoodsDetail } from '../../../mockData/apis';

interface IGoodsDetail {
  id: number;
  name: string;
  desc: string;
  img: string;
}

@mStore
export default class GoodsDetailStore {
  @observable
  currentGoods: IGoodsDetail = null;
  @observable
  loading: boolean = false;

  async getCurrentGoodsDetail(id: number) {
    let data: IGoodsDetail = await getGoodsDetail(id);
    this.setCurrentGoodsDetail(data);
  }

  @action
  setCurrentGoodsDetail(currentGoods: IGoodsDetail) {
    this.currentGoods = currentGoods;
  }

  @action
  setLoading(loading: boolean) {
    this.loading = loading;
  }
}
