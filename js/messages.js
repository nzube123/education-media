// Messages Page JavaScript

const conversations = [
    {
        id: 1,
        name: 'Sarah Johnson',
        handle: '@sarahjohnson',
        avatar: '👩‍💻',
        lastMessage: 'That sounds great! Let\'s meet tomorrow.',
        lastMessageTime: '2 minutes ago',
        unread: 2,
        online: true,
        messages: [
            { id: 1, sender: 'Sarah', avatar: '👩‍💻', text: 'Hey! How are you?', timestamp: '10:30 AM', type: 'received' },
            { id: 2, sender: 'You', avatar: '👤', text: 'I\'m doing great! How about you?', timestamp: '10:32 AM', type: 'sent' },
            { id: 3, sender: 'Sarah', avatar: '👩‍💻', text: 'Great! I wanted to discuss the project.', timestamp: '10:35 AM', type: 'received' },
            { id: 4, sender: 'You', avatar: '👤', text: 'Sure, I\'m excited about it!', timestamp: '10:36 AM', type: 'sent' },
            { id: 5, sender: 'Sarah', avatar: '👩‍💻', text: 'That sounds great! Let\'s meet tomorrow.', timestamp: '10:38 AM', type: 'received' }
        ]
    },
    {
        id: 2,
        name: 'Alex Chen',
        handle: '@alexchen',
        avatar: '👨‍🎨',
        lastMessage: 'Thanks for the feedback!',
        lastMessageTime: '1 hour ago',
        unread: 0,
        online: false,
        messages: [
            { id: 1, sender: 'Alex', avatar: '👨‍🎨', text: 'Check out my latest design!', timestamp: '9:00 AM', type: 'received' },
            { id: 2, sender: 'You', avatar: '👤', text: 'Looks amazing! Love the colors.', timestamp: '9:15 AM', type: 'sent' },
            { id: 3, sender: 'Alex', avatar: '👨‍🎨', text: 'Thanks for the feedback!', timestamp: '9:30 AM', type: 'received' }
        ]
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        handle: '@emilyrodriguez',
        avatar: '👩‍🔬',
        lastMessage: 'I\'ll send you the files later',
        lastMessageTime: '3 hours ago',
        unread: 0,
        online: true,
        messages: [
            { id: 1, sender: 'Emily', avatar: '👩‍🔬', text: 'Do you have time for a quick chat?', timestamp: '7:30 AM', type: 'received' },
            { id: 2, sender: 'You', avatar: '👤', text: 'Of course! What\'s up?', timestamp: '7:35 AM', type: 'sent' },
            { id: 3, sender: 'Emily', avatar: '👩‍🔬', text: 'I\'ll send you the files later', timestamp: '7:40 AM', type: 'received' }
        ]
    },
    {
        id: 4,
        name: 'Mike Thompson',
        handle: '@mikethompson',
        avatar: '👨‍💼',
        lastMessage: 'See you then!',
        lastMessageTime: '5 hours ago',
        unread: 0,
        online: false,
        messages: []
    }
];

let currentConversation = null;

document.addEventListener('DOMContentLoaded', function() {
    loadConversations();
    setupConversationSearch();
    setupMessageInput();
});

// Load conversations
function loadConversations() {
    const listContainer = document.getElementById('conversations-list');
    listContainer.innerHTML = '';

    conversations.forEach(conv => {
        const convElement = createConversationElement(conv);
        listContainer.appendChild(convElement);
    });
}

// Create conversation element
function createConversationElement(conversation) {
    const convDiv = document.createElement('div');
    convDiv.className = 'conversation-item';
    convDiv.dataset.convId = conversation.id;

    const unreadHTML = conversation.unread > 0 ? `<span style="background-color: var(--primary-color); color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px; font-weight: bold;">${conversation.unread}</span>` : '';

    convDiv.innerHTML = `
        <div class="conversation-avatar">${conversation.avatar}</div>
        <div class="conversation-info">
            <div class="conversation-name">${conversation.name}</div>
            <div class="conversation-preview">${conversation.lastMessage}</div>
        </div>
        <div class="conversation-time">${conversation.lastMessageTime}</div>
    `;

    convDiv.addEventListener('click', function() {
        openConversation(conversation.id);
    });

    return convDiv;
}

