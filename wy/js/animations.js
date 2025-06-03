// 动画效果管理器
class AnimationEffects {
    constructor() {
        this.init();
        // 将实例保存到全局变量中，以便主题切换时调用
        window.animationEffects = this;
    }

    init() {
        this.setupDynamicBackground();
        this.setupMouseEffects();
        this.setupWelcomeAnimation();
        this.setupHeartbeatAnimation();
        this.setupHoverEffects();
        this.setupScrollAnimations();
        this.setupBackgroundParticles();
        this.setupStarryEffect(); // 添加星空效果
        
        // 监听主题变更事件
        document.addEventListener('themeChanged', (e) => {
            this.updateForTheme(e.detail.theme);
        });
    }
    
    // 根据主题更新动画效果
    updateForTheme(themeName) {
        console.log(`正在更新动画效果为主题: ${themeName}`);
        
        // 更新动态背景
        this.createFloatingElements();
        
        // 更新背景粒子颜色
        this.updateParticleColors(themeName);
        
        // 更新心跳动画
        this.updateHeartbeatAnimation(themeName);
        
        // 更新悬停效果
        this.updateHoverEffects(themeName);
        
        // 更新星空效果
        this.updateStarryEffect(themeName);
    }
    
    // 设置星空效果
    setupStarryEffect() {
        if (document.body.classList.contains('theme-starry')) {
            this.createStarryBackground();
        }
    }
    
    // 更新星空效果
    updateStarryEffect(themeName) {
        // 移除现有的星空背景
        const existingCanvas = document.querySelector('.starry-background');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        // 移除现有的霓虹特效
        const existingNeon = document.querySelector('.neon-effect');
        if (existingNeon) {
            existingNeon.remove();
        }
        
        // 如果是星空主题，创建新的星空背景
        if (themeName === 'starry') {
            this.createStarryBackground();
        } else if (themeName === 'cool') {
            this.createNeonEffect();
        }
    }
    
    // 创建星空背景
    createStarryBackground() {
        const canvas = document.createElement('canvas');
        canvas.className = 'starry-background';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        `;
        document.body.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const stars = [];
        const meteors = [];
        
        // 调整画布大小
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // 创建星星
        class Star {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.twinkleSpeed = Math.random() * 0.05 + 0.02;
                this.alpha = Math.random();
                this.alphaChange = this.twinkleSpeed;
            }
            
            update() {
                this.alpha += this.alphaChange;
                if (this.alpha > 1 || this.alpha < 0) {
                    this.alphaChange = -this.alphaChange;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }
        
        // 创建流星
        class Meteor {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.speed = Math.random() * 10 + 5;
                this.length = Math.random() * 80 + 40;
                this.opacity = 1;
                this.angle = Math.random() * 30 + 30;
                this.active = false;
                this.delay = Math.random() * 5000; // 随机延迟
                setTimeout(() => {
                    this.active = true;
                }, this.delay);
            }
            
            update() {
                if (!this.active) return;
                
                this.x += Math.cos(this.angle * Math.PI / 180) * this.speed;
                this.y += Math.sin(this.angle * Math.PI / 180) * this.speed;
                this.opacity -= 0.01;
                
                if (this.opacity <= 0 || this.y > canvas.height || this.x > canvas.width) {
                    this.reset();
                }
            }
            
            draw() {
                if (!this.active || this.opacity <= 0) return;
                
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                const tailX = this.x - Math.cos(this.angle * Math.PI / 180) * this.length;
                const tailY = this.y - Math.sin(this.angle * Math.PI / 180) * this.length;
                
                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.strokeStyle = gradient;
                ctx.lineTo(tailX, tailY);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        // 初始化星空
        function init() {
            resizeCanvas();
            
            // 创建星星
            for (let i = 0; i < 200; i++) {
                stars.push(new Star());
            }
            
            // 创建流星
            for (let i = 0; i < 8; i++) {
                meteors.push(new Meteor());
            }
            
            // 监听窗口大小变化
            window.addEventListener('resize', resizeCanvas);
            
            // 开始动画
            animate();
        }
        
        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 更新和绘制星星
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            // 更新和绘制流星
            meteors.forEach(meteor => {
                meteor.update();
                meteor.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        // 初始化
        init();
    }
    
    // 创建霓虹特效
    createNeonEffect() {
        const neonContainer = document.createElement('div');
        neonContainer.className = 'neon-effect';
        neonContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            overflow: hidden;
        `;
        document.body.appendChild(neonContainer);
        
        // 创建霓虹线条
        for (let i = 0; i < 15; i++) {
            const neonLine = document.createElement('div');
            neonLine.className = 'neon-line';
            
            const size = Math.random() * 200 + 100;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const angle = Math.random() * 360;
            const delay = Math.random() * 5;
            const duration = Math.random() * 5 + 5;
            const color = this.getRandomNeonColor();
            
            neonLine.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: 2px;
                top: ${y}px;
                left: ${x}px;
                background: ${color};
                box-shadow: 0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color};
                transform: rotate(${angle}deg);
                opacity: 0;
                animation: neonPulse ${duration}s ease-in-out infinite ${delay}s;
            `;
            
            neonContainer.appendChild(neonLine);
        }
        
        // 创建霓虹圆圈
        for (let i = 0; i < 10; i++) {
            const neonCircle = document.createElement('div');
            neonCircle.className = 'neon-circle';
            
            const size = Math.random() * 100 + 50;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const delay = Math.random() * 5;
            const duration = Math.random() * 8 + 4;
            const color = this.getRandomNeonColor();
            
            neonCircle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                top: ${y}px;
                left: ${x}px;
                border: 2px solid ${color};
                box-shadow: 0 0 10px ${color}, 0 0 20px ${color};
                opacity: 0;
                animation: neonCirclePulse ${duration}s ease-in-out infinite ${delay}s;
            `;
            
            neonContainer.appendChild(neonCircle);
        }
        
