<template>
  <div class="dashboard">
    <Breadcrumb
      backto="Login"
      :title="$t('Dashboard')"
      key="dashboard"
      submit="setup"
      @submit="do_submit"
    ></Breadcrumb>
    <el-row>
      <el-col :span="8" class="summary">
        <div class="summary-price">
          {{ order_num }}
        </div>
        <hr class="solid">
        <div class="summary-text">
          {{ $t('Total Sales') }}
        </div>
      </el-col>
      <el-col :span="8" class="right-border summary">
        <div class="summary-price">
          {{ total }}
        </div>
        <hr class="solid">
        <div class="summary-text">
          {{ $t('Gross Sales') }}
        </div>
      </el-col>
      <el-col :span="8" class="right-border summary">
        <div class="summary-price">
          {{ income }}
        </div>
        <hr class="solid">
        <div class="summary-text">
          {{ $t('Net Sales') }}
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="date-row">
        {{ $t('Date') }} : {{ today }}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" class="link-col link-right-boarder">
        <div>
          <img src="../assets/img/dayend.png" @click="$router.push('dayend')">
        </div>
        <div>
          {{ $t('Day End') }}
        </div>
      </el-col>
      <el-col :span="6" class="link-col link-right-boarder">
        <div>
          <img src="../assets/img/category.png" @click="$router.push('category')">
        </div>
        <div>
          {{ $t('Category') }}
        </div>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="show_msg" :show-close="false">
      {{ text_msg }}
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="show_msg = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from './Breadcrumb'
import { readStorage } from "../utils/storage";

export default {
  name: 'Dashboard',
  components: {
    Breadcrumb
  },
  data () {
    return {
      enterpriseUrl: '',
      token: '',
      user_id: 0,

      storename: '',
      today: '',
      order_num: 0,
      total: 0,
      income: 0,

      text_msg: '',
      show_msg: false,

      onlyself: 0,
      storelist: [],
      list_data: false,
      data_column_count: 0,
      title_list: '',
      special_mark: '',
      report_width: 0,
    }
  },
  methods: {
    show_pop_msg(msg) {
      this.text_msg = msg;
      this.show_msg = true;
    },
    do_submit() {
      this.$router.push("Setup")
    },
    get_dashborad_data() {
      var bodydt = new FormData();
      bodydt.append('token', this.token);
      bodydt.append('user_id', this.user_id);
      var that = this;
      this.axios.post(this.enterpriseUrl + '/Web/dashboard', bodydt)
        .then(function (response) {
          if (response.status == 200) {
            if (response.data.status) {
              that.show_pop_msg(response.data.message);
              return;
            }
            var data = response.data.data;
            that.onlyself = data.onlyself;
            that.storelist = data.storelist;

            that.list_data = data.list_data;
            that.data_column_count = data.data_column_count;
            that.title_list = data.title_list;
            that.special_mark = data.special_mark; // ALL Store
            that.report_width = String((data.data_column_count + 1) * 240) + "px";
            that.today = data.today;

            if (typeof that.list_data === 'object') {
              if (that.list_data.hasOwnProperty('summary_list_data')  && that.list_data.summary_list_data.hasOwnProperty('SUMMARY')) {
                if (that.list_data.summary_list_data.SUMMARY.hasOwnProperty('Gross Sales')) {
                  that.order_num = parseInt(that.list_data.summary_list_data.SUMMARY['Gross Sales'].Count);
                  that.total = parseFloat(that.list_data.summary_list_data.SUMMARY['Gross Sales'].Amount).toFixed(2);
                } else {
                  that.order_num = 0;
                  that.total = 0.00;
                }
                if (that.list_data.summary_list_data.SUMMARY.hasOwnProperty('Net Sales')) {
                  that.income = parseFloat(that.list_data.summary_list_data.SUMMARY['Net Sales'].Amount).toFixed(2);
                } else {
                  that.income = 0;
                }
              }
            }
            // that.storename = data.storename;
            return;
          }
          that.show_pop_msg('Network Data Error')
        })
        .catch(function (error) {
          if ((error.response != undefined) && (error.response.status == 401)) {
            that.$router.push("/"); // Go Login
          }
          // console.log(error);
          // console.log('Setup link_test catch error', error);
          // that.show_pop_msg('Network Error')
          that.$router.push("/");
        });
    },
    init_data() {
      this.user_id = readStorage("rpt_userid") || 0;
      this.token = readStorage("rpt_token") || "";
      if (!this.token || (this.token == undefined) || !this.user_id) {
        this.$router.push("/");
        return false;
      }
      this.enterpriseUrl = readStorage("rpt_server") || "";
      if (!this.enterpriseUrl) {
        this.$router.push("/Setup");
        return false;
      }
      return true;
    },
  },
  mounted() {
    if (this.init_data()) {
      this.get_dashborad_data();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
hr.solid {
  border-top: 3px solid black;
}
.right-border {
  border-left: 2px solid grey;
}
.summary {
  padding: .5rem .5rem;
  background: linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(189, 189, 189) 100%);
}
.summary-price {
  font-weight: 600;
  font-size: 1.5rem;
  text-align: center;
}
.summary-text {
  font-weight: 400;
  font-size: 1rem;
  text-align: center;
}
.link-col {
  padding-top: .5rem
} 
.link-right-boarder {
  border-right: 1px solid black;
}
.date-row {
  font-weight: 300;
  font-size: 1rem;
  text-align: center;
  line-height: 2rem;
  background: #35af04;
}
</style>
