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
          },
          {
            label: '订单状态',
            property: 'statusObj',
            color: true
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
      toStatusObj(status) {
        let name = '';
        let color = '';
        switch (status) {
          case 1 :
            name = '未支付';
            color = '#a4a4a4';
            break;
          case 2 :
            name = '已支付';
            color = 'inherit';
            break;
          case 3 :
            name = '已提交';
            color = '#2d8cf0';
            break;
          case 4 :
            name = '充值成功';
            color = '#19be6b';
            break;
          case 5 :
            name = '充值失败';
            color = '#ff3f66';
            break;
          case 6 :
            name = '退款中';
            color = '#2d8cf0';
            break;
          case 7 :
            name = '已退款';
            color = '#ffad33';
            break;
        }
        return {value: name, color};
      },

      filterRechargeList(list) {
        const that = this;
        list.map(item => {
          item.statusObj = that.toStatusObj(item.status);
        });
      },

      getRechargeList() {
        const that = this;
        Recharge.prototype.getList(that.search).then(res => {
          let list = res.data.data || [];
          that.filterRechargeList(list);
          that.rechargeList.splice(0, that.rechargeList.length, ...list);
          that.rechargeSum = res.data.extra.count || list.length;
        });
      }
    }
  }
</script>

<style scoped>

</style>
