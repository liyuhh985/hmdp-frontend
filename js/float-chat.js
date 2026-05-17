/**
 * AI 助手浮动组件
 * 使用方法：在任意页面引入此 JS 文件即可显示浮动按钮
 * <script src="/js/float-chat.js"></script>
 */

(function() {
  // 创建样式
  const style = document.createElement('style');
  style.textContent = `
    /* 浮动按钮 */
    .float-chat-btn {
      position: fixed;
      right: 20px;
      bottom: 80px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9998;
      transition: opacity 0.3s, left 0.3s, right 0.3s;
      font-size: 16px;
      font-weight: bold;
      color: white;
      letter-spacing: 1px;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }
    .float-chat-btn:active {
      transform: scale(0.95);
    }
    .float-chat-btn.dragging {
      transition: none;
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(255, 107, 53, 0.5);
    }
    .float-chat-btn.hidden-left {
      left: -28px !important;
      right: auto !important;
      opacity: 0.5;
    }
    .float-chat-btn.hidden-right {
      right: -28px !important;
      left: auto !important;
      opacity: 0.5;
    }
    
    /* 弹窗容器 */
    .float-chat-popup {
      position: fixed;
      right: 20px;
      bottom: 150px;
      width: 340px;
      max-width: calc(100vw - 40px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s ease;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .float-chat-popup.show {
      display: flex;
    }
    
    /* 弹窗头部 */
    .float-chat-header {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      padding: 12px 15px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .float-chat-title {
      color: white;
      font-size: 15px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .float-chat-title svg {
      width: 20px;
      height: 20px;
      fill: white;
    }
    .float-chat-actions {
      display: flex;
      gap: 10px;
    }
    .float-chat-action {
      color: white;
      font-size: 12px;
      padding: 4px 10px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      cursor: pointer;
    }
    .float-chat-action:hover {
      background: rgba(255,255,255,0.3);
    }
    
    /* 弹窗内容 */
    .float-chat-content {
      flex: 1;
      padding: 15px;
      max-height: 300px;
      overflow-y: auto;
      background: #f8f8f8;
    }
    
    /* 欢迎消息 */
    .float-chat-welcome {
      text-align: center;
      padding: 20px 10px;
    }
    .float-chat-welcome-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px;
    }
    .float-chat-welcome-icon svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    .float-chat-welcome-title {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }
    .float-chat-welcome-desc {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
    
    /* 消息气泡 */
    .float-chat-msg {
      margin-bottom: 12px;
      display: flex;
      animation: msgFade 0.3s ease;
    }
    @keyframes msgFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .float-chat-msg.user { justify-content: flex-end; }
    .float-chat-msg.ai { justify-content: flex-start; }
    .float-chat-msg-text {
      max-width: 80%;
      padding: 8px 12px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.4;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    .float-chat-msg.user .float-chat-msg-text {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      color: white;
      border-bottom-right-radius: 6px;
    }
    .float-chat-msg.ai .float-chat-msg-text {
      background: white;
      color: #333;
      border-bottom-left-radius: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    
    /* 快捷问题 */
    .float-chat-quick {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 10px 0;
    }
    .float-chat-quick-item {
      background: #fff6f0;
      color: #ff6b35;
      padding: 6px 12px;
      border-radius: 15px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid rgba(255,107,53,0.15);
    }
    .float-chat-quick-item:hover {
      background: #ffebe0;
    }
    
    /* 输入区域 */
    .float-chat-input-area {
      padding: 10px 12px;
      background: white;
      display: flex;
      gap: 8px;
      border-top: 1px solid #f0f0f0;
    }
    .float-chat-input {
      flex: 1;
      background: #f5f5f5;
      border: none;
      border-radius: 18px;
      padding: 8px 14px;
      font-size: 13px;
      outline: none;
    }
    .float-chat-input:focus {
      background: white;
      box-shadow: 0 0 0 2px rgba(255,107,53,0.2);
    }
    .float-chat-send {
      background: linear-gradient(135deg, #ff6b35 0%, #ff8c42 100%);
      color: white;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .float-chat-send:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .float-chat-send svg {
      width: 16px;
      height: 16px;
      fill: white;
    }
  `;
  document.head.appendChild(style);
  
  // 创建浮动按钮
  const floatBtn = document.createElement('div');
  floatBtn.className = 'float-chat-btn';
  floatBtn.innerHTML = `AI`;
  floatBtn.title = 'AI 智能助手（双击隐藏）';
  document.body.appendChild(floatBtn);
  
  // 创建弹窗
  const popup = document.createElement('div');
  popup.className = 'float-chat-popup';
  popup.innerHTML = `
    <div class="float-chat-header">
      <div class="float-chat-title">
        <svg viewBox="0 0 1024 1024">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z"/>
        </svg>
        AI 智能助手
      </div>
      <div class="float-chat-actions">
        <div class="float-chat-action" onclick="window.open('/chat.html', '_self')">展开</div>
        <div class="float-chat-action" id="floatChatClose">关闭</div>
      </div>
    </div>
    <div class="float-chat-content" id="floatChatContent">
      <div class="float-chat-welcome">
        <div class="float-chat-welcome-icon">
          <svg viewBox="0 0 1024 1024">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z"/>
          </svg>
        </div>
        <div class="float-chat-welcome-title">你好，我是 AI 助手</div>
        <div class="float-chat-welcome-desc">点击下方快捷问题或直接输入</div>
      </div>
      <div class="float-chat-quick">
        <div class="float-chat-quick-item" data-msg="推荐附近好吃的火锅店">推荐火锅店</div>
        <div class="float-chat-quick-item" data-msg="帮我写一篇探店笔记">写探店笔记</div>
        <div class="float-chat-quick-item" data-msg="有什么优惠活动？">优惠活动</div>
      </div>
    </div>
    <div class="float-chat-input-area">
      <input type="text" class="float-chat-input" id="floatChatInput" placeholder="输入你的问题..." />
      <button class="float-chat-send" id="floatChatSend">
        <svg viewBox="0 0 1024 1024">
          <path d="M931.4 498.9L94.9 79.5c-13.4-6.3-28.9-2.3-37.5 9.7-8.6 12-7 28.3 3.9 38.5L387 413.5c7.1 6.7 17.5 8.5 26.5 4.7l354.6-152.8c10.3-4.4 22.1 0.4 26.5 10.7 4.4 10.3-0.4 22.1-10.7 26.5L429.5 455.4c-9 3.9-15 12.5-15 22.3v330.6c0 14.4 11.7 26.1 26.1 26.1 8.8 0 16.9-4.4 21.8-11.7l181.9-272.9 298.4 245.6c10.9 8.9 26.7 8.3 37-1.4 10.2-9.7 11.7-25.4 3.6-36.8L548.8 498.9c-7.5-10.5-6-24.9 3.6-33.6l372-333.4c11.3-10.1 12.3-27.5 2.2-38.8-10.1-11.3-27.5-12.3-38.8-2.2L518.4 422.7c-9.4 8.4-23.7 8.4-33.1 0L153.1 116.5c-11.3-10.1-28.7-9.1-38.8 2.2-10.1 11.3-9.1 28.7 2.2 38.8l372 333.4c9.6 8.7 11.1 23.1 3.6 33.6z"/>
        </svg>
      </button>
    </div>
  `;
  document.body.appendChild(popup);
  
  // ========== 状态管理 ==========
  let isOpen = false;
  let messages = [];
  let isDragging = false;
  let hasMoved = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let btnStartX = 0;
  let btnStartY = 0;
  let lastClickTime = 0;
  
  const STORAGE_KEY = 'floatChatPosition';
  
  // ========== 位置管理 ==========
  function savePosition() {
    const rect = floatBtn.getBoundingClientRect();
    const data = {
      x: rect.left,
      y: rect.top,
      hidden: floatBtn.classList.contains('hidden-left') ? 'left' : 
              floatBtn.classList.contains('hidden-right') ? 'right' : null
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  
  function loadPosition() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        floatBtn.style.left = data.x + 'px';
        floatBtn.style.top = data.y + 'px';
        floatBtn.style.right = 'auto';
        floatBtn.style.bottom = 'auto';
        
        if (data.hidden === 'left') {
          floatBtn.classList.add('hidden-left');
        } else if (data.hidden === 'right') {
          floatBtn.classList.add('hidden-right');
        }
      } catch (e) {
        // 解析失败，使用默认位置
      }
    }
  }
  
  // ========== 按钮位置 ==========
  function setBtnPosition(x, y) {
    const maxX = window.innerWidth - 56;
    const maxY = window.innerHeight - 56;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));
    floatBtn.style.left = x + 'px';
    floatBtn.style.top = y + 'px';
    floatBtn.style.right = 'auto';
    floatBtn.style.bottom = 'auto';
  }
  
  // ========== 隐藏/显示 ==========
  function hideBtn() {
    const rect = floatBtn.getBoundingClientRect();
    const centerX = rect.left + 28;
    
    floatBtn.classList.remove('hidden-left', 'hidden-right');
    
    if (centerX < window.innerWidth / 2) {
      floatBtn.classList.add('hidden-left');
    } else {
      floatBtn.classList.add('hidden-right');
    }
    
    savePosition();
  }
  
  function showBtn() {
    const rect = floatBtn.getBoundingClientRect();
    const wasHiddenLeft = floatBtn.classList.contains('hidden-left');
    floatBtn.classList.remove('hidden-left', 'hidden-right');
    
    // 从隐藏位置移出到可见区域
    if (wasHiddenLeft) {
      setBtnPosition(20, rect.top);
    } else {
      setBtnPosition(window.innerWidth - 76, rect.top);
    }
    
    savePosition();
  }
  
  function isHidden() {
    return floatBtn.classList.contains('hidden-left') || floatBtn.classList.contains('hidden-right');
  }
  
  // ========== 弹窗管理 ==========
  function togglePopup() {
    if (hasMoved) return;
    if (isHidden()) {
      showBtn();
      return;
    }
    
    isOpen = !isOpen;
    popup.classList.toggle('show', isOpen);
    if (isOpen) {
      document.getElementById('floatChatInput').focus();
    }
  }
  
  // ========== 拖动处理 ==========
  function onDragStart(e) {
    // 如果是隐藏状态，先显示
    if (isHidden()) {
      showBtn();
      return;
    }
    
    isDragging = true;
    hasMoved = false;
    
    const touch = e.touches ? e.touches[0] : e;
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
    
    const rect = floatBtn.getBoundingClientRect();
    btnStartX = rect.left;
    btnStartY = rect.top;
    
    floatBtn.classList.add('dragging');
    
    // 阻止默认行为（防止页面滚动）
    e.preventDefault();
  }
  
  function onDragMove(e) {
    if (!isDragging) return;
    
    const touch = e.touches ? e.touches[0] : e;
    const deltaX = touch.clientX - dragStartX;
    const deltaY = touch.clientY - dragStartY;
    
    // 移动超过 5px 才算拖动
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      hasMoved = true;
    }
    
    setBtnPosition(btnStartX + deltaX, btnStartY + deltaY);
    
    // 阻止默认行为
    e.preventDefault();
  }
  
  function onDragEnd(e) {
    if (!isDragging) return;
    isDragging = false;
    floatBtn.classList.remove('dragging');
    
    if (hasMoved) {
      const rect = floatBtn.getBoundingClientRect();
      const centerX = rect.left + 28;
      
      // 拖到边缘自动隐藏
      if (centerX < 30 || centerX > window.innerWidth - 30) {
        hideBtn();
      } else {
        savePosition();
      }
    }
  }
  
  // ========== 消息管理 ==========
  function addMessage(role, content) {
    messages.push({ role, content });
    renderMessages();
  }
  
  function renderMessages() {
    const content = document.getElementById('floatChatContent');
    let html = '';
    
    messages.forEach(msg => {
      html += `
        <div class="float-chat-msg ${msg.role}">
          <div class="float-chat-msg-text">${msg.content}</div>
        </div>
      `;
    });
    
    content.innerHTML = html;
    content.scrollTop = content.scrollHeight;
  }
  
  async function sendMessage(text) {
    if (!text.trim()) return;
    
    addMessage('user', text);
    
    try {
      // 调用真实 SSE 接口
      const response = await fetch('/ai/chat/stream?message=' + encodeURIComponent(text));
      
      if (!response.ok) {
        throw new Error('接口请求失败');
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let aiContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        aiContent += chunk;
      }
      
      addMessage('ai', aiContent);
    } catch (error) {
      // 如果真实接口失败，使用模拟数据
      console.warn('真实接口失败，使用模拟数据:', error);
      
      const responses = {
        '火锅': '好的！推荐以下火锅店：\n1. 海底捞（万达店）\n2. 小龙坎老火锅\n3. 呷哺呷哺\n\n需要查看详情吗？',
        '笔记': '好的，我来帮你写探店笔记：\n\n【探店】发现宝藏店铺！\n环境：★★★★★\n味道：★★★★★\n价格：人均80元\n\n需要修改吗？',
        '优惠': '目前有以下优惠：\n1. 新用户立减20元\n2. 满100减15元\n3. 会员日8.8折\n\n需要领取吗？'
      };
      
      let response = '收到！我可以帮你推荐店铺、写笔记、查优惠。请问有什么需要？';
      for (const key in responses) {
        if (text.includes(key)) {
          response = responses[key];
          break;
        }
      }
      
      await new Promise(r => setTimeout(r, 500));
      addMessage('ai', response);
    }
  }
  
  // ========== 事件绑定 ==========
  // 点击事件 - 使用 pointerdown/pointerup 来区分点击和拖动
  let pointerDownTime = 0;
  let pointerDownX = 0;
  let pointerDownY = 0;
  
  floatBtn.addEventListener('pointerdown', (e) => {
    pointerDownTime = Date.now();
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
  });
  
  floatBtn.addEventListener('pointerup', (e) => {
    const elapsed = Date.now() - pointerDownTime;
    const deltaX = Math.abs(e.clientX - pointerDownX);
    const deltaY = Math.abs(e.clientY - pointerDownY);
    
    // 如果按下时间很短且移动距离很小，才算点击
    if (elapsed < 300 && deltaX < 10 && deltaY < 10) {
      handleTap();
    }
  });
  
  function handleTap() {
    const now = Date.now();
    
    // 双击检测
    if (now - lastClickTime < 300) {
      // 双击 - 切换隐藏状态
      if (isHidden()) {
        showBtn();
      } else {
        hideBtn();
      }
      lastClickTime = 0;
      return;
    }
    
    lastClickTime = now;
    
    // 单击
    if (isHidden()) {
      showBtn();
    } else {
      togglePopup();
    }
  }
  
  // 拖动事件
  floatBtn.addEventListener('mousedown', onDragStart);
  floatBtn.addEventListener('touchstart', onDragStart, { passive: false });
  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('touchmove', onDragMove, { passive: false });
  document.addEventListener('mouseup', onDragEnd);
  document.addEventListener('touchend', onDragEnd);
  
  // 关闭弹窗
  document.getElementById('floatChatClose').addEventListener('click', togglePopup);
  
  // 发送消息
  document.getElementById('floatChatSend').addEventListener('click', () => {
    const input = document.getElementById('floatChatInput');
    sendMessage(input.value);
    input.value = '';
  });
  
  document.getElementById('floatChatInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const input = document.getElementById('floatChatInput');
      sendMessage(input.value);
      input.value = '';
    }
  });
  
  // 快捷问题
  document.querySelectorAll('.float-chat-quick-item').forEach(item => {
    item.addEventListener('click', () => {
      sendMessage(item.dataset.msg);
    });
  });
  
  // ========== 初始化 ==========
  // 页面加载完成后恢复位置
  if (document.readyState === 'complete') {
    loadPosition();
  } else {
    window.addEventListener('load', loadPosition);
  }
  
  // 页面关闭前保存位置
  window.addEventListener('beforeunload', savePosition);
  
})();
