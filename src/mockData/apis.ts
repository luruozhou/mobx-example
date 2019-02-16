const data = new Array(100).fill(null).map((v, index) => {
  return {
    id: index + 1,
    name: `商品${index + 1}`,
    desc: `这是商品${index + 1}的一行描述`,
    img:
      'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550313171590&di=d510947d9c53bd07bf243816eb3956aa&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201508%2F04%2F20150804221338_AGu3y.jpeg',
  };
});

export async function getGoodsList() {
  await wait(500);
  const list = data.map(r => {
    return {
      id: r.id,
      name: r.name,
    };
  });
  return list;
}

export async function getGoodsDetail(id) {
  await wait(500);
  const item = data.find(r => r.id === id);
  return item;
}

export function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}
