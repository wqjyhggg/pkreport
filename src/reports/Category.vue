<template>
  <div class="category">
    <Breadcrumb
      backto="Dashboard"
      title="Category"
      key="category"
      submit="category"
      @submit="do_submit"
    ></Breadcrumb>
    <div class="date-div">
      {{ from_date + " To " + to_date }}
    </div>
    <table :key="contentkey" v-bind:style="{ minWidth: '100%' }">
      <tr>
        <th v-for="(dt, idx) in tableHead" :key="idx">
          <div v-if="idx==0" class="head-cols first-col">
            {{ dt }}
          </div>
          <div v-else class="head-cols">
            {{ dt }}
          </div>
        </th>
      </tr>
      <tr v-for="(rt, id) in tableData" :key="id">
        <td v-for="(dt, idx) in tableHead" :key="idx">
          <div v-if="(idx==0)&&(rt[idx].vtype=='title')" class="content-title first-col">
            {{ rt[idx].name }}
          </div>
          <div v-if="(idx==0)&&(rt[idx].vtype=='subtitle')" class="content-subtitle first-col">
            {{ rt[idx].name }}
          </div>
          <div v-if="rt[idx].vtype=='data'" class="content-data">
            ${{ rt[idx].amount }}
          </div>
          <div v-if="rt[idx].vtype=='empty'" class="empty-data">
          </div>
        </td>
      </tr>
    </table>
    <el-drawer
      title="I am the title"
      :visible.sync="drawer"
      size='80%'
      @closed="get_data"
      :with-header="false">
      <div class="search-row1">
      </div>
      <el-row class="search-rows">
        <el-col :span="12" class="search-label">
          {{ $t('Start Date') }}
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="from_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="Start Date"
            size="mini"
            :picker-options="pickerDateOptions">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row class="search-rows">
        <el-col :span="12" class="search-label">
          {{ $t('End Date') }}
        </el-col>
        <el-col :span="12">
          <el-date-picker
            v-model="to_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="End Date"
            size="mini"
            :picker-options="pickerDateOptions">
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :class="storeclass">
        <el-col :span="12" class="search-label">
          {{ $t('Store') }}
        </el-col>
        <el-col :span="12">
          <el-select v-model="cur_store_ID" placeholder="Select Store" size="mini">
            <el-option key="none" label="Select Store" value=""></el-option>
            <el-option
              v-for="loc in storelist"
              :key="loc.LocationID"
              :label="loc.LocationName"
              :value="loc.LocationID">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search-rows">
        <el-col :span="12" class="search-label">
          {{ $t('Department') }}
        </el-col>
        <el-col :span="12">
          <el-select v-model="DepartmentIDn" @change="change_department" placeholder="Department" size="mini">
            <el-option
              v-for="loc in departmentlist"
              :key="loc.IDn"
              :label="loc.Name1"
              :value="loc.IDn">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search-rows">
        <el-col :span="12" class="search-label">
          {{ $t('Category') }}
        </el-col>
        <el-col :span="12">
          <el-select v-model="CategoryIDn" placeholder="Category" size="mini">
            <el-option
              v-for="loc in categorylist"
              :key="loc.IDn"
              :label="loc.Name1"
              :value="loc.IDn">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="search-submit-row">
        <el-col>
          <el-button type="success" round @click="get_data">{{ $t('Search') }}</el-button>
        </el-col>
      </el-row>
    </el-drawer>
    <el-dialog :visible.sync="show_msg" :show-close="false">
      {{ text_msg }}
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="show_msg = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb'
import { readStorage } from "../utils/storage";

