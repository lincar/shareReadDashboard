import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Lottery {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    let data = {
      name: this.name,
      chance: this.chance / 100,
      seq: this.seq,
      type: this.type
    };
    if (data.type === 1) {
      data.point = null;
      data.rechargeProductId = null;
    }
    if (data.type === 2) {
      data.point = this.point;
      data.rechargeProductId = null;
    }
    if (data.type === 3) {
      data.point = null;
      data.rechargeProductId = this.rechargeProductId;
    }
    return Axios({
      url: `/api/admin/lottery/product`,
      method: 'post',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    let data = {
      name: this.name,
      chance: this.chance / 100,
      seq: this.seq,
      type: this.type
    };
    if (data.type === 1) {
      data.point = null;
      data.rechargeProductId = null;
    }
    if (data.type === 2) {
      data.point = this.point;
      data.rechargeProductId = null;
    }
    if (data.type === 3) {
      data.point = null;
      data.rechargeProductId = this.rechargeProductId;
    }
    return Axios({
      url: `/api/admin/lottery/product/${this.id}`,
      method: 'put',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/lottery/product/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList() {
    return Axios({
      url: `/api/admin/lottery/product`,
      method: 'get'
    }).then(
      res => {
        res.data.data = res.data.data || [];
        let list = res.data.data;
        list.map(item => {
          item.createdAt = dateFormat(item.createdAt);
        });
        return Promise.resolve(res);
      },
      err => Promise.reject(err)
    );
  }
}
