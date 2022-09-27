<template>
  <div class="login">
    <el-row>
      <el-col>
        <img src="../assets/logo.jpg" class="toplogo" />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <img class="settingclass" src="../assets/img/settings.png" @click="$router.push('/setup')"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="inputclass">
        <el-input :placeholder="$t('Username')" @change="change_username" v-model="username">
          <template slot="prepend">
            <img src="../assets/img/account.png" />
          </template>
          <template slot="append" style="background-color: #ffffff">
            <el-popover trigger="click" :content="$t('Login Username')">
              <el-button slot="reference">
                <div class="inputinfo">?</div>
              </el-button>
            </el-popover>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="inputclass">
        <el-input placeholder="************" @change="change_password" v-model="password">
          <template slot="prepend">
            <img src="../assets/img/locker.png" />
          </template>
          <template slot="append" style="background-color: #ffffff">
            <el-popover trigger="click" :content="$t('User Password')">
              <el-button slot="reference">
                <div class="inputinfo">?</div>
              </el-button>
            </el-popover>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="inputclass">
        <el-input :placeholder="$t('Cell Phone')" @change="change_phone" v-model="phone">
          <template slot="prepend">
            <img src="../assets/img/phone.png" />
          </template>
          <template slot="append" style="background-color: #ffffff">
            <el-popover trigger="click" :content="$t('Contact Phone Number')">
              <el-button slot="reference">
                <div class="inputinfo">?</div>
              </el-button>
            </el-popover>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col class="inputclass2">
        <el-button type="success" class="submitbutton" round @click="doLogin">
          <el-row>
            <el-col :span="4">
              <img src="../assets/img/Login.png" />
            </el-col>
            <el-col :span="20" class="submittext">
              {{ $t("Sign In") }}
            </el-col>
          </el-row>
        </el-button>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="show_msg" :show-close="false">
      {{ msg }}
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" round @click="show_msg = false">OK</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { readStorage, saveStorage, removeStorage } from "../utils/storage";
import { setUILanguage } from "../utils/utils"

export default {
  name: "Login",
  data() {
    return {
      lang: "en",
      enterpriseUrl: "",
      username: "",
      password: "",
      phone: "",

      show_msg: false,
      msg: "",
    };
  },
  methods: {
    show_message(msg) {
      this.msg = msg;
      this.show_msg = true;
    },
    change_username() {
      saveStorage("rpt_username", this.username);
    },
    change_password() {
      saveStorage("rpt_password", this.password);
    },
    change_phone() {
      saveStorage("rpt_phone", this.phone);
    },
    doLogin() {
      var bodydt = new FormData();
      var password = this.password;
      if (!password) {
        password = readStorage("rpt_password") || "";
      }
      bodydt.append('username', this.username);
      bodydt.append('password', password);
      bodydt.append('phone', this.phone);
      bodydt.append('istoken', 'token');
      var that = this;
      this.axios.post(this.enterpriseUrl + "/Web/Login", bodydt)
        .then(function (response) {
          console.log(response);
          if (response.status == 200) {
            var token = response.data.data.token;
            var userid = response.data.data.user_id;
            if (response.data.data.status) {
              that.show_message(response.data.data.message)
            } else {
              saveStorage("rpt_token", token);
              saveStorage("rpt_userid", userid);
              that.$router.push("/dashboard");
              return;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      this.show_message(this.$t('Login Failed'))
    },
  },
  mounted() {
    this.lang = readStorage("rpt_lang") || "en";
    setUILanguage(this, this.lang);

    this.enterpriseUrl = readStorage("rpt_server") || "";
    if (!this.enterpriseUrl) {
      this.$router.push("/Setup");
      return;
    }
    var token = readStorage("rpt_token") || "";
    if (token && (token != undefined)) {
      var bodydt = new FormData();
      bodydt.append('token', token);
      console.log("Login mounted auto login", token); //XXXXXXXXXXXXXXXXX
      this.axios.post(this.enterpriseUrl + "/login/token", bodydt)
        .then(function (response) {
          console.log("Login mounted auto login => ", response); //XXXXXXXXXXXXXXXXX
          if (response.status == 200) {
            var token = response.data.token;
            var userid = response.data.user_id;
            saveStorage("rpt_token", token);
            saveStorage("rpt_userid", userid);
            this.$router.push("/dishboard");
            return;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    removeStorage("rpt_token");
    this.username = readStorage("rpt_username") || "";
    var password = readStorage("rpt_password") || "";
    this.phone = readStorage("rpt_phone") || "";
    if ((this.username.length > 1) && (password.length > 1) && (this.phone.length > 1)) {
      this.doLogin();
    }
    console.log("Login mounted", this.username, this.phone); //XXXXXXXXXXXXXXXXX
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.submitbutton {
  padding: 0.2rem 0.2rem;
  font-weight: bold;
  width: 70%;
}
.submittext {
  margin: auto;
  line-height: 2rem;
  height: 2rem;
}
.el-input-group__append {
  background-color: #ffffff !important;
}
.inputinfo {
  padding: 0;
  color: #4ee314;
  font-size: 1rem;
  background-color: #ffffff !important;
}
.inputclass {
  padding: 0.1rem 2rem;
}
.settingclass {
  float: right;
  padding:0.2rem 3rem 0 0;
  width: 1.25rem;
}
.inputclass2 {
  padding: 1rem;
}
.toplogo {
  padding: 2rem 2rem 0 2rem;
}
</style>
