<template>
  <div class="dialog-container">
    <div class="dialog-box">
      <div class="header">
        <h2>姓名定位小程序</h2>
      </div>
      <div class="content">
        <div class="search-bar">
          <input 
            v-model="searchInitials" 
            placeholder="请输入姓名拼音首字母" 
            class="search-input"
            ref="searchInitialsInput"
            @keyup.enter="onNameLocatedClick"  
          />
          <input 
            v-model="grade" 
            placeholder="请输入成绩" 
            class="search-input"
            @keyup.enter="onNameLocatedClick"  
          />
        </div>
        <div v-if="matchCount > 0" class="match-info">
          <p>匹配结果：{{ currentIndex + 1 }}/{{ matchCount }}</p>
          <div v-if="matchCount > 1" class="navigation-buttons">
            <button @click="navigateMatch('previous')" class="navigate-button">⬆ 上一行</button>
            <button @click="navigateMatch('next')" class="navigate-button">⬇ 下一行</button>
          </div>
        </div>
        <div v-else-if="searchPerformed" class="no-matches">
          <p>未找到符合条件的姓名</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import dlgFunc from './js/dialog.js';

export default {
  name: 'Dialog',
  data() {
    return {
      searchInitials: '',
      grade: '', // 成绩
      searchPerformed: false, // 是否执行过搜索
      matchCount: 0, // 匹配结果总数
      currentIndex: -1, // 当前匹配索引
      matches: [], // 存储匹配项
    };
  },
  methods: {
    // 搜索按钮点击事件
    onNameLocatedClick() {
      const result = dlgFunc.onbuttonclick(this.searchInitials);  // 获取匹配结果
      if (result && result.count > 0) {
        this.matchCount = result.count;
        this.matches = result.matches;
        this.currentIndex = result.foundIndex;
        this.searchPerformed = true;
      } else {
        this.matchCount = 0;
        this.matches = [];
        this.currentIndex = -1;
        this.searchPerformed = true;
      }
      if(this.matchCount>1){
        alert(`有同首字母的兄弟，手动介入一下吧`)

      }else{
        // 调用 gradesubmit
      const param = {
        row: this.matches[this.currentIndex].row, // 设置键名 row，值为 this.matches[0].row
        grade: this.grade // 设置键名 grade，值为 this.grade
      };

      dlgFunc.gradesubmit(param);  // 执行成绩录入

      // 清空输入框
      this.searchInitials = '';
      this.grade = '';

      // 重新设置输入框焦点，强制恢复到对话框
  this.$nextTick(() => {
    this.$refs.searchInitialsInput.blur(); // 确保输入框状态被刷新
    setTimeout(() => {
      this.$refs.searchInitialsInput.focus(); // 强制回到输入框
    }, 0);
  });
      }
    },

    // 导航到上一行或下一行
    navigateMatch(direction) {
      if (this.matches.length > 0) {
        const param = {
          direction,
          matches: this.matches,
          currentMatchIndex: this.currentIndex,
        };
        const result = dlgFunc.navigateMatch(param);  // 传递参数给定位函数
        if (result && result.foundIndex !== undefined) {
          this.currentIndex = result.foundIndex;
        }
      }
    },
  },
};
</script>


<style scoped>
 body {
      background-color: rgba(0, 0, 0, 0.4);  /* 半透明背景 */
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      font-family: Arial, sans-serif;
    }

    /* 对话框的样式 */
    .dialog {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      width: 80%;
      max-width: 600px;
      padding: 30px;
      transform: scale(0.95);
      transition: transform 0.3s ease-out;
    }

    /* 标题样式 */
    .dialog h1 {
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
    }

    /* 文字内容样式 */
    .dialog p {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }

    /* 按钮样式 */
    .dialog button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .dialog button:hover {
      background-color: #2980b9;
    }

    /* 对话框关闭按钮 */
    .dialog .close-btn {
      background-color: #e74c3c;
      margin-top: 20px;
    }

    /* 响应式设计，适配不同屏幕尺寸 */
    @media (max-width: 600px) {
      .dialog {
        width: 90%;
        padding: 20px;
      }
      .dialog h1 {
        font-size: 20px;
      }
      .dialog p {
        font-size: 14px;
      }
    }

</style>
