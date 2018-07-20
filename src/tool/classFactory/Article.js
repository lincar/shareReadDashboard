import Axios from '@/tool/axios.js';
import {dateFormat} from '@/tool/transform.js';

export default class Article {
  constructor(options) {
    options = options || {};
    for (let attr in options) {
      this[attr] = options[attr];
    }
  }

  add() {
    let data = {
      title: this.title,
      type: this.type,
      introduction: this.introduction,
      url: this.url,
      points: this.points,
      imgUrl: this.imgUrl
    };

    if (data.type === 1) {
      data.classify = {
        id: this.classify.id
      }
    }

    return Axios({
      url: `/api/admin/article`,
      method: 'post',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    let data = {
      title: this.title,
      type: this.type,
      introduction: this.introduction,
      url: this.url,
      points: this.points,
      imgUrl: this.imgUrl
    };

    if (data.type === 1) {
      data.classify = {
        id: this.classify.id
      }
    }

    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'put',
      data
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  delete() {
    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'delete'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getArticle() {
    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'get'
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  getList(search) {
    return Axios({
      url: `/api/admin/article`,
      method: 'get',
      params: search
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
