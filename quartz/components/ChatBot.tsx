import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/chatbot.scss"

interface ChatBotOptions {
  title?: string
  placeholder?: string
  apiUrl?: string
}

const defaultOptions: ChatBotOptions = {
  title: "Ask a Question",
  placeholder: "Type your question...",
  apiUrl: "http://localhost:3001"
}

export default ((userOpts?: Partial<ChatBotOptions>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const ChatBot: QuartzComponent = (_props: QuartzComponentProps) => {
    return (
      <div id="chatbot-container" data-api-url={opts.apiUrl}>
        {/* Toggle Button */}
        <button id="chatbot-toggle" aria-label="Open chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>

        {/* Chat Window */}
        <div id="chatbot-window" class="hidden">
          <div id="chatbot-header">
            <span id="chatbot-title">{opts.title}</span>
            <div id="chatbot-header-buttons">
              <button id="chatbot-maximize" aria-label="Maximize">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
              <button id="chatbot-close" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          <div id="chatbot-messages">
            <div class="chatbot-message assistant">
              <div class="message-content">
                Hi! I can help you find information in this knowledge base. What would you like to know?
              </div>
            </div>
          </div>

          <div id="chatbot-input-area">
            <textarea
              id="chatbot-input"
              placeholder={opts.placeholder}
              rows={1}
            ></textarea>
            <button id="chatbot-send" aria-label="Send message">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  ChatBot.css = style

  ChatBot.afterDOMLoaded = `
    const container = document.getElementById('chatbot-container');
    const toggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const maximizeBtn = document.getElementById('chatbot-maximize');
    const input = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const messages = document.getElementById('chatbot-messages');
    const apiUrl = container?.dataset.apiUrl || 'http://localhost:3001';

    let history = [];
    let isMaximized = localStorage.getItem('chatbot-maximized') === 'true';

    // Initialize maximized state
    if (isMaximized && chatWindow) {
      chatWindow.classList.add('maximized');
    }

    // Toggle chat window
    toggle?.addEventListener('click', () => {
      chatWindow?.classList.toggle('hidden');
      toggle?.classList.toggle('hidden');
      if (!chatWindow?.classList.contains('hidden')) {
        input?.focus();
      }
    });

    // Close chat
    closeBtn?.addEventListener('click', () => {
      if (isMaximized) {
        isMaximized = false;
        chatWindow?.classList.remove('maximized');
        localStorage.setItem('chatbot-maximized', 'false');
      } else {
        chatWindow?.classList.add('hidden');
        toggle?.classList.remove('hidden');
      }
    });

    // Maximize/minimize
    maximizeBtn?.addEventListener('click', () => {
      isMaximized = !isMaximized;
      chatWindow?.classList.toggle('maximized');
      localStorage.setItem('chatbot-maximized', String(isMaximized));
    });

    // Auto-resize textarea
    input?.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 150) + 'px';
    });

    // Send message
    async function sendMessage() {
      const text = input?.value?.trim();
      if (!text) return;

      // Add user message
      addMessage(text, 'user');
      input.value = '';
      input.style.height = 'auto';

      // Add to history
      history.push({ role: 'user', content: text });

      // Create assistant message placeholder
      const assistantDiv = document.createElement('div');
      assistantDiv.className = 'chatbot-message assistant';
      const contentDiv = document.createElement('div');
      contentDiv.className = 'message-content';
      contentDiv.textContent = 'Thinking...';
      assistantDiv.appendChild(contentDiv);
      messages?.appendChild(assistantDiv);
      messages.scrollTop = messages.scrollHeight;

      try {
        const response = await fetch(apiUrl + '/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history: history.slice(-10) })
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  fullResponse += data.content;
                  contentDiv.innerHTML = formatMarkdown(fullResponse);
                  messages.scrollTop = messages.scrollHeight;
                }
              } catch {}
            }
          }
        }

        // Add to history
        history.push({ role: 'assistant', content: fullResponse });

      } catch (error) {
        contentDiv.textContent = 'Sorry, an error occurred. Please try again.';
      }
    }

    function addMessage(text, role) {
      const div = document.createElement('div');
      div.className = 'chatbot-message ' + role;
      const content = document.createElement('div');
      content.className = 'message-content';
      content.innerHTML = formatMarkdown(text);
      div.appendChild(content);
      messages?.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function formatMarkdown(text) {
      return text
        .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
        .replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2">$1</a>')
        .replace(/\\\`([^\\\`]+)\\\`/g, '<code>$1</code>')
        .replace(/\\n/g, '<br>');
    }

    sendBtn?.addEventListener('click', sendMessage);

    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
      if (e.key === 'Escape') {
        closeBtn?.click();
      }
    });
  `

  return ChatBot
}) satisfies QuartzComponentConstructor