        // 添加动画样式
        if (!document.querySelector('#neon-style')) {
            const style = document.createElement('style');
            style.id = 'neon-style';
            style.textContent = `
                @keyframes neonPulse {
                    0%, 100% { opacity: 0; transform: scale(0.8) rotate(var(--rotation)); }
                    50% { opacity: 0.7; transform: scale(1.1) rotate(var(--rotation)); }
                }
                
                @keyframes neonCirclePulse {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // 获取随机霓虹颜色
    getRandomNeonColor() {
        const neonColors = [
            '#ff00ff', // 粉红
            '#00ffff', // 青色
            '#ff00cc', // 亮粉
            '#cc00ff', // 紫色
            '#7700ff', // 蓝紫
            '#0077ff'  // 蓝色
        ];
        return neonColors[Math.floor(Math.random() * neonColors.length)];
    }
    
    updateParticleColors(themeName) {
        if (!this.particles) return;
        
        // 更新所有粒子的主题
        this.particles.forEach(particle => {
            particle.setTheme(themeName);
        });
        
        console.log(`已更新粒子颜色为主题: ${themeName}`);
    }
    
    updateHeartbeatAnimation(themeName) {
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.style.animation = 'none';
            setTimeout(() => {
                const animation = themeName === 'cool' ? 'coolHeartbeat' :
                                 themeName === 'pink' ? 'pinkHeartbeat' : 'romanticHeartbeat';
                heartIcon.style.animation = `${animation} 1.5s infinite`;
            }, 10);
        }
    }
    
    updateHoverEffects(themeName) {
        // 重置所有悬停效果
        document.querySelectorAll('.avatar-container img').forEach(img => {
            img.style.animation = 'none';
        });
    }

    setupDynamicBackground() {
        // 创建动态背景容器（如果不存在）
        if (!document.querySelector('.dynamic-background')) {
            const background = document.createElement('div');
            background.className = 'dynamic-background';
            document.body.insertBefore(background, document.body.firstChild);
        }

        // 为当前主题创建特定的动态元素
        this.createFloatingElements();
    }

    createFloatingElements() {
        const background = document.querySelector('.dynamic-background');
        if (!background) return;
        
        // 获取当前主题
        let theme = '';
        if (document.body.classList.contains('theme-romantic')) theme = 'romantic';
        else if (document.body.classList.contains('theme-cool')) theme = 'cool';
        else if (document.body.classList.contains('theme-pink')) theme = 'pink';
        else theme = 'romantic'; // 默认主题
        
        console.log(`为主题创建浮动元素: ${theme}`);

        // 清除现有的浮动元素
        background.innerHTML = '';

        // 根据主题创建不同的浮动元素
        switch (theme) {
            case 'romantic':
                this.createHearts(background);
                break;
            case 'cool':
                this.createStars(background);
                break;
            case 'pink':
                this.createBubbles(background);
                break;
        }
    }

    createHearts(container) {
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-element heart';
            heart.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.5 + 0.1};
                transform: scale(${Math.random() * 0.5 + 0.5});
                animation: float ${Math.random() * 4 + 4}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            heart.innerHTML = '❤';
            container.appendChild(heart);
        }
    }

    createStars(container) {
        // 创建星空画布
        const canvas = document.createElement('canvas');
        canvas.className = 'star-canvas';
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const stars = [];
        const meteors = [];
        
        // 调整画布大小
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        // 创建星星
        class Star {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.twinkleSpeed = Math.random() * 0.05 + 0.02;
                this.alpha = Math.random();
                this.alphaChange = this.twinkleSpeed;
            }
            
            update() {
                this.alpha += this.alphaChange;
                if (this.alpha > 1 || this.alpha < 0) {
                    this.alphaChange = -this.alphaChange;
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
                ctx.fill();
            }
        }
        
        // 创建流星
        class Meteor {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = 0;
                this.speed = Math.random() * 10 + 5;
                this.length = Math.random() * 80 + 40;
                this.opacity = 1;
                this.angle = Math.random() * 30 + 30;
            }
            
            update() {
                this.x += Math.cos(this.angle * Math.PI / 180) * this.speed;
                this.y += Math.sin(this.angle * Math.PI / 180) * this.speed;
                this.opacity -= 0.02;
                
                if (this.opacity <= 0 || this.y > canvas.height || this.x > canvas.width) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                const tailX = this.x - Math.cos(this.angle * Math.PI / 180) * this.length;
                const tailY = this.y - Math.sin(this.angle * Math.PI / 180) * this.length;
                
                const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
                gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                
                ctx.strokeStyle = gradient;
                ctx.lineTo(tailX, tailY);
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        
        // 初始化星空
        function init() {
            resizeCanvas();
            
            // 创建星星
            for (let i = 0; i < 200; i++) {
                stars.push(new Star());
            }
            
            // 创建流星
            for (let i = 0; i < 3; i++) {
                meteors.push(new Meteor());
            }
        }
        
        // 动画循环
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // 更新和绘制星星
            stars.forEach(star => {
                star.update();
                star.draw();
            });
            
            // 更新和绘制流星
            meteors.forEach(meteor => {
                meteor.update();
                meteor.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', resizeCanvas);
        init();
        animate();
    }

    createBubbles(container) {
        for (let i = 0; i < 25; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'floating-element bubble';
            bubble.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${Math.random() * 20 + 10}px;
                height: ${Math.random() * 20 + 10}px;
                border-radius: 50%;
                background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 192, 203, 0.2));
                opacity: ${Math.random() * 0.5 + 0.1};
                animation: float ${Math.random() * 6 + 6}s ease-in-out infinite;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(bubble);
        }
    }

    setupMouseEffects() {
        // 创建鼠标跟随效果元素
        const mouseGlow = document.createElement('div');
        mouseGlow.className = 'mouse-glow';
        document.body.appendChild(mouseGlow);

        // 添加鼠标移动事件监听
        let mouseTimeout;
        document.addEventListener('mousemove', (e) => {
            mouseGlow.style.opacity = '1';
            mouseGlow.style.left = e.clientX + 'px';
            mouseGlow.style.top = e.clientY + 'px';

            // 设置CSS变量用于背景效果
            document.documentElement.style.setProperty('--mouse-x', e.clientX / window.innerWidth);
            document.documentElement.style.setProperty('--mouse-y', e.clientY / window.innerHeight);

            // 清除之前的超时
            clearTimeout(mouseTimeout);
            // 设置新的超时，鼠标停止移动后淡出光晕
            mouseTimeout = setTimeout(() => {
                mouseGlow.style.opacity = '0';
            }, 1000);
        });

        // 监听主题变更事件
        document.addEventListener('themeChanged', (e) => {
            this.createFloatingElements();
        });
    }

    setupWelcomeAnimation() {
        const welcomeSection = document.querySelector('.welcome-section h1');
        if (welcomeSection) {
            welcomeSection.style.opacity = '0';
            setTimeout(() => {
                welcomeSection.style.opacity = '1';
                welcomeSection.style.animation = 'bounceIn 1s ease-out forwards';
            }, 500);
        }
    }

    setupHeartbeatAnimation() {
        const heartIcon = document.querySelector('.heart-icon');
        if (heartIcon) {
            heartIcon.addEventListener('mouseover', () => {
                heartIcon.style.animation = 'none';
                setTimeout(() => {
                    const theme = document.body.classList.contains('theme-cool') ? 'coolHeartbeat' :
                                document.body.classList.contains('theme-pink') ? 'pinkHeartbeat' : 'romanticHeartbeat';
                    heartIcon.style.animation = `${theme} 1s infinite`;
                }, 10);
            });
        }
    }

    setupHoverEffects() {
        // 为头像添加悬停效果
        document.querySelectorAll('.avatar-container img').forEach(img => {
            img.addEventListener('mouseover', () => {
                const theme = document.body.classList.contains('theme-cool') ? 'neonPulse' :
                            document.body.classList.contains('theme-pink') ? 'wobble' : 'scale';
                img.style.animation = `${theme} 1s infinite`;
            });

            img.addEventListener('mouseout', () => {
                img.style.animation = 'none';
            });
        });

        // 为按钮添加悬停效果
        document.querySelectorAll('.btn-create, .btn-setting, .btn-submit, .btn-login').forEach(btn => {
            btn.addEventListener('mouseover', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
            });

            btn.addEventListener('mouseout', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = 'none';
            });
        });
    }

    setupScrollAnimations() {
        // 为相册和时光轴添加滚动显示动画
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, {
            threshold: 0.1
        });

        document.querySelectorAll('.albums-grid > *, .timeline > *').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease-out';
            observer.observe(el);
        });
    }

    setupBackgroundParticles() {
        // 创建背景粒子效果
        const canvas = document.createElement('canvas');
        canvas.className = 'background-particles';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        this.particles = []; // 存储到实例属性中，方便更新
        this.ctx = ctx; // 存储到实例属性中，方便更新
        this.canvas = canvas; // 存储到实例属性中，方便更新

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor(theme) {
                this.theme = theme || 'romantic';
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw(ctx, currentTheme) {
                // 使用传入的主题或粒子自身的主题
                const theme = currentTheme || this.theme;
                let color;
                
                switch (theme) {
                    case 'romantic':
                        color = `rgba(255, 105, 180, ${this.opacity})`;
                        break;
                    case 'cool':
                        color = `rgba(138, 43, 226, ${this.opacity})`;
                        break;
                    case 'pink':
                        color = `rgba(255, 192, 203, ${this.opacity})`;
                        break;
                    default:
                        color = `rgba(255, 105, 180, ${this.opacity})`;
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
            
            // 更新粒子主题
            setTheme(theme) {
                this.theme = theme;
            }
        }

        // 初始化粒子
        const initParticles = () => {
            // 获取当前主题
            let theme = 'romantic';
            if (document.body.classList.contains('theme-cool')) theme = 'cool';
            else if (document.body.classList.contains('theme-pink')) theme = 'pink';
            
            for (let i = 0; i < 50; i++) {
                this.particles.push(new Particle(theme));
            }
        };

        // 动画循环
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 获取当前主题
            let currentTheme = 'romantic';
            if (document.body.classList.contains('theme-cool')) currentTheme = 'cool';
            else if (document.body.classList.contains('theme-pink')) currentTheme = 'pink';
            
            this.particles.forEach(particle => {
                particle.update();
                particle.draw(ctx, currentTheme);
            });
            
            this.animationId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        initParticles();
        animate();
    }
}

// 初始化动画效果
document.addEventListener('DOMContentLoaded', () => {
    const animationEffects = new AnimationEffects();
}); 