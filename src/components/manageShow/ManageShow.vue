<template>
  <div class="manageShow-wrap">
    <div class="section">
      <div class="container-view">
        <div class="default-view" v-if="containerList.length == 0">
          <div class="title">创建一个容器</div>
          <div class="tips-box">
            <div class="tips-item">
              <div>
                *
                <span>打开设置界面，选择模板设置选项</span>
              </div>
              <em>
                -
                <span>选择容器模式</span>
              </em>
              <em>
                -
                <span>选择容器分辨率</span>
              </em>
              <em>
                -
                <span>选择自动创建显示器</span>
              </em>
              <em>
                -
                <span>选择容器的行和列数</span>
              </em>
            </div>
            <div class="tips-item">
              <div>
                *
                <span>拖拉出容器列表到此处</span>
              </div>
            </div>
            <div class="tips-item">
              <div>
                *
                <span>移动、配置这些显示器参数</span>
              </div>
            </div>
          </div>
        </div>
        <div class="container-box" v-if="containerList.length > 0">
          <Container
            v-for="(item, index) in containerList"
            :key="index"
            :cItem="item"
            :style="{
              borderColor:
                item.id == (selectedContainer && selectedContainer.id)
                  ? 'red'
                  : '',
            }"
            :deviceId="selectedDisplayerId"
            :output="setOutputList(item.containerId)"
          />
        </div>
      </div>
      <div class="right-view" v-show="!showInfo && nowMenuId == '003'">
        <div class="params-type">
          <el-scrollbar>
            <div :class="typeIndex == 0 ? 'show' : ''" @click="typeSelect(0)">
              模板
            </div>
            <div :class="typeIndex == 1 ? 'show' : ''" @click="typeSelect(1)">
              显示器
            </div>
            <div :class="typeIndex == 2 ? 'show' : ''" @click="typeSelect(2)">
              显示系统
            </div>
            <div :class="typeIndex == 3 ? 'show' : ''" @click="typeSelect(3)">
              参数
            </div>
          </el-scrollbar>
        </div>
        <div class="params-conts">
          <div v-show="typeIndex == 0">
            <div class="input-view">
              <span>模式</span>
              <el-select v-model="modelVal" placeholder="请选择">
                <el-option
                  v-for="item in modelList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div class="mar-left" v-if="userSetStatus">
                <el-checkbox v-model="outputCheck">显示器</el-checkbox>
              </div>
            </div>
            <div class="input-view" v-if="!userSetStatus">
              <span>分辨率</span>
              <el-select v-model="separation" placeholder="请选择">
                <el-option
                  v-for="item in separationList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div class="mar-left">
                <el-checkbox v-model="outputCheck">显示器</el-checkbox>
              </div>
            </div>
            <div class="template-list" v-if="!userSetStatus">
              <div
                class="template-item"
                v-for="(item, index) in templateList"
                :key="index"
                :id="item.id"
              >
                <span class="index-text">{{ index + 1 }}</span>
                <div class="icon-view">
                  <img src="../../assets/selContainer.png" alt="" />
                </div>
                <span>
                  {{ item.row }} x {{ item.col }} ({{
                    separation == 10 ? 1920 * item.col : 3840 * item.col
                  }}
                  x
                  {{ separation == 10 ? 1080 * item.row : 2160 * item.row }})
                </span>
              </div>
            </div>
            <div class="user-section" v-if="userSetStatus">
              <div class="user-save-containers">
                <el-scrollbar style="height: 100%"></el-scrollbar>
              </div>
              <div class="set-view">
                <el-scrollbar style="height: 100%">
                  <div class="mesg">
                    <span>显示器类型</span>
                    <el-switch
                      class="switch"
                      v-model="userSetData.outputType"
                      active-color="#1ABC9C"
                      inactive-color="#2C384F"
                      active-text="LCD屏"
                      inactive-text="LED屏"
                    ></el-switch>
                  </div>
                  <div class="mesg">
                    <span>显示器布局</span>
                    <el-switch
                      class="switch"
                      v-model="userSetData.outputFlex"
                      active-color="#1ABC9C"
                      inactive-color="#2C384F"
                      active-text="手动"
                      inactive-text="自动"
                    ></el-switch>
                  </div>
                  <div class="params-style-input">
                    <span>总宽</span>
                    <input
                      type="text"
                      :value="userSetData.allW"
                      @input="(e) => changInput(e, 'userSetAllW')"
                    />
                  </div>
                  <div class="params-style-input">
                    <span>总高</span>
                    <input
                      type="text"
                      :value="userSetData.allH"
                      @input="(e) => changInput(e, 'userSetAllH')"
                    />
                  </div>
                  <div class="params-style-input">
                    <span>行</span>
                    <input
                      type="text"
                      :value="userSetData.row"
                      @input="(e) => changInput(e, 'userSetRow')"
                    />
                  </div>
                  <div class="params-style-input">
                    <span>列</span>
                    <input
                      type="text"
                      :value="userSetData.col"
                      @input="(e) => changInput(e, 'userSetCol')"
                    />
                  </div>
                  <div class="params-style-input" v-if="userSetData.outputType">
                    <span>顶边框</span>
                    <input
                      type="text"
                      :value="userSetData.borderT"
                      @input="(e) => changInput(e, 'userSetBorderT')"
                    />
                  </div>
                  <div class="params-style-input" v-if="userSetData.outputType">
                    <span>底边框</span>
                    <input
                      type="text"
                      :value="userSetData.borderB"
                      @input="(e) => changInput(e, 'userSetBorderB')"
                    />
                  </div>
                  <div class="params-style-input" v-if="userSetData.outputType">
                    <span>左边框</span>
                    <input
                      type="text"
                      :value="userSetData.borderL"
                      @input="(e) => changInput(e, 'userSetBorderL')"
                    />
                  </div>
                  <div class="params-style-input" v-if="userSetData.outputType">
                    <span>右边框</span>
                    <input
                      type="text"
                      :value="userSetData.borderR"
                      @input="(e) => changInput(e, 'userSetBorderR')"
                    />
                  </div>
                  <div class="params-style-input">
                    <span>宽1</span>
                    <input
                      type="text"
                      :value="userSetData.itemW"
                      @input="(e) => changInput(e, 'userSetItemW')"
                    />
                  </div>
                  <div class="params-style-input">
                    <span>高1</span>
                    <input
                      type="text"
                      :value="userSetData.itemH"
                      @input="(e) => changInput(e, 'userSetItemH')"
                    />
                  </div>
                  <div class="btn-view">
                    <div @click="userAddContainer">新增</div>
                    <div>保存</div>
                    <div>删除</div>
                    <div>全部删除</div>
                  </div>
                </el-scrollbar>
              </div>
              <div class="user-footer">
                <div @click="returnSys">返回</div>
              </div>
            </div>
          </div>
          <div v-show="typeIndex == 1" class="box">
            <div class="displayer">
              <div
                class="displayer-item"
                :class="[
                  index % 2 ? 'deep' : 'shallow',
                  item.status == true ? 'disable' : '',
                  clickItemId == item.id ? 'show' : '',
                ]"
                :key="item.id"
                v-for="(item, index) in outputList"
                :id="item.id"
                @click="displayerClick(item)"
              >
                <div class="item-left">
                  <span class="id-text">{{ item.id + 1 }}</span>
                  <div class="icon-view">
                    <img
                      :src="
                        item.status
                          ? require('../../assets/disable/disHDMI2.0.png')
                          : require('../../assets/default/HDMI2.0.png')
                      "
                      alt=""
                    />
                  </div>
                  <span>{{ item.outputType }}</span>
                </div>
                <div class="item-right">
                  <span>W:{{ item.sizeW }}</span>
                  <span>H:{{ item.sizeH }}</span>
                </div>
              </div>
            </div>
            <div v-if="outputList.length == 0">无可用显示器</div>
          </div>
          <div v-show="typeIndex == 2">
            <template v-if="containerList.length > 0">
              <div
                class="system-info"
                v-for="(item, index) in containerList"
                :key="item.containerId"
              >
                <div class="sys-name">
                  <div class="left-view">
                    <span>{{ index + 1 }}</span>
                    <span class="text-view">
                      {{ item.name ? item.name : "显示容器" + (index + 1) }}
                    </span>
                    <input type="text" v-model="item.name" class="name-input" />
                  </div>
                  <div class="right-view" @click="clickEdit">
                    <img
                      src="../../assets/edit_name_icon.png"
                      alt=""
                      class="iconedit_name_icon"
                    />
                    <!-- <i class="iconfont iconedit_name_icon" /> -->
                  </div>
                  <div
                    class="right-view-sure"
                    @click="(e) => sureEdit(e, item)"
                  >
                    <img
                      src="../../assets/sure_edit.png"
                      alt=""
                      class="iconsure_edit"
                    />
                    <!-- <i class="iconfont iconsure_edit" /> -->
                  </div>
                </div>
                <div class="info-box">
                  <span>X:{{ item.posX }}</span>
                  <span>Y:{{ item.posY }}</span>
                  <span>W:{{ item.sizeW }}</span>
                  <span>H:{{ item.sizeH }}</span>
                </div>
              </div>
            </template>
            <template v-if="containerList.length == 0">
              <div class="empty-box">无已用容器</div>
            </template>
          </div>
          <div v-show="typeIndex == 3" style="padding: 0 12px">
            <div class="params-obj">
              <span>序号</span>
              <div>显示器xxxx</div>
            </div>
            <div class="params-style">缩放</div>
            <div class="params-style-input">
              <span>起始点X</span>
              <input
                type="text"
                v-model="startX"
                @input="(e) => changInput(e, 'startX')"
              />
            </div>
            <div class="params-style-input">
              <span>起始点Y</span>
              <input
                type="text"
                :value="startY"
                @input="(e) => changInput(e, 'startY')"
              />
            </div>
            <div class="params-style-input">
              <span>宽度</span>
              <input
                type="text"
                :value="displayerWidth"
                @input="(e) => changInput(e, 'dWidth')"
              />
            </div>
            <div class="params-style-input">
              <span>高度</span>
              <input
                type="text"
                :value="displayerHeight"
                @input="(e) => changInput(e, 'dHeight')"
              />
            </div>
            <div class="params-style">边框</div>
            <div class="params-style-input">
              <span>顶边框</span>
              <input type="text" v-model="vBorder" />
            </div>
            <div class="params-style-input">
              <span>底边框</span>
              <input type="text" v-model="vBorder" />
            </div>
            <div class="params-style-input">
              <span>左边框</span>
              <input type="text" v-model="hBorder" />
            </div>
            <div class="params-style-input">
              <span>右边框</span>
              <input type="text" v-model="hBorder" />
            </div>
          </div>
        </div>
        <div class="params-footer">
          <div v-if="typeIndex == 0" @click="userSetContainer">自定义</div>
          <div v-if="typeIndex == 2">清空全部</div>
          <div v-if="typeIndex == 3" @click="setDisplayProp">设置</div>
          <div @click="hideRightView">返回</div>
        </div>
      </div>
    </div>
    <BottomParams :display="displayObj" />
  </div>
