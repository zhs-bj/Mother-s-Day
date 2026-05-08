/**
 * 母亲节礼物网页 - 交互脚本
 * 主题：谢谢你，做我的妈妈
 *
 * 包含功能：
 * - 飘落花瓣/爱心动画
 * - 平滑滚动
 * - 打字机效果
 * - 滚动淡入
 * - 照片放大查看
 * - 信封展开
 * - 兑换券领取（localStorage）
 * - 爱心上浮动画
 * - 背景音乐控制
 */

// ==========================================
// 全局变量
// ==========================================
let isTyping = false;      // 打字机是否正在运行
let hasTyped = false;      // 打字机是否已完成
let isMusicPlaying = false; // 音乐是否正在播放
const musicVolume = 0.35;   // 默认音量

// 打字机文字内容（可修改）
const typewriterLines = [
    "以前我总觉得，你的关心是唠叨。",
    "后来我才明白，那是你藏不住的爱。",
    "我慢慢长大，也越来越懂你的不容易。",
    "妈妈，谢谢你一直爱我。"
];

// 飘落元素（花瓣、爱心、星星）
const fallingItems = ['🌸', '💗', '✨', '🌼', '💕'];

// ==========================================
// 页面加载完成后初始化
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    initFallingItems();      // 初始化飘落动画
    initScrollObserver();    // 初始化滚动观察器
    initCoupons();           // 初始化兑换券状态

    // 弹窗背景点击关闭
    const modal = document.getElementById('coupon-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
});

// ==========================================
// 1. 飘落花瓣/爱心动画
// ==========================================
function initFallingItems() {
    const container = document.querySelector('.falling-container');
    if (!container) return;

    // 创建飘落元素
    function createFallingItem() {
        const item = document.createElement('div');
        item.className = 'falling-item';
        item.textContent = fallingItems[Math.floor(Math.random() * fallingItems.length)];

        // 随机位置、大小、速度和延迟
        const left = Math.random() * 100;
        const size = 16 + Math.random() * 20;
        const duration = 8 + Math.random() * 12;
        const delay = Math.random() * 5;

        item.style.left = left + '%';
        item.style.fontSize = size + 'px';
        item.style.animationDuration = duration + 's';
        item.style.animationDelay = delay + 's';

        container.appendChild(item);

        // 动画结束后移除元素
        setTimeout(() => {
            if (item.parentNode) {
                item.parentNode.removeChild(item);
            }
        }, (duration + delay) * 1000);
    }

    // 初始创建一些元素
    for (let i = 0; i < 12; i++) {
        createFallingItem();
    }

    // 持续创建新元素
    setInterval(createFallingItem, 2000);
}

// ==========================================
// 2. 平滑滚动到指定区域
// ==========================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // 点击按钮时触发爱心上浮
        createFloatingHearts(event);
    }
}

// ==========================================
// 3. 爱心上浮动画（按钮点击时）
// ==========================================
function createFloatingHearts(event) {
    const x = event ? event.clientX : window.innerWidth / 2;
    const y = event ? event.clientY : window.innerHeight / 2;

    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['💗', '💖', '💕', '💝'][Math.floor(Math.random() * 4)];

            const offsetX = (Math.random() - 0.5) * 100;
            heart.style.left = (x + offsetX) + 'px';
            heart.style.top = y + 'px';
            heart.style.fontSize = (20 + Math.random() * 16) + 'px';

            document.body.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 1500);
        }, i * 150);
    }
}

// 为所有按钮添加爱心上浮效果
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' && !e.target.closest('.lightbox') && !e.target.closest('.modal')) {
        // 排除某些按钮，避免重复触发
        if (!e.target.classList.contains('hero-btn') && !e.target.classList.contains('ending-btn')) {
            createFloatingHearts(e);
        }
    }
});

