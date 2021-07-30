<template>
  <div class="home-page">
    <h2 class="title">自动发送消息</h2>

    <!-- settings -->
    <el-form :disabled="formDisabled" ref="form" :model="settings" label-width="100px" label-position="left">
      <el-form-item label="当前语句">
        <el-input readonly v-model="settings.msg" />
      </el-form-item>
      <el-form-item label="屏蔽词">
        <el-checkbox v-model="settings.isReplace">替换可能被屏蔽的词汇</el-checkbox>
      </el-form-item>
      <el-form-item label="输入前缀">
        <el-input v-model="settings.prefix" placeholder="如: @xxx" />
      </el-form-item>
      <el-form-item label="输入速度">
        <el-select v-model="settings.speed" placeholder="请选择活动区域">
          <el-option v-for="item in speedOptions" :key="item" :label="`${item}ms`" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>

    <!-- buttons -->
    <div class="btns-wrapper flex flex-center wrapper-item">
      <el-button type="primary" :disabled="formDisabled" @click="start">火力全开</el-button>
      <el-button type="danger" :disabled="!formDisabled" @click="stop">停止输入</el-button>
      <el-button type="info" :disabled="formDisabled" @click="importDatas">导入数据</el-button>
      <el-popover
        placement="top-start"
        title="注意事项"
        trigger="hover"
        content="需要安装java runtime环境, 也就是说: 需要安装jdk"
      >
        <el-button slot="reference" type="text" :disabled="formDisabled">注意事项</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
const datas = require('/static/db.json');

export default {
  data: () => ({
    settings: {
      speed: 1000,
      prefix: '',
      isReplace: false,
      msg: ''
    },
    replaceRules: [
      {
        origin: '妈',
        target: 'ma'
      },
      {
        origin: '爹',
        target: '跌'
      },
      {
        origin: '狗',
        target: 'gou'
      },
      {
        origin: '婊',
        target: '錶'
      },
      {
        origin: '杂种',
        target: '咋种'
      },
      {
        origin: '杂,种',
        target: '咋种'
      }
    ],
    formDisabled: false,
    speedOptions: [1000, 2000, 3000, 4000, 5000]
  }),
  created() {
    this.initStates();
  },
  methods: {
    // 初始化不会影响dom, 但是需要全局使用的数据
    initStates() {
      this.datas = datas;
      this.dataIndex = 0;
      this.dataLength = datas.length;
    },

    // 开始输入
    start() {
      this.formDisabled = true;
      this.timer && clearInterval(this.timer);
      this.timer = setInterval(this.exec, this.settings.speed);
    },

    // 停止输入
    stop() {
      this.formDisabled = false;
      this.timer && clearInterval(this.timer);
    },

    // 导入数据
    importDatas() {
      this.$message.info('正在开发中...');
    },

    // 处理到系统中的字符串中的敏感关键字
    filterInputString(str) {
      if (!str.length) return '';
      let rule;
      for (let i = 0, l = this.replaceRules.length; i < l; i++) {
        rule = this.replaceRules[i];
        str = str.replace(new RegExp(rule.origin, 'igm'), rule.target); // 使用正则全局替换
      }
      return this.settings.prefix + str;
    },

    // 执行
    exec() {
      let str = this.datas[this.dataIndex];
      if (this.settings.isReplace) {
        str = this.filterInputString(str);
      }
      this.settings.msg = str;
      ipcRenderer.send('start-message-auto-sender', str);

      this.dataIndex += 1;
      if (this.dataIndex >= this.dataLength) {
        this.dataIndex = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
}
.flex-center {
  justify-content: center;
  align-items: center;
}

.home-page {
  .title {
    font-size: 30px;
    text-align: center;
    padding: 50px 0;
  }
  width: 500px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
  .btns-wrapper {
    justify-content: space-evenly;
  }
}
</style>
