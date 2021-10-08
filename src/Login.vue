<template>
  <div class="login-wrap">
    <div class="login-cont">
      <div class="company-info">
        <div class="company-name"><img src="./assets/xpose_logo.png" alt=""></div>
        <div class="company-link">
          <div><img src="./assets/rgbLink_logo.png" alt=""></div>
          <div>www.rgblink.com <i class="icon-customer"></i> </div>
        </div>
      </div>
      <div class="login-info">
        <div class="header">登录</div>
        <div class="login-data-item">
          <span>用户名</span>
          <input type="text" v-model="userName">
        </div>
        <div class="login-data-item">
          <span>密码</span>
          <input type="password" v-model="pwd">
        </div>
        <div class="login-data-item">
          <span>语言</span>
          <el-select v-model="language" placeholder="请选择">
            <el-option
              v-for="item in languageList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="login-btn" @click="loginEvent">现在开始</div>
        <div class="register-btn" @click="goRegisterPage">去注册</div>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '@/utils/api';
import globalWs from '@/utils/globalWs';
import utils from '@/utils/utils';
export default {
  data() {
    return {
      socket: null,
      userName: '',
      pwd: '',
      languageList: [{ // 语言列表
        id: 1,
        label: '中文'
      }],
      language: 1 // 所选语言
    }
  },
  mounted() {
    document.onkeydown = (e) => {
      const key = window.event ? window.event.keyCode : e.code;
      if(key == 13) {
        this.loginEvent();
      }
    }
    // 获取mac,ip信息
    Api.getMacAddress().then(res => {
      if(res.code == 200) {
        this.ip = res.data.ip;
        this.macp = res.data.mac;
        window.sessionStorage.setItem("ip", JSON.stringify(res.data.ip));
        window.sessionStorage.setItem("mac", JSON.stringify(res.data.mac));
      } else {
        this.$message.error(res.message);
      }
    });
    
    const params = this.$route.params;
    if(params) {
      this.userName = params.account;
      this.pwd = params.passwd;
    }

  },
  methods: {
    loginEvent() {
      if(this.userName && this.pwd) {
        const data = {
          userName: this.userName,
          passwd: this.pwd
        }
        Api.login(data).then(res => {
          if(res.code == 200) {
            // 登录成功创建websocket
            this.creactWebsocket(this.ip);
            window.sessionStorage.setItem("sessionId", JSON.stringify(res.data.sessionID));
            window.sessionStorage.setItem("isLogin", JSON.stringify(true));
            window.sessionStorage.setItem("account", JSON.stringify(this.userName));
            window.sessionStorage.setItem("passwd", JSON.stringify(this.pwd));
            this.$router.push({path: '/index'});
          }
        });
      } else {
        this.$message.error('用户名或密码错误')
      }
    },
    // 去注册
    goRegisterPage() {
      this.$router.push({path: '/register'});
    },
    creactWebsocket(ip) {
      //socket 准备
      if(window.WebSocket){
        const wsUrl = process.env.VUE_APP_TITLE !== 'production' ? "ws://"+ip+":8800" : "ws://"+ip+":8800";
        globalWs.connectSocket(wsUrl);
        
      }else{
        alert("error");
      }
    }
  }
}
</script>

<style scoped lang='less'>
  .login-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    .login-cont {
      display: flex;
      width: 640px;
      height: 420px;
      padding: 32px 64px;
      background: rgb(18,24,36);
      .company-info {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0 24px;
        .company-name {
          color: #fff;
          font-size: 24px;
          font-weight: bold;
          img {
            display: block;
            width: 140px;
            height: 60px;
          }
        }
        .company-link {
          color: #fff;
          font-size: 12px;
          img {
            display: block;
            width: 100px;
            height: 20px;
            margin-bottom: 8px;
          }
        }
      }
      .login-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        background: rgb(43,48,66);
        .header {
          height: 42px;
          line-height: 42px;
          text-align: center;
          border-top: 2px solid rgb(26,188,156);
          color: rgb(26,188,156);
        }
        .login-data-item {
          display: flex;
          align-items: center;
          width: 70%;
          height: 42px;
          margin: 0 auto 12px;
          background: #fff;
          padding: 0 12px;
          border-radius: 6px;
          span {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 25%;
            margin-right: 12px;
          }
          input {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            appearance: none;
            padding: 0;
          }
          /deep/ .el-input__inner {
            border: none;
          }
        }
        .login-btn {
          width: 75%;
          height: 42px;
          margin: 20px auto 0;
          background: rgb(26,188,156);
          line-height: 42px;
          border-radius: 6px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
        .register-btn {
          width: 75%;
          margin: 20px auto 0;
          display: flex;
          justify-content: flex-end;
          color: rgb(26,188,156);
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
  }
</style>