// ==========================================
// 4. 打字机效果
// ==========================================
function startTypewriter() {
    const element = document.getElementById('typewriter-text');
    if (!element || hasTyped) return;

    isTyping = true;
    element.innerHTML = '';

    let lineIndex = 0;
    let charIndex = 0;

    function typeNextChar() {
        if (lineIndex >= typewriterLines.length) {
            isTyping = false;
            hasTyped = true;
            // 打字完成后添加光标
            element.innerHTML = element.innerHTML.replace(/<span class="typewriter-cursor"><\/span>/g, '');
            return;
        }

        const currentLine = typewriterLines[lineIndex];

        if (charIndex === 0 && lineIndex > 0) {
            // 新行开始前添加换行
            element.innerHTML += '<br><br>';
        }

        if (charIndex < currentLine.length) {
            // 逐字显示
            const text = currentLine.substring(0, charIndex + 1);
            // 更新内容，保留光标
            const cursor = '<span class="typewriter-cursor"></span>';
            element.innerHTML = element.innerHTML.replace(/<span class="typewriter-cursor"><\/span>/g, '') + currentLine[charIndex] + cursor;

            charIndex++;
            // 随机打字速度，更自然
            const speed = 80 + Math.random() * 60;
            setTimeout(typeNextChar, speed);
        } else {
            // 当前行完成，进入下一行
            lineIndex++;
            charIndex = 0;
            setTimeout(typeNextChar, 600);
        }
    }

    typeNextChar();
}

// ==========================================
// 5. 滚动观察器（淡入动画 + 触发打字机）
// ==========================================
function initScrollObserver() {
    // 检查浏览器是否支持 IntersectionObserver
    if (!('IntersectionObserver' in window)) {
        // 不支持时直接显示所有元素
        document.querySelectorAll('.timeline-item, .superpower-card').forEach(el => {
            el.classList.add('visible');
        });
        startTypewriter();
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // 如果进入打字机区域，开始打字
                if (entry.target.id === 'typewriter' && !hasTyped) {
                    startTypewriter();
                }

                // 只触发一次
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察时间线项目
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // 观察超能力卡片
    document.querySelectorAll('.superpower-card').forEach(card => {
        observer.observe(card);
    });

    // 观察打字机区域
    const typewriterSection = document.getElementById('typewriter');
    if (typewriterSection) {
        observer.observe(typewriterSection);
    }
}

// ==========================================
// 6. 照片放大查看（Lightbox）
// ==========================================
function openLightbox(polaroid) {
    const img = polaroid.querySelector('img');
    const caption = polaroid.querySelector('.polaroid-caption');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');

    if (!lightbox || !img || !lightboxImg) return;

    // 如果图片加载失败，不打开 lightbox
    if (img.parentElement.classList.contains('photo-placeholder')) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = caption ? caption.textContent : '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
}

function closeLightbox(event) {
    // 只有点击背景或关闭按钮时才关闭
    if (event.target.classList.contains('lightbox') || event.target.classList.contains('lightbox-close')) {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// 键盘支持：ESC 关闭 lightbox
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        // 同时关闭弹窗
        const modal = document.getElementById('coupon-modal');
        if (modal && modal.classList.contains('active')) {
            closeModal();
        }
    }
});

