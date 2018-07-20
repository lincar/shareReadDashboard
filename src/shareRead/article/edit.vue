<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">文章编辑</span>
    </header>
    <div>
      <div class="edit-modal-item">
        <span class="plr-sm">封面</span>
        <el-upload
          class="img-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleUploadSuccess">
          <img v-if="article.imgUrl" :src="article.imgUrl" class="upload-img">
          <i v-else class="el-icon-plus img-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="edit-modal-item">
        <span class="plr-sm">标题</span>
        <el-input v-model="article.title" class="w-6"></el-input>
      </div>
      <div class="edit-modal-item">
        <span class="plr-sm">简介</span>
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="article.introduction" class="w-6"></el-input>
      </div>
      <div v-if="article.classify" class="edit-modal-item">
        <span class="plr-sm">分类</span>
        <el-select v-model="article.classify.id" class="w-6">
          <el-option v-for="item in classifyList" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </div>
      <div class="edit-modal-item">
        <span class="plr-sm">积分</span>
        <el-input type="number" v-model="article.points" class="w-6"></el-input>
      </div>
      <div class="edit-modal-item">
        <span class="plr-sm">链接</span>
        <el-input v-model="article.url" class="w-6"></el-input>
      </div>
      <div v-if="article.classify" class="edit-modal-item">
        <span class="plr-sm">类型</span>
        <el-select v-model="article.type" class="w-6">
          <el-option :value="1" label="文章"></el-option>
          <el-option :value="2" label="轮播图"></el-option>
        </el-select>
      </div>
      <div class="w-6 ptb-md text-center">
        <el-button @click="commitArticle()" type="primary">保存</el-button>
      </div>
    </div>
  </section>
</template>

<script>
  import Classify from '@/tool/classFactory/Classify.js';
  import Article from '@/tool/classFactory/Article.js';

  export default {
    name: 'article-edit',
    data() {
      return {
        articleId: null,
        article: {
          classify: {},
          type: 1,
          points: 20
        },
        classifyList: []
      }
    },

    activated() {
      this.articleId && this.clearArticle();
      this.articleId = this.$route.query.id || null;
      this.articleId && this.getArticle();
      this.getClassifyList();
    },

    methods: {
      clearArticle() {
        this.article = {
          classify: {},
          type: 1,
          points: 20
        }
      },

      handleUploadSuccess(res) {
        this.article.imgUrl = res.data;
        this.$forceUpdate();
      },

      commitArticle() {
        const that = this;
        let article = new Article(that.article);
        let thenObj = null;
        if (article.id) {
          thenObj = article.edit();
        } else {
          thenObj = article.add();
        }
        thenObj.then(() => {
          that.$router.push('/article/list');
        });
      },

      getArticle() {
        const that = this;
        let article = new Article({id: that.articleId});
        article.getArticle().then(res => {
          that.article = res.data.data || {};
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
    display: flex;
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

  .upload-img {
    width: 180px;
    height: 136px;
    display: block;
  }
</style>
