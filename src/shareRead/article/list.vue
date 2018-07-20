<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">文章列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">添加文章</el-button>
    </header>
    <my-table :data="articleList" :config="tableConfig">
      <div slot="operating" slot-scope="article">
        <el-button @click="prevShowEditModal(article.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deleteArticleItem(article.item,article.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">封面</span>
          <el-upload
            class="img-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess">
            <img v-if="articleItem.imgUrl" :src="articleItem.imgUrl" class="img">
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">标题</span>
          <el-input v-model="articleItem.title" class="w-10"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">简介</span>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="articleItem.introduction" class="w-10"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">分类</span>
          <el-select v-model="articleItem.classifyId" class="w-10">
            <el-option :value="1" label="话费"></el-option>
            <el-option :value="2" label="流量"></el-option>
          </el-select>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">积分</span>
          <el-input type="number" v-model="articleItem.points" class="w-10"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitArticleItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Article from '@/tool/classFactory/Article.js';
  import Classify from '@/tool/classFactory/Classify.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "article-list",
    data() {
      return {
        showEditModal: false,
        articleItem: {},
        articleList: [],
        classifyList: [],
        tableConfig: [
          {
            label: '封面',
            property: '',
            img: 'imgUrl'
          },
          {
            label: '标题',
            property: 'title'
          },
          {
            label: '简介',
            property: 'introduction'
          },
          {
            label: '分类',
            property: 'classify.name'
          },
          {
            label: '积分',
            property: 'points'
          },
          {
            label: '操作',
            type: 'operating'
          }
        ]
      }
    },

    components: {
      myTable
    },

    activated() {
      this.getArticleList();
      this.getClassifyList();
    },

    methods: {
      handleUploadSuccess(res) {
        this.articleItem.imgUrl = res.data;
      },

      deleteArticleItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let article = new Article(obj);
            article.delete().then(() => {
              that.articleList.splice(index, 1);
            });
          }
        });
      },

      commitArticleItem() {
        const that = this;
        let article = new Article(that.articleItem);
        let thenObj = null;
        if (article.id) {
          thenObj = article.edit();
        } else {
          thenObj = article.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getArticleList();
        });
      },

      prevShowEditModal(obj) {
        this.articleItem = obj || {points: 20};
        this.showEditModal = true;
      },

      filterArticleList(list) {

      },

      getArticleList() {
        const that = this;
        Article.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterArticleList(list);
          that.articleList.splice(0, that.articleList.length, ...list);
        });
      },

      getClassifyList() {
        const that = this;
        Classify.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.classifyList.splice(0, that.classifyList.length, ...list);
        });
      }
    }
  }
</script>

<style scoped>
  .edit-modal-item {
    display: flex;
    align-items: center;
    padding: var(--sm);
  }

  .edit-modal-item span {
    display: inline-block;
    min-width: 6em;
    text-align: right;
  }

  .img-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .img-uploader:hover {
    border-color: #409EFF;
  }

  .img-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 180px;
    line-height: 136px;
    text-align: center;
  }

  .img {
    width: 180px;
    height: 136px;
    display: block;
  }
</style>