// ==========================================
// 7. 信封展开动画
// ==========================================
function openLetter() {
    const envelope = document.getElementById('envelope');
    const letterPaper = document.getElementById('letter-paper');

    if (!envelope || !letterPaper) return;

    // 淡出信封
    envelope.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    envelope.style.opacity = '0';
    envelope.style.transform = 'scale(0.9)';

    setTimeout(() => {
        envelope.classList.add('hidden');
        letterPaper.classList.remove('hidden');

        // 滚动到信纸位置
        letterPaper.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
}

// ==========================================
// 8. 兑换券领取功能（localStorage）
// ==========================================
function initCoupons() {
    // 从 localStorage 读取已领取状态
    const claimedCoupons = JSON.parse(localStorage.getItem('mom_coupons') || '[]');

    document.querySelectorAll('.coupon-card').forEach(card => {
        const couponId = card.getAttribute('data-coupon');
        const btn = card.querySelector('.coupon-btn');

        if (claimedCoupons.includes(couponId)) {
            markCouponClaimed(card, btn);
        }
    });
}

function claimCoupon(btn) {
    const card = btn.closest('.coupon-card');
    if (!card) return;

    const couponId = card.getAttribute('data-coupon');
    if (!couponId) return;

    // 获取已领取列表
    const claimedCoupons = JSON.parse(localStorage.getItem('mom_coupons') || '[]');

    if (claimedCoupons.includes(couponId)) {
        // 已经领取过，直接显示弹窗
        showModal();
        return;
    }

    // 标记为已领取
    claimedCoupons.push(couponId);
    localStorage.setItem('mom_coupons', JSON.stringify(claimedCoupons));

    // 更新 UI
    markCouponClaimed(card, btn);

    // 显示弹窗
    showModal();

    // 触发爱心动画
    const rect = btn.getBoundingClientRect();
    const fakeEvent = {
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
    };
    createFloatingHearts(fakeEvent);
}

function markCouponClaimed(card, btn) {
    card.classList.add('claimed');
    btn.textContent = '已领取';
    btn.disabled = true;
}

// ==========================================
// 9. 弹窗控制
// ==========================================
function showModal() {
    const modal = document.getElementById('coupon-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('coupon-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 点击弹窗背景关闭
window.closeModalOnBackdrop = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModal();
    }
};

// ==========================================
// 10. 结尾彩蛋 - 爱心爆发
// ==========================================
function showLove() {
    const loveMessage = document.getElementById('love-message');
    if (loveMessage) {
        loveMessage.classList.remove('hidden');
    }

    // 创建大量爱心上浮动画
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = ['💗', '💖', '💕', '💝', '🌸', '✨'][Math.floor(Math.random() * 6)];

            const offsetX = (Math.random() - 0.5) * window.innerWidth * 0.8;
            const startY = window.innerHeight - 50;

            heart.style.left = (centerX + offsetX) + 'px';
            heart.style.top = startY + 'px';
            heart.style.fontSize = (16 + Math.random() * 24) + 'px';
            heart.style.animationDuration = (2 + Math.random() * 2) + 's';

            document.body.appendChild(heart);

            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 4000);
        }, i * 80);
    }

    // 滚动到消息位置
    if (loveMessage) {
        setTimeout(() => {
            loveMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// ==========================================
// 11. 背景音乐控制
// ==========================================
function toggleMusic() {
    const audio = document.getElementById('bgm');
    const btn = document.getElementById('music-btn');
    const icon = document.getElementById('music-icon');

    if (!audio) return;

    if (isMusicPlaying) {
        // 暂停
        audio.pause();
        isMusicPlaying = false;
        if (btn) btn.classList.remove('playing');
        if (icon) icon.textContent = '🎵';
    } else {
        // 播放
        audio.volume = musicVolume;
        audio.play().then(() => {
            isMusicPlaying = true;
            if (btn) btn.classList.add('playing');
            if (icon) icon.textContent = '⏸';
        }).catch(error => {
            // 播放失败（可能是文件不存在或浏览器限制）
            console.log('音乐播放失败:', error);
            alert('音乐文件暂时无法播放，请检查 music/bgm.mp3 是否存在。');
        });
    }
}

// 音乐播放结束时重置状态
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('bgm');
    if (audio) {
        audio.addEventListener('ended', function() {
            isMusicPlaying = false;
            const btn = document.getElementById('music-btn');
            const icon = document.getElementById('music-icon');
            if (btn) btn.classList.remove('playing');
            if (icon) icon.textContent = '🎵';
        });

        // 如果音乐文件加载失败，不影响页面
        audio.addEventListener('error', function() {
            console.log('背景音乐文件加载失败，请检查 music/bgm.mp3 是否存在。');
        });
    }
});

// ==========================================
// 12. 辅助功能：确保按钮可键盘操作
// ==========================================
// 为所有可点击元素添加键盘支持
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.tagName === 'DIV' && activeElement.onclick) {
            e.preventDefault();
            activeElement.click();
        }
    }
});

// 给 polaroid 添加 tabindex，使其可键盘聚焦
document.querySelectorAll('.polaroid').forEach(polaroid => {
    if (!polaroid.hasAttribute('tabindex')) {
        polaroid.setAttribute('tabindex', '0');
        polaroid.setAttribute('role', 'button');
        polaroid.setAttribute('aria-label', '点击查看大图');
    }

    polaroid.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(polaroid);
        }
    });
});
