
        const form = document.getElementById('question-form');
        const chatBox = document.getElementById('chat-box');
        const inputField = document.getElementById('question');
        const modelAdjustmentInput = document.getElementById('model-adjustment');
        const adjustModelBtn = document.getElementById('adjust-model-btn');

        const v3Btn = document.getElementById('v3-btn');
        const r1Btn = document.getElementById('r1-btn');

        let selectedModel = 'v3';  // Default model is V3
        let modelAdjustment = '';  // Default empty adjustment

        // Model Selection
        v3Btn.addEventListener('click', () => {
            selectedModel = 'v3';
            toggleSelected(v3Btn);
            removeSelected(r1Btn);
        });

        r1Btn.addEventListener('click', () => {
            selectedModel = 'r1';
            toggleSelected(r1Btn);
            removeSelected(v3Btn);
        });

        // Toggle selected button state
        function toggleSelected(button) {
            button.classList.add('selected');
        }

        // Remove selected button state
        function removeSelected(button) {
            button.classList.remove('selected');
        }

        function showStatus(message, duration = 2000) {
            const toast = document.getElementById('status-toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, duration);
        }

        // 修改模型调整事件
        adjustModelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modelAdjustment = modelAdjustmentInput.value.trim();
            if (modelAdjustment) {
                showStatus('✓ 模型调整已保存', 1500);
            } else {
                showStatus('⚠ 已清除模型调整', 1500);
            }
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const question = inputField.value;

            if (question.trim() === "") {
                return;
            }

            addMessage('user', question);
            inputField.value = "";
            inputField.focus();

            fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `question=${encodeURIComponent(question)}&model=${selectedModel}&modelAdjustment=${encodeURIComponent(modelAdjustment)}`
            })
            .then(response => response.json())
            .then(data => {
                addMessage('computer', data.answer);
            })
            .catch(error => {
                console.error('Error:', error);
                addMessage('computer', "请求失败，请重试");
            });
        });

       function addMessage(sender, text) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', sender);

            const contentElement = document.createElement('div');
            contentElement.classList.add('content');

            // 使用 innerHTML 而不是 textContent，以支持 HTML 渲染
            contentElement.innerHTML = text;

            messageElement.appendChild(contentElement);
            chatBox.appendChild(messageElement);

            // 自动滚动到底部
            chatBox.scrollTop = chatBox.scrollHeight;
        }