<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">奖品列表</span>
      <el-button @click="prevShowEditModal()" class="mlr-sm" size="small" type="primary">添加奖品</el-button>
    </header>
    <my-table :data="lotteryList" :config="tableConfig">
      <div slot="operating" slot-scope="lottery">
        <el-button @click="prevShowEditModal(lottery.item)" size="small" type="success">编辑</el-button>
        <el-button @click="deleteLotteryItem(lottery.item,lottery.index)" size="small" type="danger">删除</el-button>
      </div>
    </my-table>

    <!--编辑奖品-->
    <el-dialog
      :append-to-body="true"
      :visible.sync="showEditModal">
      <div class="p-sm">
        <div class="edit-modal-item">
          <span class="plr-sm">奖品名称</span>
          <el-input v-model="lotteryItem.name" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">中奖概率(%)</span>
          <el-input v-model="lotteryItem.chance" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">奖品类型</span>
          <el-select v-model="lotteryItem.type" class="w-5">
            <el-option :value="1" label="其他"></el-option>
            <el-option :value="2" label="积分"></el-option>
            <el-option :value="3" label="套餐"></el-option>
          </el-select>
        </div>
        <div v-if="lotteryItem.type===3" class="edit-modal-item">
          <span class="plr-sm">套餐</span>
          <el-select v-model="lotteryItem.rechargeProductId" class="w-5">
            <el-option v-for="package in packageList" :value="package.id" :label="package.name"></el-option>
          </el-select>
        </div>
        <div v-if="lotteryItem.type===2" class="edit-modal-item">
          <span class="plr-sm">积分</span>
          <el-input type="number" v-model="lotteryItem.point" class="w-5"></el-input>
        </div>
        <div class="edit-modal-item">
          <span class="plr-sm">排序</span>
          <el-input type="number" v-model="lotteryItem.seq" class="w-5"></el-input>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <el-button @click="commitLotteryItem()" type="primary">保存</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import Lottery from '@/tool/classFactory/Lottery.js';
  import Product from '@/tool/classFactory/Product.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "lottery-list",
    data() {
      return {
        showEditModal: false,
        lotteryItem: {},
        lotteryList: [],
        packageList: [],
        tableConfig: [
          {
            label: '奖品名称',
            property: 'name'
          },
          {
            label: '中奖概率(%)',
            property: 'chance'
          },
          {
            label: '奖品类型',
            property: 'typeName'
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
      this.getLotteryList();
      this.getPackageList();
    },

    methods: {
      deleteLotteryItem(obj, index) {
        const that = this;
        that.$Modal.confirm({
          title: '提示',
          content: '是否删除，请确认',
          onOk: () => {
            let lottery = new Lottery(obj);
            lottery.delete().then(() => {
              that.lotteryList.splice(index, 1);
            });
          }
        });
      },

      commitLotteryItem() {
        const that = this;
        let lottery = new Lottery(that.lotteryItem);
        let thenObj = null;
        if (lottery.id) {
          thenObj = lottery.edit();
        } else {
          thenObj = lottery.add();
        }
        thenObj.then(() => {
          that.showEditModal = false;
          that.getLotteryList();
        });
      },

      prevShowEditModal(obj) {
        this.lotteryItem = obj || {type: 1, seq: 1, price: 0};
        this.showEditModal = true;
      },

      filterLotteryList(list) {
        list.map(item => {
          item.seq = item.seq || 1;
          item.chance = item.chance * 100;
          switch (item.type) {
            case 1:
              item.typeName = '其他';
              break;
            case 2:
              item.typeName = '积分';
              break;
            case 3:
              item.typeName = '套餐';
              break;
          }
        });
        list.sort((x, y) => {
          let typeFlag = x.type - y.type;
          let seqFlag = x.seq - y.seq;
          if (!typeFlag) {
            return seqFlag;
          }
          return typeFlag;
        });
      },

      getLotteryList() {
        const that = this;
        Lottery.prototype.getList().then(res => {
          let list = res.data.data || [];
          that.filterLotteryList(list);
          that.lotteryList.splice(0, that.lotteryList.length, ...list);
        });
      },

      getPackageList() {
        const that = this;
        Product.prototype.getList().then(res => {
          let list = res.data.data || [];
          list.sort((x, y) => {
            let typeFlag = x.type - y.type;
            let seqFlag = x.seq - y.seq;
            if (!typeFlag) {
              return seqFlag;
            }
            return typeFlag;
          });
          that.packageList.splice(0, that.packageList.length, ...list);
        });
      }
    }
  }
</script>

<style scoped>
  .edit-modal-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--sm);
  }

  .edit-modal-item span {
    display: inline-block;
    min-width: 6em;
    text-align: right;
  }
</style>