// Open conversation
function openConversation(convId) {
    const conversation = conversations.find(c => c.id == convId);
    if (!conversation) return;

    currentConversation = conversation;

    // Update UI
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-conv-id="${convId}"]`).classList.add('active');

    // Show chat container and hide empty state
    document.getElementById('chat-empty').style.display = 'none';
    document.getElementById('chat-container').style.display = 'flex';

    // Update chat header
    document.getElementById('chat-user-name').textContent = conversation.name;
    document.getElementById('chat-user-status').textContent = conversation.online ? 'Active now' : 'Active 2h ago';

    // Load messages
    loadChatMessages(conversation);

    // Clear unread
    conversation.unread = 0;
    updateConversationUI(convId);
}

// Load chat messages
function loadChatMessages(conversation) {
    const messagesDisplay = document.getElementById('messages-display');
    messagesDisplay.innerHTML = '';

    conversation.messages.forEach(message => {
        const msgElement = createMessageElement(message);
        messagesDisplay.appendChild(msgElement);
    });

    // Scroll to bottom
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;
}

// Create message element
function createMessageElement(message) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${message.type}`;

    msgDiv.innerHTML = `
        <div class="message-avatar">${message.avatar}</div>
        <div>
            <div class="message-bubble">${message.text}</div>
            <div class="message-time">${message.timestamp}</div>
        </div>
    `;

    return msgDiv;
}

// Setup message input
function setupMessageInput() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Send message
function sendMessage() {
    if (!currentConversation) return;

    const messageInput = document.getElementById('message-input');
    const text = messageInput.value.trim();

    if (text === '') return;

    // Create new message
    const newMessage = {
        id: currentConversation.messages.length + 1,
        sender: 'You',
        avatar: '👤',
        text: text,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'sent'
    };

    // Add to messages
    currentConversation.messages.push(newMessage);

    // Update UI
    const messagesDisplay = document.getElementById('messages-display');
    const msgElement = createMessageElement(newMessage);
    messagesDisplay.appendChild(msgElement);

    // Update last message in conversation list
    currentConversation.lastMessage = text;
    currentConversation.lastMessageTime = 'now';
    updateConversationUI(currentConversation.id);

    // Clear input
    messageInput.value = '';
    messageInput.focus();

    // Scroll to bottom
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;

    // Simulate reply after 1 second
    setTimeout(() => {
        simulateReply();
    }, 1000);
}

// Simulate reply
function simulateReply() {
    if (!currentConversation) return;

    const replies = [
        'That sounds good!',
        'I agree!',
        'Sounds great to me!',
        'Let\'s do it!',
        'Perfect!',
        'I\'m happy with that!',
        'Works for me!'
    ];

    const randomReply = replies[Math.floor(Math.random() * replies.length)];

    const replyMessage = {
        id: currentConversation.messages.length + 1,
        sender: currentConversation.name,
        avatar: currentConversation.avatar,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type: 'received'
    };

    currentConversation.messages.push(replyMessage);
    currentConversation.lastMessage = randomReply;
    currentConversation.lastMessageTime = 'just now';

    const messagesDisplay = document.getElementById('messages-display');
    const msgElement = createMessageElement(replyMessage);
    messagesDisplay.appendChild(msgElement);
    messagesDisplay.scrollTop = messagesDisplay.scrollHeight;

    updateConversationUI(currentConversation.id);
}

// Update conversation UI
function updateConversationUI(convId) {
    const conversation = conversations.find(c => c.id == convId);
    const convElement = document.querySelector(`[data-conv-id="${convId}"]`);

    if (convElement) {
        const preview = convElement.querySelector('.conversation-preview');
        const time = convElement.querySelector('.conversation-time');

        if (preview) preview.textContent = conversation.lastMessage;
        if (time) time.textContent = conversation.lastMessageTime;
    }
}

// Setup conversation search
function setupConversationSearch() {
    const searchInput = document.getElementById('conversation-search');

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const conversationItems = document.querySelectorAll('.conversation-item');

        conversationItems.forEach(item => {
            const name = item.querySelector('.conversation-name').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();

            if (name.includes(query) || preview.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}
