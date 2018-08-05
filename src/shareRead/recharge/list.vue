<template>
  <section class="plr-sm">
    <header class="y-center ptb-xs sticky">
      <span class="size-md bolder">充值列表</span>
    </header>
    <my-table :data="rechargeList" :config="tableConfig"></my-table>
    <div v-if="rechargeList.length" class="text-center p-sm">
      <el-pagination
        @current-change="getRechargeList"
        :current-page.sync="search.page"
        :page-size="search.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="rechargeSum">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import Recharge from '@/tool/classFactory/Recharge.js';
  import myTable from '@/common/m-table.vue';

  export default {
    name: "recharge-list",
    data() {
      return {
        search: {
          page: 1,
          pageSize: 15
        },
        rechargeList: [],
        rechargeSum: 0,
        tableConfig: [
          {
            label: '充值套餐',
            property: 'productName'
          },
          {
            label: '充值积分',
            property: 'price'
          },
          {
            label: '充值手机',
            property: 'phone'
          },
          {
            label: '订单号',
            property: 'orderNum'
          },
          {
            label: '充值时间',
            property: 'createdAt'
          }
        ]
      }
    },

    components: {
      myTable
    },

    activated() {
      this.getRechargeList();
    },

    methods: {
      getRechargeList() {
        const that = this;
        Recharge.prototype.getList(that.search).then(res => {
          let list = res.data.data || [];
          that.rechargeList.splice(0, that.rechargeList.length, ...list);
          that.rechargeSum = res.data.extra.count || list.length;
        });
      }
    }
  }
</script>

<style scoped>

</style>