export default {
  name: 'Category',
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

      drawer: false,

      text_msg: '',
      show_msg: false,

      show_store: false,

      ac_time: true,
      storeclass: "nodisplay",
      summary_only: true,
      from_date: '',
      from_time: '',
      to_date: '',
      to_time: '',
      onlyself: 0,
      cur_store_ID: '',
      DepartmentIDn: 0,
      CategoryIDn: 0,

      storelist: [],
      departmentlist: [],
      categorylist: [],
      list_data: false,
      data_column_count: 0,
      title_list: '',
      special_mark: '',
      report_width: '',
      pickerDateOptions: {},
      pickerTimeOptions: {
        start:'00:00',
        end:'24:00'
      },

      tableData: [],
      tableHead: [],
      contentkey: 1,
    }
  },
  methods: {
    show_pop_msg(msg) {
      this.text_msg = msg;
      this.show_msg = true;
    },
    do_submit() {
      this.drawer = true
    },
    change_department() {
      this.CategoryIDn = 0;
      for (var i = 0; i < this.departmentlist.length; i++) {
        if (this.departmentlist[i].IDn == this.DepartmentIDn) {
          this.categorylist = this.departmentlist[i].categorylist;
          break;
        }
      }
    },
    format_table_data() {
      this.tableData = [];
      this.tableHead = [];

      // console.log("Category format_table_data ===>>> list_data", this.list_data);
      // console.log("Category format_table_data ===>>> title_list", this.title_list);
      this.tableHead[0] = this.special_mark;
      if (!this.list_data.hasOwnProperty('column_name') || !this.list_data.hasOwnProperty('category_data_list')) {
        // No data
        return;
      }

      var i = 1;
      for (const col_key in this.list_data.column_name) {
        this.tableHead[i++] = this.list_data.column_name[col_key];
      }

      // Fill data
      var row = 0;
      var ldata;
      var idx;
      const data_list = this.list_data['category_data_list'];
      for (const list_key in this.title_list) {
        if (!this.title_list.hasOwnProperty(list_key)) {
          continue;
        }
        if (!this.list_data.category_data_list.hasOwnProperty(list_key)) {
          continue;
        }

        // Block Title
        this.tableData[row] = [];
        var tt = this.title_list[list_key];
        if (tt.length > 28) {
          tt = tt.substr(0, 25) + "..";
        }
        this.tableData[row][0] = {vtype: 'title', name: tt};
        idx = 1;
        for (const col_key in this.list_data.column_name) {
          this.tableData[row][idx++] = {vtype: 'empty'};
        }
        row++;

        ldata = this.list_data.category_data_list[list_key];
        if (!ldata.hasOwnProperty('report_summary')) {
          // No a good data format
          continue;
        }
        for (const row_key in ldata.report_summary) {
          // Block Data
          this.tableData[row] = [];
          this.tableData[row][0] = {vtype: 'subtitle', name: row_key};
          idx = 1;
          for (const col_key in this.list_data.column_name) {
            if (ldata.hasOwnProperty(col_key) && ldata[col_key].hasOwnProperty(row_key)) {
              const mydata = ldata[col_key][row_key];
              this.tableData[row][idx++] = {vtype: 'data', amount: mydata};
            } else {
              this.tableData[row][idx++] = {vtype: 'empty'};
            }
          }
          row++;
        }
      }
      // console.log("Category format_table_data End", this.tableData, this.tableHead);
      this.contentkey++;
    },
    get_data() {
      // console.log("Category get_data");
      this.drawer = false
      var bodydt = new FormData();
      bodydt.append('token', this.token);
      bodydt.append("user_id", this.user_id);
      bodydt.append("ac_time", this.ac_time);
      if (this.ac_time) {
        bodydt.append("FromDate", this.from_date);
        bodydt.append("ToDate", this.to_date);
      } else {
        bodydt.append("FromDate", this.from_date + " " + this.from_time);
        bodydt.append("ToDate", this.to_date + " " + this.to_time);
      }
      if (!this.cur_store_ID) {
        bodydt.append("StoreID", this.cur_store_ID);
      }
      if (this.summary_only) {
        bodydt.append("SummaryOnly", this.summary_only);
      }
      if (this.DepartmentIDn) {
        bodydt.append("DepartmentIDn", this.DepartmentIDn);
      }
      if (this.CategoryIDn) {
        bodydt.append("CategoryIDn", this.CategoryIDn);
      }
      var that = this;
      this.axios.post(this.enterpriseUrl + '/Web/Pos_sales_by_category', bodydt)
        .then(function (response) {
          console.log("Category get_data return", response);
          if (response.status == 200) {
            var rt = response.data;
            if (rt.status == 0) {
              that.onlyself = rt.data.onlyself;
              // that.storelist = rt.data.storelist;
              that.storelist = [];
              var idx = 0;
              for (var st in rt.data.storelist) {
                that.storelist[idx++] = rt.data.storelist[st];
              }
              if (that.storelist.length > 1) {
                that.storeclass = "search-rows";
              } else {
                that.storeclass = "nodisplay";
              }

              that.list_data = rt.data.list_data;
              that.departmentlist = rt.data.departmentlist;
              that.data_column_count = rt.data.data_column_count;
              that.title_list = rt.data.title_list;
              that.special_mark = rt.data.special_mark;
              that.report_width = (12 + (that.data_column_count)*8) + 'rem';
              // if (that.special_mark == "ALL STORE") {
              //   that.special_mark = "-";
              // }
              that.format_table_data();
            } else if (rt.status == 4) {
              that.show_pop_msg(that.$t("No Permission"));
              // that.$router.go(-1);
            } else if (rt.message != undefined) {
              that.show_pop_msg(rt.message);
            }
          } else {
            that.show_pop_msg('Network Data Error')
          }
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.response);
          if ((error.response != undefined) && (error.response.status == 401)) {
            that.$router.push("/"); // Go Login
          }
          console.log('Category get_data catch error', error);
          that.show_pop_msg('Network Error')
        });
    },
    get_today() {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      return yyyy + "-" + mm + "-" + dd;
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
      this.from_date = this.get_today();
      this.to_date = this.from_date;
      return true;
    },
  },
  mounted() {
    if (this.init_data()) {
      this.get_data();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
tr:nth-child(even) {
  background-color: #ffffff;
}
hr.solid {
  border-top: 3px solid black;
}
.nodisplay {
  display: none;
}
.date-div {
  padding: .5rem 1rem;
  background: rgb(255, 255, 255);
  font-size: 1rem;
}
.head-cols {
  padding: .25rem;
  font-size: .8rem;
  line-height: 1rem;
  text-align: center;
  background-color: #cccccc;
  min-width: 8rem;
}
.first-col {
  text-align: left;
  padding-left: 1rem;
  min-width: 12rem;
  overflow: hidden;
  white-space: nowrap;
}
.content-title {
  padding: .75rem .5rem .1rem .5rem;
  font-size: .8rem;
  line-height: 1rem;
  text-align: left;
  text-decoration: underline;
  font-weight: 600;
  background-color: #ffffff;
}
.content-subtitle {
  padding: 0 .5rem;
  font-size: .8rem;
  line-height: 1rem;
  text-align: left;
  font-weight: 400;
  background-color: #ffffff;
}
.empty-data {
  padding: 0 .75rem 0 .5rem;
  font-size: 1rem;
  line-height: 1rem;
  text-align: right;
  background-color: #ffffff;
  color: #ffffff;
  min-width: 8rem;
}
.content-data {
  padding: 0 .75rem;
  font-size: .8rem;
  line-height: 1rem;
  text-align: right;
  background-color: #ffffff;
  color: black;
  min-width: 8rem;
}
table {
  border-spacing: 0;
  border: none;
  background-color: #ffffff;
}
tr {
  border-spacing: 0;
  padding: 0;
}
th {
  border-spacing: 0;
  padding: 0;
  border: none;
}
td {
  border-spacing: 0;
  padding: 0;
}
.report-row {
  -ms-flex-preferred-size: 0;
  flex-basis: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
  max-width: 100%;
}
.report-col {
  flex-basis: 0;
  flex-wrap: wrap;
  flex-wrap: wrap;
  flex-wrap: wrap;
}
.search-rows {
  padding-top: 0.7rem;
}
.search-row1 {
  padding-top: 0.5rem;
}
.search-submit-row {
  padding-top: 1.5rem;
}
h1, h2 {
  background: linear-gradient(to bottom, rgba(204,224,245,1) 0%, rgba(153,194,235,1) 100%);
  font-weight: normal;
}
</style>