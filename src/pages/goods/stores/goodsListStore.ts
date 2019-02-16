import { action, observable, computed } from 'mobx';
import { mStore } from '../../../mobx/store';
import { getGoodsList } from '../../../mockData/apis';

interface IGoods {
  id: number;
  name: string;
}

@mStore
export default class GoodsListStore {
  @observable
  goodsList: IGoods[] = [];

  async getGoodsList() {
    let data: IGoods[] = await getGoodsList();
    this.setGoodsList(data);
  }

  @action
  setGoodsList(goodsList: IGoods[]) {
    this.goodsList = goodsList;
  }
}
