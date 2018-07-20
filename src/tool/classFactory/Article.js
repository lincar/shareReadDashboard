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
    return Axios({
      url: `/api/admin/article`,
      method: 'post',
      data: {
        title: this.title,
        type: this.type,
        introduction: this.introduction,
        url: this.url,
        points: this.points,
        imgUrl: this.imgUrl,
        classify: {
          id: this.classify.id
        }
      }
    }).then(
      res => Promise.resolve(res),
      err => Promise.reject(err)
    );
  }

  edit() {
    return Axios({
      url: `/api/admin/article/${this.id}`,
      method: 'put',
      data: {
        title: this.title,
        type: this.type,
        introduction: this.introduction,
        url: this.url,
        points: this.points,
        imgUrl: this.imgUrl,
        classify: {
          id: this.classify.id
        }
      }
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

  getList() {
    return Axios({
      url: `/api/admin/article`,
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
