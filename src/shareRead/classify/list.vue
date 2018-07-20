<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">分类列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">添加分类</el-button>
    </header>
    <my-table :data="classifyList" :config="tableConfig">
      <div slot="operating" slot-scope="classify">
        <el-button @click="prevShowEditModal(classify.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deleteClassifyItem(classify.item,classify.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑套餐-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">套餐名称</span>
          <el-upload
            class="img-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleUploadSuccess">
            <img v-if="classifyItem.imgUrl" :src="classifyItem.imgUrl" class="nav-img">
            <i v-else class="el-icon-plus img-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">名称</span>
          <el-input v-model="classifyItem.name" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">排序</span>
          <el-input type="number" v-model="classifyItem.seq" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitClassifyItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Classify from '@/tool/classFactory/Classify.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "classify-list",
    data() {
      return {
        showEditModal: false,
        classifyItem: {},
        classifyList: [],
        tableConfig: [
          {
            label: '图标',
            property: '',
            img: 'imgUrl'
          },
          {
            label: '名称',
            property: 'name'
          },
          {
            label: '排序',
            property: 'seq'
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
      this.getClassifyList();
    },

    methods: {
      handleUploadSuccess(res) {
        this.classifyItem.imgUrl = res.data;
        this.$forceUpdate();
      },

      deleteClassifyItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let classify = new Classify(obj);
            classify.delete().then(() => {
              that.classifyList.splice(index, 1);
            });
          }
        });
      },

      commitClassifyItem() {
        const that = this;
        let classify = new Classify(that.classifyItem);
        let thenObj = null;
        if (classify.id) {
          thenObj = classify.edit();
        } else {
          thenObj = classify.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getClassifyList();
        });
      },

      prevShowEditModal(obj) {
        this.classifyItem = {...obj} || {seq: 1};
        this.showEditModal = true;
      },

      filterClassifyList(list) {
        list.sort((x, y) => {
          return x - y;
        });
      },

      getClassifyList() {
        const that = this;
        Classify.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterClassifyList(list);
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
    width: 100px;
    line-height: 100px;
    text-align: center;
  }

  .nav-img {
    width: 100px;
    height: 100px;
    display: block;
    object-fit: cover;
  }
</style>
