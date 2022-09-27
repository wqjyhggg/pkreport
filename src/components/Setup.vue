<template>
  <div class="notfound">
    <Breadcrumb
      backto="Dashboard"
      :title="$t('Settings')"
      :key="title"
      @submit="do_submit"
    ></Breadcrumb>
    <el-row class="setup-row">
      <el-col>
        <div class="setup-label">
          Language
        </div>
        <el-select v-model="lang" @change="handleLanguage" placeholder="Language">
          <el-option key="en" label="English" value="en">
          </el-option>
          <el-option key="cn" label="简体" value="cn">
          </el-option>
          <el-option key="cn-t" label="繁体" value="cn-t">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row class="setup-row">
      <el-col>
        <div class="setup-label">
          Server URI
        </div>
        <el-input placeholder="http://abc.posking.ca" v-model="dns" @keyup.native="change_uri" @change="check_uri"></el-input>
      </el-col>
    </el-row>
    <el-row v-if="!tested" class="setup-row">
      <el-col>
        <el-button type="success" round @click="link_test">Test URI and Save</el-button>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="show_error" :show-close="false">
      {{ error_msg }}
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="show_error = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { readStorage, saveStorage, removeStorage } from "../utils/storage";
import { setUILanguage } from "../utils/utils"
import Breadcrumb from './Breadcrumb'

export default {
  name: 'Setup',
  components: {
    Breadcrumb
  },
  data () {
    return {
      title: 'Settings',
      dns: '',
      lang: 'en',
      tested: true,
      show_error: false,
      error_msg: '',
    }
  },
  methods: {
    handleLanguage() {
      saveStorage("rpt_lang", this.lang)
      setUILanguage(this, this.lang)
      this.title = this.$t('Settings');
    },
    show_error_msg(msg) {
      this.error_msg = msg;
      this.show_error = true;
    },
    change_uri() {
      this.tested = false;
    },
    check_uri() {
      this.tested = false;
      if (this.dns.length < 6) {
        this.show_error_msg("Must input as : http://abc.posking.ca")
        return;
      }
      var urihead = this.dns.substr(0,4).toLowerCase();
      if (urihead != 'http') {
        this.show_error_msg("Must start with : http:// or https://")
        return;
      }
      var uritail = this.dns.substr(-1,1);
      if (uritail == '/') {
        this.dns = this.dns.slice(0,-1);
      }
    },
    link_test() {
      var server_url = this.dns + "/Api/login/testlink";
      
      var bodydt = new FormData();
      bodydt.append('token', 'testing');
      var that = this;
      this.axios.post(server_url, bodydt)
        .then(function (response) {
          if (response.status == 200) {
            var data = response.data;
            if (data == 'Enterprise') {
              var fulluri = that.dns + '/Api';
              saveStorage('rpt_dns', that.dns);
              saveStorage('rpt_server', fulluri);
              removeStorage("rpt_token");
              removeStorage("rpt_userid");
              that.$router.push('/dashboard');
              return;
            }
          }
          that.show_error_msg("Server Error")
        })
        .catch(function (error) {
          if ((error.response != undefined) && (error.response.status == 401)) {
            that.$router.push("/"); // Go Login
          }
          // console.log(error);
          console.log('Setup link_test catch error', error);
          that.show_error_msg("Can't find server")
        });
    },
    do_submit() {
      this.$router.push("/dashboard")
    }
  },
  mounted() {
    this.dns = readStorage('rpt_dns') || '';
    var url = readStorage('rpt_server') || '';
    this.lang = readStorage("rpt_lang") || "en";
    setUILanguage(this, this.lang)
    
    if (!this.dns || !url) {
      this.tested = false;
    }
    this.title = this.$t('Settings');
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-select {
  width: 100%;
}
.setup-label {
  text-align: left;
  font-weight: bold;
  font-size: 1rem;
  line-height: 2rem;
}
.setup-row {
  padding: 1rem 3rem 0 3rem;
  font-weight: normal;
}
</style>