</template>

<script>
  import Container from "@/components/container/Container";
  import { mapState } from "vuex";
  import { dataFormat } from "../../utils/dataFormat";
  import { customActive } from "../../utils/custom_active";
  import BottomParams from "@/components/BottomParams";

  export default {
    data() {
      return {
        containerList: [], // 容器列表
        outputList: [], // 显示器（输出口）列表
        typeIndex: 0, // 参数类型
        modelList: [
          { id: 0, label: "演示模式", type: "Presentation" },
          // { id: 1, label: '预监模式' , type: 'Preview'},
          // { id: 2, label: '矩阵模式' , type: 'Matrix'},
          // { id: 3, label: '旋转模式' , type: 'Rotation'},
          // { id: 4, label: '投影模式' , type: 'Blending'},
        ], // 模式列表
        modelVal: 0, // 模式
        separationList: [
          // { id: 10, label: '2k' },
          { id: 82, label: "4k" },
        ], // 分辨率列表
        separation: 82, // 分辨率
        outputCheck: true, // 容器是否创建显示器
        templateList: [
          {
            id: "11",
            name: "显示容器1",
            row: 1,
            col: 1,
          },
          {
            id: "12",
            name: "显示容器2",
            row: 1,
            col: 2,
          },
          {
            id: "13",
            name: "显示容器3",
            row: 1,
            col: 3,
          },
          {
            id: "14",
            name: "显示容器4",
            row: 1,
            col: 4,
          },
          {
            id: "21",
            name: "显示容器5",
            row: 2,
            col: 1,
          },
          {
            id: "22",
            name: "显示容器6",
            row: 2,
            col: 2,
          },
          {
            id: "23",
            name: "显示容器7",
            row: 2,
            col: 3,
          },
          {
            id: "24",
            name: "显示容器8",
            row: 2,
            col: 4,
          },
          {
            id: "31",
            name: "显示容器9",
            row: 3,
            col: 1,
          },
          {
            id: "32",
            name: "显示容器10",
            row: 3,
            col: 2,
          },
          {
            id: "33",
            name: "显示容器11",
            row: 3,
            col: 3,
          },
          {
            id: "34",
            name: "显示容器12",
            row: 3,
            col: 4,
          },
          {
            id: "41",
            name: "显示容器13",
            row: 4,
            col: 1,
          },
          {
            id: "42",
            name: "显示容器14",
            row: 4,
            col: 2,
          },
          {
            id: "43",
            name: "显示容器15",
            row: 4,
            col: 3,
          },
          {
            id: "44",
            name: "显示容器16",
            row: 4,
            col: 4,
          },
        ], // 模板列表
        clickItemId: null,
        selectedContainer: null,
        selectedDisplayerId: "",
        containerName: "",

        startX: "",
        startY: "",
        displayerWidth: "",
        displayerHeight: "",
        vBorder: "",
        hBorder: "",

        userSetStatus: false, // 用户自定义容器状态
        userSetData: {
          outputType: false,
          outputFlex: false,
          allW: 3840,
          allH: 2160,
          row: 1,
          col: 1,
          borderT: 0,
          borderR: 0,
          borderB: 0,
          borderL: 0,
          itemW: 3840,
          itemH: 2160,
        },
        sessionId: "",
        displayObj: null, // 点击显示器传递的显示器对象
      };
    },
    components: {
      Container,
      BottomParams,
    },
    props: ["showInfo", "nowMenuId"],
    computed: {
      ...mapState(["outputModelInfo"]),
      getCurContainer() {
        return dataFormat.curWindow || {};
      },
    },
    created() {},
    mounted() {
      this.init(); // 初始化
      this.sessionId = JSON.parse(window.sessionStorage.getItem("sessionId")); // 会话id
      this.readContainerMsg(); // 读取容器配置信息
      this.readOutputList(); // 读取输出口列表

      this.sortableInit(); // 显示器在容器内拖拽
      // websocket 接收到的消息
      const that = this;
      window.webSocket.onmessage = function(res) {
        const result = JSON.parse(res.data);
        // 获取容器
        if (result.code == 200 && result.data.eventType == "readContainerMsg") {
          if (result.data.count > 0) {
            that.containerList = result.data.container;
          } else {
            that.containerList = [];
          }
          that.$nextTick(() => {
            that.draggableInit(); // 容器拖拽
            that.droppableInit(); // 容器放置
          });
        }
        // 创建容器成功
        if (result.code == 200 && result.data.eventType == "createContainer") {
          that.$store.commit(
            "setContainerId",
            that.$store.state.containerId + 1
          ); // 创建成功，容器id修改成下个容器可用id
          // 重新读取容器列表
          that.readContainerMsg();
          that.$nextTick(() => {
            that.draggableInit(); // 容器拖拽
            that.droppableInit(); // 容器放置
          });
        }
        // 获取显示器（输出口）列表
        if (result.code == 200 && result.data.eventType == "readOutputList") {
          // x8设备处理
          let dataList = [];
          for (let i = 0; i < 6; i++) {
            dataList.push(result.data.output.slice(4 * i, 4 * (i + 1)));
          }
          let outputPorts = dataList.filter(
            (item, index) => that.outputModelInfo[index].hasOutputBoard
          );
          outputPorts.map((item) => {
            item.splice(2, 2);
          });
          that.outputList = outputPorts.flat();
          // 同步设置数据
          if (that.displayObj) {
            that.displayObj = that.outputList.filter(
              (item) => item.id == that.displayObj.id
            )[0];
          }
          that.$nextTick(() => {
            customActive.Draggable(".displayer .displayer-item", {
              connectToSortable: ".displayer-view",
              // handle: '.displayer-item',
              refreshPositions: true,
            });
            that.droppableInit(); // 容器放置
            that.sortableInit(); // 显示器在容器内拖拽
          });
        }
        // 设置显示器成功
        if (result.code == 200 && result.data.eventType == "setOutputMsg") {
          that.readOutputList();
        }
        // 删除容器成功
        if (result.code == 200 && result.data.eventType == "rmContainer") {
          // 重新读取输出口列表
          that.readContainerMsg();
          that.readOutputList();
        }
        // 删除显示器成功
        if (
          result.code == 200 &&
          result.data.eventType == "rmOutputFromContainer"
        ) {
          // 重新读取输出口列表
          that.readOutputList();
        }
        // 修改容器名
        if (result.code == 200 && result.data.eventType == "setContainerName") {
          // 重新读取容器列表
          that.readContainerMsg();
        }
      };
    },
    methods: {
      init() {
        // 拉出输出口
        customActive.Draggable(".displayer .displayer-item", {
          connectToSortable: ".displayer-view",
          // handle: '.displayer-item',
          refreshPositions: true,
        });
        // 拉出容器模板
        customActive.Draggable(".template-list .template-item", {
          connectToSortable: ".container-view",
        });

        // 创建容器
        const that = this;
        customActive.Droppable(
          ".container-view",
          {
            accept: ".template-item",
          },
          {
            drop: function(event, ui) {
              const templateId = $(ui.draggable[0]).attr("id");
              let templateObj = that.templateList.find(
                (value) => value.id == templateId
              ); // 拉出的模板信息
              // 容器id插空处理
              let containerIdArr = [];
              that.containerList.map((cItem) =>
                containerIdArr.push(cItem.containerId)
              ); // 已创建容器id集合
              const maxId = Math.max(...containerIdArr);
              let sortIdList = [];
              for (let i = 0; i <= maxId; i++) {
                sortIdList.push(i);
              }
              if (maxId >= 0) {
                sortIdList.some((item) => {
                  if (item == maxId) {
                    that.$store.commit("setContainerId", maxId + 1);
                    return true;
                  } else if (!containerIdArr.includes(item)) {
                    that.$store.commit("setContainerId", item);
                    return true;
                  }
                });
              } else {
                that.$store.commit("setContainerId", 0);
              }
              // 拉出容器所放位置
              const offset = {
                top: event.clientY - 66,
                left: event.clientX - 88,
              };
              // 根据分辨率设置基础宽高
              let separationW = 0;
              let separationH = 0;
              switch (that.separation) {
                case 10:
                  separationW = 1920;
                  separationH = 1080;
                  break;
                case 82:
                  separationW = 3840;
                  separationH = 2160;
                  break;
              }
              const containerW = templateObj.col * separationW;
              const containerH = templateObj.row * separationH;

              let mode = "";
              that.modelList.some((item) => {
                if (item.id === that.modelVal) {
                  mode = item.type;
                }
              });
              // 创建容器参数
              const params = {
                eventType: "createContainer", // 设置1个或多个容器
                count: 1, // 容器数量，最大不超过输出口数量，
                container: [
                  {
                    id: that.$store.state.containerId, // 容器id
                    posX: offset.left, // 容器左上角横坐标
                    posY: offset.top, // 容器左上角纵坐标
                    sizeW: containerW, // 容器总宽
                    sizeH: containerH, // 容器总高
                    mode, // 容器类型
                    modeEnum: that.modelVal, // 容器类型id
                  },
                ],
                sessionID: that.sessionId,
                checkKey: that.getcheckKey(),
              };
              // 是否填充显示器
              if (that.outputCheck) {
                const containerRow =
                  containerH / (that.separation == 10 ? 1080 : 2160); // 行数
                const containerCol =
                  containerW / (that.separation == 10 ? 1920 : 3840); // 列数
                let outputPosList = []; // 自动填充显示器的位置
                const baseW = that.separation == 10 ? 1920 : 3840;
                const baseH = that.separation == 10 ? 1080 : 2160;
                for (let i = 0; i < containerRow; i++) {
                  for (let j = 0; j < containerCol; j++) {
                    outputPosList.push({ posX: j * baseW, posY: i * baseH });
                  }
                }
                const createOutputNum = containerRow * containerCol; // 显示器填充的个数
                // 过滤出所选分辨率的输出口
                const conformOutputPortList = that.outputList.filter(
                  (item) =>
                    (that.separation == 10
                      ? item.sizeW == 1920
                      : item.sizeW == 3840) && item.status == false
                );
                console.log(conformOutputPortList);
                // return;
                const conformLen =
                  conformOutputPortList.length > createOutputNum
                    ? createOutputNum
                    : conformOutputPortList.length;
                let createOutputList = [];
                for (let i = 0; i < conformLen; i++) {
                  const outputItem = {
                    id: conformOutputPortList[i].id,
                    posX: outputPosList[i].posX,
                    posY: outputPosList[i].posY,
                    sizeW: conformOutputPortList[i].sizeW,
                    sizeH: conformOutputPortList[i].sizeH,
                    outputType: conformOutputPortList[i].outputType,
                    outputTypeEnum: conformOutputPortList[i].outputTypeEnum,
                    containerId: that.$store.state.containerId,
                  };
                  createOutputList.push(outputItem);
                }
                const outputParams = {
                  eventType: "setOutputMsg",
                  count: conformLen,
                  output: createOutputList,
                  sessionID: that.sessionId,
                  checkKey: that.getcheckKey(),
                };
                if (window.webSocket && window.webSocket.readyState == 1) {
                  window.webSocket.send(JSON.stringify(params));
                  window.webSocket.send(JSON.stringify(outputParams));
                }
              } else {
                //websocket 准备
                if (window.webSocket && window.webSocket.readyState == 1) {
                  window.webSocket.send(JSON.stringify(params));
                }
              }
            },
          }
        );

        // 监听删除容器事件
        this.$root.bus.$off("deleteContainer");
        this.$root.bus.$on("deleteContainer", (containerData) => {
          const params = {
            eventType: "rmContainer",
            count: 1,
            container: [{ id: containerData.containerId }],
            sessionID: this.sessionId,
            checkKey: this.getcheckKey("rmContainer"),
          };
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }
        });
        // 删除显示器
        this.$root.bus.$off("deleteDisplayer");
        this.$root.bus.$on("deleteDisplayer", (data) => {
          const params = {
            eventType: "rmOutputFromContainer",
            count: 1,
            output: [{ id: data.outputId }],
            sessionID: this.sessionId,
            checkKey: this.getcheckKey("rmOutputFromContainer"),
          };
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
            that.displayObj = null;
          }
        });

        // 标识当前操作的容器
        this.$root.bus.$off("setSelectedContainer");
        this.$root.bus.$on("setSelectedContainer", (data) => {
          this.selectedContainer = data;
        });

        // 点击显示器
        this.$root.bus.$off("clickDisplayer");
        this.$root.bus.$on("clickDisplayer", (data) => {
          this.selectedDisplayerId = data.id;
          this.displayObj = data;
          this.startX = data.posX;
          this.startY = data.posY;
          this.displayerWidth = data.sizeW;
          this.displayerHeight = data.sizeH;
        });

        // 底部参数设置显示器数据
        this.$root.bus.$off("setDisplayInfo");
        this.$root.bus.$on("setDisplayInfo", (data) => {
          const that = this;
          const display = {
            id: data.id,
            posX: Number(data.posX),
            posY: Number(data.posY),
            sizeW: Number(data.sizeW),
            sizeH: Number(data.sizeH),
            containerId: data.containerId,
            outputType: data.outputType,
            outputTypeEnum: data.outputTypeEnum,
          };
          const params = {
            eventType: "setOutputMsg",
            count: 1,
            output: [display],
            sessionID: that.sessionId,
            checkKey: that.getcheckKey(),
          };
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }
        });
      },

      // 模板模块自定义点击
      userSetContainer() {
        this.userSetStatus = true;
      },
      // 用户新增自定义容器
      userAddContainer() {
        const { allW, allH, row, col } = this.userSetData;
        const dataW = Number(allW);
        const dataH = Number(allH);
        const dataRow = Number(row);
        const dataCol = Number(col);
        if (dataW && dataH && dataRow && dataCol) {
          // 容器宽高，显示器行列必填
          // 创建容器参数
          const params = {
            eventType: "createContainer", // 设置1个或多个容器
            count: 1, // 容器数量，最大不超过输出口数量，
            container: [
              {
                id: this.$store.state.containerId, // 容器id
                posX: 30, // 容器左上角横坐标
                posY: 30, // 容器左上角纵坐标
                sizeW: Number(this.userSetData.allW), // 容器总宽
                sizeH: Number(this.userSetData.allWH), // 容器总高
                mode, // 容器类型
                modeEnum: this.modelVal, // 容器类型id
              },
            ],
            sessionID: this.sessionId,
            checkKey: this.getcheckKey(),
          };
          if (!this.userSetData.outputFlex) {
            let outputPosList = []; // 自动填充显示器的位置
            for (let i = 0; i < dataRow; i++) {
              for (let j = 0; j < dataCol; j++) {
                outputPosList.push({
                  posX: j * (dataW / dataCol),
                  posY: i * (dataH / dataRow),
                });
              }
            }
            const createOutputNum = dataRow * dataCol; // 显示器填充的个数
            // 过滤出所选分辨率的输出口
            const conformOutputPortList = this.outputList.filter(
              item.status == false
            );
            const conformLen =
              conformOutputPortList.length > createOutputNum
                ? createOutputNum
                : conformOutputPortList.length;
            let createOutputList = [];
            for (let i = 0; i < conformLen; i++) {
              const outputItem = {
                id: conformOutputPortList[i].id,
                posX: outputPosList[i].posX,
                posY: outputPosList[i].posY,
                sizeW: conformOutputPortList[i].sizeW,
                sizeH: conformOutputPortList[i].sizeH,
                outputType: conformOutputPortList[i].outputType,
                outputTypeEnum: conformOutputPortList[i].outputTypeEnum,
                containerId: this.$store.state.containerId,
              };
              createOutputList.push(outputItem);
            }
            const outputParams = {
              eventType: "setOutputMsg",
              count: conformLen,
              output: createOutputList,
              sessionID: this.sessionId,
              checkKey: this.getcheckKey(),
            };
            if (window.webSocket && window.webSocket.readyState == 1) {
              window.webSocket.send(JSON.stringify(params));
              window.webSocket.send(JSON.stringify(outputParams));
            }
          }
        }
      },
      returnSys() {
        this.userSetStatus = false;
      },

      // 读取容器配置信息
      readContainerMsg() {
        const params = {
          eventType: "readContainerMsg",
          checkKey: this.getcheckKey(),
          sessionID: this.sessionId,
        };
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      },
      // 获取显示器列表
      readOutputList() {
        const randoms = this.getcheckKey();
        const params = {
          eventType: "readOutputList",
          sessionID: this.sessionId,
          checkKey: randoms,
        };
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      },
      // 容器中所填充显示器
      setOutputList(containerId) {
        const list = this.outputList.filter(
          (item) => item.status == true && item.containerId == containerId
        );
        return list;
      },

      // 右侧 -- 点击设置，修改显示器数据
      setDisplayProp() {
        let display = this.displayObj;
        if (display) {
          display.sizeW = this.displayerWidth
            ? this.displayerWidth
            : display.sizeW;
          display.sizeH = this.displayerHeight
            ? this.displayerHeight
            : display.sizeH;
          display.posX = this.startX ? this.startX : display.posX;
          display.posY = this.startY ? this.startY : display.posY;

          const output = {
            id: display.id,
            posX: Number(display.posX),
            posY: Number(display.posY),
            sizeW: Number(display.sizeW),
            sizeH: Number(display.sizeH),
            containerId: display.containerId,
            outputType: display.outputType,
            outputTypeEnum: display.outputTypeEnum,
          };
          const params = {
            eventType: "setOutputMsg",
            count: 1,
            output: [output],
            sessionID: this.sessionId,
            checkKey: this.getcheckKey(),
          };
          if (window.webSocket && window.webSocket.readyState == 1) {
            window.webSocket.send(JSON.stringify(params));
          }
        }
      },
      // 输入框事件
      changInput(e, type) {
        let val = e.target.value
          .trim()
          .replace(/\D/gi, "")
          .replace(/^[0]/, 1);
        if (type == "startX") {
          this.startX = val;
        }
        if (type == "startY") {
          this.startY = val;
        }
        if (type == "dWidth") {
          this.displayerWidth = val;
        }
        if (type == "dHeight") {
          this.displayerHeight = val;
        }
        this.$forceUpdate();
      },
      // 生成随机随机checkKey
      getcheckKey(type) {
        let arr = new Array();
        const arr1 = new Array(
          "0",
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9"
        );
        let nonceStr = "";
        for (var i = 0; i < 8; i++) {
          var n = Math.floor(Math.random() * 10);
          arr[i] = arr1[n];
          nonceStr += arr1[n];
        }
        return parseInt(nonceStr);
      },
      // 容器参数类型切换
      typeSelect(num) {
        this.typeIndex = num;
      },

      // 点击显示系统编辑图标
      clickEdit(e) {
        $(e.target)
          .parents(".system-info")
          .find(".name-input")
          .show();
        $(e.target)
          .parents(".system-info")
          .find(".text-view")
          .hide();
        $(e.target)
          .parents(".system-info")
          .find(".right-view-sure")
          .css("display", "flex");
        $(e.target)
          .parents(".system-info")
          .find(".right-view")
          .hide();
      },
      // 点击显示系统确认编辑图标
      sureEdit(e, containerObj) {
        $(e.target)
          .parents(".system-info")
          .find(".name-input")
          .hide();
        $(e.target)
          .parents(".system-info")
          .find(".text-view")
          .show();
        $(e.target)
          .parents(".system-info")
          .find(".right-view-sure")
          .hide();
        $(e.target)
          .parents(".system-info")
          .find(".right-view")
          .show();
        const params = {
          eventType: "setContainerName",
          count: 1,
          container: [
            {
              id: containerObj.containerId,
              name: containerObj.name,
            },
          ],
          sessionID: this.sessionId,
          checkKey: this.getcheckKey(),
        };
        if (window.webSocket && window.webSocket.readyState == 1) {
          window.webSocket.send(JSON.stringify(params));
        }
      },
      // 点击显示器
      displayerClick(obj) {
        if (obj.status == true) return;
        this.clickItemId = obj.id;
      },
      // 容器移动
      draggableInit() {
        const that = this;
        $(".container-view .container-component").draggable({
          connectToSortable: ".container-view",
          containment: [88, 66, Infinity, Infinity],
          scroll: false,
          handle: ".container-header",
          zIndex: 100,
          stop: function(event, ui) {
            const containerId = $(this).attr("containerId");
            const container = that.containerList.find(
              (item) => item.containerId == containerId
            );
            const params = {
              eventType: "createContainer", // 设置1个或多个容器
              count: 1, // 容器数量，最大不超过输出口数量，
              container: [
                {
                  id: Number(containerId), // 容器id
                  posX: Math.round(ui.position.left), // 容器左上角横坐标
                  posY: Math.round(ui.position.top), // 容器左上角纵坐标
                  sizeW: container.sizeW, // 容器总宽
                  sizeH: container.sizeH, // 容器总高
                  mode: container.mode, // 容器类型
                  modeEnum: container.modeEnum, // 容器类型id
                },
              ],
              sessionID: that.sessionId,
              checkKey: that.getcheckKey(),
            };
            if (window.webSocket && window.webSocket.readyState == 1) {
              window.webSocket.send(JSON.stringify(params));
            }
          },
        });
      },

      // 容器放置
      droppableInit() {
        const that = this;
        $(".displayer-box, .displayer-view").droppable({
          accept: ".displayer-item",
          greedy: true,
          over: function() {},
          drop: function(event, ui) {
            const containerId = $(this).attr("containerId");
            const outputId = $(ui.draggable[0]).attr("id"); // 被拖出的显示器id
            let container = that.containerList.find(
              (cItem) => cItem.containerId == containerId
            );
            // 目标显示器
            let outputObj = that.outputList.find((item) => item.id == outputId);
            // 放置在容器上新增显示器
            if ($(this).hasClass("displayer-box")) {
              const outputPosX =
                event.clientX - 88 - container.posX - $(this)[0].offsetLeft;
              const outputPosY =
                event.clientY - 66 - container.posY - $(this)[0].offsetTop;
              const display = {
                id: outputObj.id,
                posX: outputPosX * 10,
                posY: outputPosY * 10,
                sizeW: outputObj.sizeW,
                sizeH: outputObj.sizeH,
                containerId: container.containerId,
                outputType: outputObj.outputType,
                outputTypeEnum: outputObj.outputTypeEnum,
              };
              const params = {
                eventType: "setOutputMsg",
                count: 1,
                output: [display],
                sessionID: that.sessionId,
                checkKey: that.getcheckKey(),
              };

              if (window.webSocket && window.webSocket.readyState == 1) {
                window.webSocket.send(JSON.stringify(params));
              }
            }
            // 放置在显示器上，替换显示器
            if ($(this).hasClass("displayer-view")) {
              const oldOutput = that.outputList.find(
                (dItem) => dItem.id == $(this).attr("id")
              ); // 被放置的显示器
              const maxX = container.posX + container.sizeW;
              const maxY = container.posY + container.sizeH + 24; // + 24 为容器头部高度
              const safeAreaX = [container.posX, maxX]; // 容器
              const safeAreaY = [container.posY, maxY];
              const droppleX = event.clientX - 88;
              const droppleY = event.clientY - 66;
              if (
                droppleX >= safeAreaX[0] &&
                droppleX <= safeAreaX[1] &&
                droppleY >= safeAreaY[0] &&
                droppleY <= safeAreaY[1]
              ) {
                const display = {
                  id: outputObj.id,
                  posX: oldOutput.posX,
                  posY: oldOutput.posY,
                  sizeW: outputObj.sizeW,
                  sizeH: outputObj.sizeH,
                  containerId: container.containerId,
                  outputType: outputObj.outputType,
                  outputTypeEnum: outputObj.outputTypeEnum,
                };
                const deleteOutput = {
                  id: oldOutput.id,
                  posX: oldOutput.posX,
                  posY: oldOutput.posY,
                  sizeW: oldOutput.sizeW,
                  sizeH: oldOutput.sizeH,
                  containerId: 0xff,
                  outputType: oldOutput.outputType,
                  outputTypeEnum: oldOutput.outputTypeEnum,
                };
                const params = {
                  eventType: "setOutputMsg",
                  count: 2,
                  output: [display, deleteOutput],
                  sessionID: that.sessionId,
                  checkKey: that.getcheckKey(),
                };
                if (window.webSocket && window.webSocket.readyState == 1) {
                  window.webSocket.send(JSON.stringify(params));
                }
              } else {
                console.log("范围外");
              }
            }
          },
        });
      },
      // 显示器在容器内拖拽
      sortableInit() {
        const that = this;
        $(".displayer-box .displayer-view").draggable({
          // containment: 'parent',
          delay: 100,
          snap: ".displayer-box",
          snapMode: "inner",
          snapTolerance: 10,
          scroll: false,
          zIndex: 100,
          stop: function(event, ui) {
            let container = that.containerList.find(
              (cItem) => cItem.containerId == $(this).attr("containerId")
            ); // 所在容器
            const outputId = $(this).attr("id"); // 被拖拽显示器id
            let outputObj = that.outputList.find(
              (dItem) => dItem.id == outputId
            );
            outputObj.posX = Math.round(ui.position.left * 10);
            outputObj.posY = Math.round(ui.position.top * 10);
            // outputObj.posX = Math.round(ui.position.left * 10) < 0 ? 0 : Math.round(ui.position.left * 10);
            // outputObj.posY = Math.round(ui.position.top * 10) < 0 ? 0 : Math.round(ui.position.top * 10);
            // console.log(outputObj.posX, outputObj.posY);
            // return;

            // 下发显示器参数
            const display = {
              id: outputObj.id,
              posX: outputObj.posX,
              posY: outputObj.posY,
              sizeW: outputObj.sizeW,
              sizeH: outputObj.sizeH,
              containerId: container.containerId,
              outputType: outputObj.name,
              outputTypeEnum: outputObj.outputTypeEnum,
            };

            const params = {
              eventType: "setOutputMsg",
              count: 1,
              output: [display],
              sessionID: that.sessionId,
              checkKey: that.getcheckKey(),
            };
            if (window.webSocket && window.webSocket.readyState == 1) {
              window.webSocket.send(JSON.stringify(params));
            }
          },
        });
      },
      setSelectedContainer(container) {
        this.selectedContainer = container;
      },
      hideRightView() {
        this.$root.bus.$emit("hideRightView");
      },
    },
    watch: {
      getCurContainer(oVal) {
        console.log(oVal);
      },
    },
  };
