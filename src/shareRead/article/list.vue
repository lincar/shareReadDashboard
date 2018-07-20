<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">文章列表</span>
      <router-link to="/article/edit">
        <el-button class="mlr-sm" size="small" type="primary">添加文章</el-button>
      </router-link>
    </header>
    <my-table :data="articleList" :config="tableConfig">
      <div slot="operating" slot-scope="article">
        <router-link :to="'/article/edit?id=' + article.item.id">
          <el-button size="small" type="success">编辑</el-button>
        </router-link>
        <el-button @click="deleteArticleItem(article.item,article.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>
    <div v-if="articleList.length" class="text-center p-sm">
      <el-pagination
        @current-change="getArticleList"
        :current-page.sync="search.page"
        :page-size="search.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="articleSum">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import Article from '@/tool/classFactory/Article.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "article-list",
    data() {
      return {
        search: {
          page: 1,
          pageSize: 15
        },
        articleList: [],
        articleSum: 0,
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
    },

    methods: {
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

      getArticleList() {
        const that = this;
        Article.prototype.getList(that.search).then(res => {
          let list = res.data.data || [];
          that.articleList.splice(0, that.articleList.length, ...list);
          that.articleSum = res.data.extra.count || 0;
        });
      }
    }
  }
</script>

<style scoped>

</style>