</script>

<style scoped lang="less">
  .el-select-dropdown__item.selected {
    color: rgb(26, 188, 156);
  }
  .manageShow-wrap {
    position: relative;
    flex: 1;
    display: flex;
    background: rgb(27, 36, 54);
    color: #fff;
    height: calc(100% - 96px);
    flex-direction: column;
    .section {
      display: flex;
      flex: 1;
      .container-view {
        position: relative;
        padding: 24px;
        overflow: auto;
        flex: 1;
        > .ghost {
          display: none !important;
        }
        > .default-view {
          height: 100%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #999;
          .title {
            width: 320px;
            text-align: center;
            margin-bottom: 20px;
          }
          .tips-box {
            padding-top: 12px;
            border-top: 1px solid #999;
            .tips-item {
              display: flex;
              flex-direction: column;
              margin-top: 12px;
              div {
                span {
                  margin-left: 20px;
                }
              }
              em {
                padding-left: 28px;
                font-style: normal;
                margin-top: 8px;
                span {
                  margin-left: 16px;
                }
              }
            }
          }
        }
        > .container-box {
          position: relative;
          box-sizing: border-box;
        }
      }
      .right-view {
        position: relative;
        width: 320px;
        height: 100%;
        background: rgb(22, 28, 44);
        border-left: 1px solid #000;
        .params-type {
          position: relative;
          width: 320px;
          height: 32px;
          border-top: 1px solid #000;
          white-space: nowrap;
          /deep/.el-scrollbar {
            height: 100%;
            .el-scrollbar__wrap {
              overflow-x: hidden;
              overflow-y: hidden;
              width: 100%;
              div {
                display: inline-block;
                width: 100px;
                height: 32px;
                line-height: 32px;
                flex-shrink: 0;
                border-right: 1px solid #000;
                border-bottom: 1px solid #000;
                text-align: center;
                color: #999;
                font-size: 12px;
                box-sizing: border-box;
                background: rgb(24, 30, 44);
              }
              .show {
                position: relative;
                background: rgb(22, 28, 44);
                color: #fff;
                border-bottom: none;
              }
              .show::before {
                display: block;
                content: "";
                position: absolute;
                width: 100px;
                height: 1px;
                top: 0;
                background: rgb(26, 188, 156);
              }
            }
          }
        }
        .params-conts {
          > div {
            padding-top: 16px;
            .input-view {
              display: flex;
              align-items: center;
              padding: 0 32px;
              margin-bottom: 16px;
              span {
                width: 80px;
                color: #ccc;
                flex-shrink: 0;
                font-size: 12px;
              }
              /deep/ .el-input__inner {
                width: 108px;
                height: 24px;
              }
              /deep/ .el-input__icon {
                line-height: 24px;
              }
              .mar-left {
                margin-left: 12px;
                /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
                  background: rgb(26, 188, 156);
                  border-color: rgb(26, 188, 156);
                }
                /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
                  color: rgb(26, 188, 156);
                }
              }
            }
          }
          .template-list {
            padding-top: 16px;
            .template-item {
              display: flex;
              align-items: center;
              padding: 0 16px;
              color: #999;
              font-size: 12px;
              margin-bottom: 12px;
              cursor: move;
              .index-text {
                width: 16px;
              }
              .icon-view {
                width: 24px;
                height: 24px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                margin-left: 24px;
                margin-right: 48px;
              }
              .create-container {
                margin-left: 16px;
                padding: 2px 12px;
                border-radius: 4px;
                background: rgb(26, 188, 156);
                color: #fff;
                cursor: pointer;
              }
            }
          }
          .user-section {
            /deep/ .el-scrollbar__wrap {
              overflow-x: hidden;
            }
            position: absolute;
            bottom: 0;
            top: 94px;
            width: 100%;
            background: rgb(22, 28, 44);
            z-index: 99;
            .user-save-containers {
              height: 120px;
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
            }
            .set-view {
              height: 500px;
              .mesg {
                display: flex;
                height: 32px;
                padding: 0 16px;
                align-items: center;
                font-size: 12px;
                > span {
                  width: 80px;
                }
              }
              .params-style-input {
                padding: 0 16px;
              }
              .btn-view {
                margin-top: 10px;
                height: 32px;
                border-top: 1px solid #000;
                display: flex;
                align-items: center;
                padding: 0 16px;
                justify-content: space-between;
                div {
                  width: 64px;
                  height: 24px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  background: rgb(0, 196, 172);
                  border-radius: 14px;
                  color: #fff;
                  font-size: 12px;
                  cursor: pointer;
                }
              }
            }
            .blue-text {
              padding-left: 10px;
              color: rgb(2, 163, 211);
              font-size: 12px;
            }
            .user-footer {
              position: absolute;
              bottom: 0;
              border-top: 1px solid #000;
              display: flex;
              width: 100%;
              height: 40px;
              justify-content: flex-end;
              align-items: center;
              > div {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 78px;
                height: 20px;
                margin-right: 16px;
                background: rgb(26, 188, 156);
                border-radius: 10px;
                color: #fff;
                font-size: 12px;
                cursor: pointer;
              }
            }
          }
          .displayer-item {
            padding: 0 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 24px;
            color: #999;
            font-size: 12px;
            > div {
              display: flex;
              align-items: center;
              .id-text {
                width: 20px;
              }
              .icon-view {
                width: 42px;
                height: 16px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                margin: 0 16px;
                cursor: pointer;
              }
            }
            .item-right {
              span {
                margin-left: 16px;
              }
            }
          }
          .deep {
            background: rgb(22, 28, 44);
          }
          .shallow {
            background: rgb(24, 31, 48);
          }
          .disable {
            color: rgb(40, 42, 49);
            background: rgb(16, 21, 35);
            > div {
              .icon-view {
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
          }
          .show {
            color: #fff;
            background: rgb(23, 76, 78);
          }
          .displayer-item:hover {
            color: #fff;
            background: rgb(22, 48, 58);
          }
          .disable:hover {
            color: #999;
            background: rgb(16, 21, 35);
          }
          .show:hover {
            background: rgb(23, 76, 78);
          }
          .empty-box {
            padding: 8px;
            color: #fff;
            font-size: 12px;
          }
          .system-info {
            padding: 10px 0;
            font-size: 12px;
            color: #999;
            background: rgb(24, 31, 48);
            > div {
              display: flex;
              align-items: center;
            }
            .sys-name {
              justify-content: space-between;
              padding: 0 12px;
              margin-bottom: 8px;
              height: 24px;
              .left-view {
                flex: 1;
                display: flex;
                align-items: center;
                span {
                  margin-right: 10px;
                }
                input {
                  display: none;
                  width: 106px;
                  padding: 4px 0;
                  border: 1px solid springgreen;
                  background: rgb(22, 28, 44);
                  border-radius: 4px;
                  appearance: none;
                  outline: none;
                  color: #fff;
                  text-indent: 1em;
                  font-size: 12px;
                }
              }
              .right-view,
              .right-view-sure {
                width: 20px;
                height: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgb(0, 196, 172);
                border-radius: 4px;
                cursor: pointer;
                img {
                  width: 12px;
                  height: 12px;
                }
                i {
                  color: #fff;
                  font-size: 12px;
                }
              }
              .right-view-sure {
                display: none;
              }
            }
            .info-box {
              span {
                display: flex;
                flex: 1;
                justify-content: center;
                align-items: center;
              }
            }
          }
          .system-info:hover {
            background: rgb(22, 48, 58);
            color: #fff;
          }
          .params-obj,
          .params-style,
          .params-style-input {
            display: flex;
            align-items: center;
            font-size: 12px;
          }
          .params-obj {
            height: 36px;
            border-bottom: 1px solid #000;
            span {
              width: 80px;
            }
            div {
              color: rgb(26, 169, 143);
            }
          }
          .params-style {
            height: 28px;
            color: rgb(8, 159, 186);
          }
          .params-style-input {
            margin-top: 10px;
            span {
              width: 80px;
            }
            input {
              width: 120px;
              border: 1px solid rgb(52, 73, 94);
              border-radius: 4px;
              background: rgb(22, 28, 44);
              padding: 6px 8px;
              color: #fff;
              font-size: 12px;
              outline: none;
              appearance: none;
            }
            input:focus {
              border: 1px solid rgb(26, 188, 156);
            }
          }
        }
        .params-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          border-top: 1px solid #333;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          > div {
            width: 100px;
            height: 24px;
            margin-right: 12px;
            border-radius: 12px;
            line-height: 24px;
            text-align: center;
            background: rgb(26, 188, 156);
            color: #fff;
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
    }
  }
</style>
