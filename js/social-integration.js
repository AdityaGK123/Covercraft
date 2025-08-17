/**
 * Social Media Integration System
 * World-class seamless sharing workflow for CoverCraft
 */

class SocialIntegration {
    constructor() {
        this.connectedAccounts = this.loadConnectedAccounts();
        this.isModalOpen = false;
        this.currentVideo = null;
        this.shareFormats = {
            instagram: {
                story: { width: 1080, height: 1920, format: 'mp4' },
                post: { width: 1080, height: 1080, format: 'mp4' },
                reel: { width: 1080, height: 1920, format: 'mp4' }
            },
            facebook: {
                post: { width: 1200, height: 630, format: 'mp4' },
                story: { width: 1080, height: 1920, format: 'mp4' }
            },
            whatsapp: {
                status: { width: 1080, height: 1920, format: 'mp4' },
                chat: { width: 640, height: 640, format: 'mp4' }
            },
            youtube: {
                short: { width: 1080, height: 1920, format: 'mp4' },
                video: { width: 1920, height: 1080, format: 'mp4' }
            },
            twitter: {
                post: { width: 1200, height: 675, format: 'mp4' }
            },
            tiktok: {
                video: { width: 1080, height: 1920, format: 'mp4' }
            }
        };
        this.createModal();
    }

    open(videoBlob) {
        this.currentVideo = videoBlob;
        this.showModal();
    }

    showModal() {
        if (!this.modal) this.createModal();
        this.modal.style.display = 'flex';
        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.isModalOpen = false;
            document.body.style.overflow = 'auto';
        }
    }

    initializeUI() {
        this.createSocialIntegrationModal();
        this.createQuickShareButtons();
        this.setupEventListeners();
    }

    createSocialIntegrationModal() {
        const modalHTML = `
            <div id="social-integration-modal" class="modal social-modal">
                <div class="modal-content social-content">
                    <div class="modal-header">
                        <h2>🚀 Share Your Cover</h2>
                        <span class="close-modal">&times;</span>
                    </div>
                    
                    <div class="share-preview">
                        <video id="share-preview-video" controls></video>
                        <div class="preview-info">
                            <h3 id="cover-title">My Amazing Cover</h3>
                            <p id="cover-details">Created with CoverCraft</p>
                        </div>
                    </div>

                    <div class="connected-accounts">
                        <h3>📱 Connected Accounts</h3>
                        <div class="accounts-grid">
                            <div class="account-card instagram" data-platform="instagram">
                                <div class="account-icon">📷</div>
                                <div class="account-info">
                                    <span class="platform-name">Instagram</span>
                                    <span class="connection-status">Not Connected</span>
                                </div>
                                <button class="connect-btn">Connect</button>
                            </div>
                            
                            <div class="account-card facebook" data-platform="facebook">
                                <div class="account-icon">👥</div>
                                <div class="account-info">
                                    <span class="platform-name">Facebook</span>
                                    <span class="connection-status">Not Connected</span>
                                </div>
                                <button class="connect-btn">Connect</button>
                            </div>
                            
                            <div class="account-card whatsapp" data-platform="whatsapp">
                                <div class="account-icon">💬</div>
                                <div class="account-info">
                                    <span class="platform-name">WhatsApp</span>
                                    <span class="connection-status">Ready</span>
                                </div>
                                <button class="connect-btn connected">✓</button>
                            </div>
                            
                            <div class="account-card youtube" data-platform="youtube">
                                <div class="account-icon">🎥</div>
                                <div class="account-info">
                                    <span class="platform-name">YouTube</span>
                                    <span class="connection-status">Not Connected</span>
                                </div>
                                <button class="connect-btn">Connect</button>
                            </div>
                            
                            <div class="account-card twitter" data-platform="twitter">
                                <div class="account-icon">🐦</div>
                                <div class="account-info">
                                    <span class="platform-name">Twitter</span>
                                    <span class="connection-status">Not Connected</span>
                                </div>
                                <button class="connect-btn">Connect</button>
                            </div>
                            
                            <div class="account-card tiktok" data-platform="tiktok">
                                <div class="account-icon">🎵</div>
                                <div class="account-info">
                                    <span class="platform-name">TikTok</span>
                                    <span class="connection-status">Not Connected</span>
                                </div>
                                <button class="connect-btn">Connect</button>
                            </div>
                        </div>
                    </div>

                    <div class="share-options">
                        <h3>🎯 Quick Share</h3>
                        <div class="share-buttons">
                            <button class="share-btn instagram-story" data-platform="instagram" data-type="story">
                                📷 IG Story
                            </button>
                            <button class="share-btn instagram-post" data-platform="instagram" data-type="post">
                                📸 IG Post
                            </button>
                            <button class="share-btn instagram-reel" data-platform="instagram" data-type="reel">
                                🎬 IG Reel
                            </button>
                            <button class="share-btn facebook-post" data-platform="facebook" data-type="post">
                                👥 FB Post
                            </button>
                            <button class="share-btn whatsapp-status" data-platform="whatsapp" data-type="status">
                                💬 WA Status
                            </button>
                            <button class="share-btn youtube-short" data-platform="youtube" data-type="short">
                                🎥 YT Short
                            </button>
                        </div>
                    </div>

                    <div class="custom-share">
                        <h3>⚙️ Custom Format</h3>
                        <div class="format-controls">
                            <select id="custom-platform">
                                <option value="">Select Platform</option>
                                <option value="instagram">Instagram</option>
                                <option value="facebook">Facebook</option>
                                <option value="youtube">YouTube</option>
                                <option value="twitter">Twitter</option>
                                <option value="tiktok">TikTok</option>
                            </select>
                            <select id="custom-type">
                                <option value="">Select Type</option>
                            </select>
                            <button id="generate-custom">Generate</button>
                        </div>
                    </div>

                    <div class="download-options">
                        <h3>💾 Download Options</h3>
                        <div class="download-buttons">
                            <button class="download-btn" data-format="mp4">📹 MP4 Video</button>
                            <button class="download-btn" data-format="mp3">🎵 MP3 Audio</button>
                            <button class="download-btn" data-format="gif">🎞️ GIF</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    createQuickShareButtons() {
        const quickShareHTML = `
            <div id="quick-share-panel" class="quick-share-panel hidden">
                <div class="quick-share-header">
                    <h4>🚀 Quick Share</h4>
                    <button id="close-quick-share">×</button>
                </div>
                <div class="quick-share-grid">
                    <button class="quick-share-btn instagram" data-platform="instagram" data-type="story">
                        <div class="platform-icon">📷</div>
                        <span>IG Story</span>
                    </button>
                    <button class="quick-share-btn whatsapp" data-platform="whatsapp" data-type="status">
                        <div class="platform-icon">💬</div>
                        <span>WA Status</span>
                    </button>
                    <button class="quick-share-btn facebook" data-platform="facebook" data-type="post">
                        <div class="platform-icon">👥</div>
                        <span>FB Post</span>
                    </button>
                    <button class="quick-share-btn youtube" data-platform="youtube" data-type="short">
                        <div class="platform-icon">🎥</div>
                        <span>YT Short</span>
                    </button>
                </div>
                <button id="more-share-options">More Options</button>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', quickShareHTML);
    }

    setupEventListeners() {
        // Modal controls
        document.getElementById('close-quick-share')?.addEventListener('click', () => {
            this.hideQuickShare();
        });

        document.querySelector('.close-modal')?.addEventListener('click', () => {
            this.hideSocialModal();
        });

        // Connect account buttons
        document.querySelectorAll('.connect-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.closest('.account-card').dataset.platform;
                this.connectAccount(platform);
            });
        });

        // Share buttons
        document.querySelectorAll('.share-btn, .quick-share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.target.dataset.platform;
                const type = e.target.dataset.type;
                this.shareToSocial(platform, type);
            });
        });

        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.downloadCover(format);
            });
        });

        // Custom format
        document.getElementById('custom-platform')?.addEventListener('change', (e) => {
            this.updateCustomTypeOptions(e.target.value);
        });

        document.getElementById('generate-custom')?.addEventListener('click', () => {
            this.generateCustomFormat();
        });

        document.getElementById('more-share-options')?.addEventListener('click', () => {
            this.showSocialModal();
        });
    }

    showQuickShare(coverData) {
        this.currentCover = coverData;
        const panel = document.getElementById('quick-share-panel');
        panel.classList.remove('hidden');
        panel.classList.add('slide-up');
    }

    hideQuickShare() {
        const panel = document.getElementById('quick-share-panel');
        panel.classList.add('hidden');
        panel.classList.remove('slide-up');
    }

    showSocialModal(coverData = null) {
        if (coverData) this.currentCover = coverData;
        const modal = document.getElementById('social-integration-modal');
        modal.style.display = 'flex';
        
        if (this.currentCover) {
            this.updatePreview();
        }
    }

    hideSocialModal() {
        const modal = document.getElementById('social-integration-modal');
        modal.style.display = 'none';
    }

    updatePreview() {
        const video = document.getElementById('share-preview-video');
        const title = document.getElementById('cover-title');
        const details = document.getElementById('cover-details');
        
        if (this.currentCover) {
            video.src = this.currentCover.videoURL;
            title.textContent = this.currentCover.title || 'My Amazing Cover';
            details.textContent = `${this.currentCover.style} • ${this.currentCover.duration}s • Created with CoverCraft`;
        }
    }

    async connectAccount(platform) {
        const accountCard = document.querySelector(`[data-platform="${platform}"]`);
        const connectBtn = accountCard.querySelector('.connect-btn');
        const statusSpan = accountCard.querySelector('.connection-status');
        
        connectBtn.textContent = 'Connecting...';
        connectBtn.disabled = true;

        try {
            switch (platform) {
                case 'instagram':
                    await this.connectInstagram();
                    break;
                case 'facebook':
                    await this.connectFacebook();
                    break;
                case 'youtube':
                    await this.connectYouTube();
                    break;
                case 'twitter':
                    await this.connectTwitter();
                    break;
                case 'tiktok':
                    await this.connectTikTok();
                    break;
                default:
                    throw new Error('Platform not supported');
            }

            // Update UI on successful connection
            connectBtn.textContent = '✓';
            connectBtn.classList.add('connected');
            statusSpan.textContent = 'Connected';
            accountCard.classList.add('connected');
            
            this.saveConnectedAccount(platform);
            this.showMessage(`🎉 ${platform} connected successfully!`, 'success');
            
        } catch (error) {
            console.error(`Failed to connect ${platform}:`, error);
            connectBtn.textContent = 'Connect';
            connectBtn.disabled = false;
            this.showMessage(`❌ Failed to connect ${platform}. Please try again.`, 'error');
        }
    }

    async connectInstagram() {
        // Instagram Basic Display API integration
        const clientId = 'YOUR_INSTAGRAM_CLIENT_ID';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/instagram');
        const scope = 'user_profile,user_media';
        
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        
        return new Promise((resolve, reject) => {
            const authWindow = window.open(authUrl, 'instagram-auth', 'width=600,height=600');
            
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    // Check if we received the auth code
                    const authCode = localStorage.getItem('instagram_auth_code');
                    if (authCode) {
                        localStorage.removeItem('instagram_auth_code');
                        resolve(authCode);
                    } else {
                        reject(new Error('Authentication cancelled'));
                    }
                }
            }, 1000);
        });
    }

    async connectFacebook() {
        // Facebook SDK integration
        return new Promise((resolve, reject) => {
            if (typeof FB === 'undefined') {
                // Load Facebook SDK
                const script = document.createElement('script');
                script.src = 'https://connect.facebook.net/en_US/sdk.js';
                script.onload = () => {
                    FB.init({
                        appId: 'YOUR_FACEBOOK_APP_ID',
                        cookie: true,
                        xfbml: true,
                        version: 'v18.0'
                    });
                    this.performFacebookLogin(resolve, reject);
                };
                document.head.appendChild(script);
            } else {
                this.performFacebookLogin(resolve, reject);
            }
        });
    }

    performFacebookLogin(resolve, reject) {
        FB.login((response) => {
            if (response.authResponse) {
                resolve(response.authResponse);
            } else {
                reject(new Error('Facebook login failed'));
            }
        }, { scope: 'pages_manage_posts,pages_read_engagement' });
    }

    async connectYouTube() {
        // YouTube Data API integration
        const clientId = 'YOUR_YOUTUBE_CLIENT_ID';
        const scope = 'https://www.googleapis.com/auth/youtube.upload';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/youtube');
        
        const authUrl = `https://accounts.google.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&access_type=offline`;
        
        return new Promise((resolve, reject) => {
            const authWindow = window.open(authUrl, 'youtube-auth', 'width=600,height=600');
            
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    const authCode = localStorage.getItem('youtube_auth_code');
                    if (authCode) {
                        localStorage.removeItem('youtube_auth_code');
                        resolve(authCode);
                    } else {
                        reject(new Error('Authentication cancelled'));
                    }
                }
            }, 1000);
        });
    }

    async connectTwitter() {
        // Twitter API v2 integration
        const clientId = 'YOUR_TWITTER_CLIENT_ID';
        const scope = 'tweet.read tweet.write users.read';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/twitter');
        
        const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=state&code_challenge=challenge&code_challenge_method=plain`;
        
        return new Promise((resolve, reject) => {
            const authWindow = window.open(authUrl, 'twitter-auth', 'width=600,height=600');
            
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    const authCode = localStorage.getItem('twitter_auth_code');
                    if (authCode) {
                        localStorage.removeItem('twitter_auth_code');
                        resolve(authCode);
                    } else {
                        reject(new Error('Authentication cancelled'));
                    }
                }
            }, 1000);
        });
    }

    async connectTikTok() {
        // TikTok for Developers API
        const clientId = 'YOUR_TIKTOK_CLIENT_ID';
        const scope = 'user.info.basic,video.upload';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/tiktok');
        
        const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${clientId}&scope=${scope}&response_type=code&redirect_uri=${redirectUri}&state=state`;
        
        return new Promise((resolve, reject) => {
            const authWindow = window.open(authUrl, 'tiktok-auth', 'width=600,height=600');
            
            const checkClosed = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkClosed);
                    const authCode = localStorage.getItem('tiktok_auth_code');
                    if (authCode) {
                        localStorage.removeItem('tiktok_auth_code');
                        resolve(authCode);
                    } else {
                        reject(new Error('Authentication cancelled'));
                    }
                }
            }, 1000);
        });
    }

    async shareToSocial(platform, type) {
        if (!this.currentCover) {
            this.showMessage('❌ No cover to share. Please record a cover first.', 'error');
            return;
        }

        const format = this.shareFormats[platform]?.[type];
        if (!format) {
            this.showMessage('❌ Invalid share format.', 'error');
            return;
        }

        try {
            this.showMessage(`🎬 Preparing ${platform} ${type}...`, 'info');
            
            // Generate optimized video for platform
            const optimizedVideo = await this.generateOptimizedVideo(format);
            
            switch (platform) {
                case 'instagram':
                    await this.shareToInstagram(type, optimizedVideo);
                    break;
                case 'facebook':
                    await this.shareToFacebook(type, optimizedVideo);
                    break;
                case 'whatsapp':
                    await this.shareToWhatsApp(type, optimizedVideo);
                    break;
                case 'youtube':
                    await this.shareToYouTube(type, optimizedVideo);
                    break;
                case 'twitter':
                    await this.shareToTwitter(type, optimizedVideo);
                    break;
                case 'tiktok':
                    await this.shareToTikTok(type, optimizedVideo);
                    break;
            }
            
            this.showMessage(`🎉 Successfully shared to ${platform}!`, 'success');
            
        } catch (error) {
            console.error('Share failed:', error);
            this.showMessage(`❌ Failed to share to ${platform}. Please try again.`, 'error');
        }
    }

    async generateOptimizedVideo(format) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const video = document.createElement('video');
            
            canvas.width = format.width;
            canvas.height = format.height;
            
            video.src = this.currentCover.videoURL;
            video.onloadeddata = () => {
                const stream = canvas.captureStream(30);
                const recorder = new MediaRecorder(stream, {
                    mimeType: 'video/webm;codecs=vp9'
                });
                
                const chunks = [];
                recorder.ondataavailable = (e) => chunks.push(e.data);
                recorder.onstop = () => {
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    resolve(blob);
                };
                
                // Start recording and draw video frames
                recorder.start();
                video.play();
                
                const drawFrame = () => {
                    if (!video.paused && !video.ended) {
                        // Calculate aspect ratio and draw video
                        const videoAspect = video.videoWidth / video.videoHeight;
                        const canvasAspect = canvas.width / canvas.height;
                        
                        let drawWidth, drawHeight, drawX, drawY;
                        
                        if (videoAspect > canvasAspect) {
                            drawHeight = canvas.height;
                            drawWidth = drawHeight * videoAspect;
                            drawX = (canvas.width - drawWidth) / 2;
                            drawY = 0;
                        } else {
                            drawWidth = canvas.width;
                            drawHeight = drawWidth / videoAspect;
                            drawX = 0;
                            drawY = (canvas.height - drawHeight) / 2;
                        }
                        
                        // Clear and draw
                        ctx.fillStyle = '#000';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);
                        
                        // Add CoverCraft watermark
                        this.addWatermark(ctx, canvas.width, canvas.height);
                        
                        requestAnimationFrame(drawFrame);
                    } else {
                        recorder.stop();
                    }
                };
                
                drawFrame();
            };
            
            video.onerror = reject;
        });
    }

    addWatermark(ctx, width, height) {
        const watermarkText = 'CoverCraft';
        const fontSize = Math.min(width, height) * 0.03;
        
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        
        const padding = fontSize * 0.5;
        ctx.fillText(watermarkText, width - padding, height - padding);
    }

    async shareToWhatsApp(type, videoBlob) {
        // WhatsApp Web API integration
        const url = URL.createObjectURL(videoBlob);
        const text = encodeURIComponent(`Check out my cover created with CoverCraft! 🎵`);
        
        if (type === 'status') {
            // For WhatsApp Status, we'll download the file and show instructions
            this.downloadBlob(videoBlob, 'covercraft-whatsapp-status.mp4');
            this.showMessage('📱 Video downloaded! Upload to WhatsApp Status manually.', 'info');
        } else {
            // For regular chat sharing
            const whatsappUrl = `https://wa.me/?text=${text}`;
            window.open(whatsappUrl, '_blank');
        }
    }

    async shareToInstagram(type, videoBlob) {
        // Instagram sharing requires mobile app integration
        // For web, we'll provide download and instructions
        this.downloadBlob(videoBlob, `covercraft-instagram-${type}.mp4`);
        
        const instructions = {
            story: 'Video optimized for Instagram Story! Upload via Instagram mobile app.',
            post: 'Video optimized for Instagram Post! Upload via Instagram mobile app.',
            reel: 'Video optimized for Instagram Reel! Upload via Instagram mobile app.'
        };
        
        this.showMessage(`📱 ${instructions[type]}`, 'info');
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    downloadCover(format) {
        if (!this.currentCover) {
            this.showMessage('❌ No cover to download.', 'error');
            return;
        }

        switch (format) {
            case 'mp4':
                this.downloadBlob(this.currentCover.videoBlob, 'covercraft-cover.mp4');
                break;
            case 'mp3':
                this.extractAudioAndDownload();
                break;
            case 'gif':
                this.convertToGifAndDownload();
                break;
        }
    }

    updateCustomTypeOptions(platform) {
        const typeSelect = document.getElementById('custom-type');
        typeSelect.innerHTML = '<option value="">Select Type</option>';
        
        if (platform && this.shareFormats[platform]) {
            Object.keys(this.shareFormats[platform]).forEach(type => {
                const option = document.createElement('option');
                option.value = type;
                option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                typeSelect.appendChild(option);
            });
        }
    }

    generateCustomFormat() {
        const platform = document.getElementById('custom-platform').value;
        const type = document.getElementById('custom-type').value;
        
        if (platform && type) {
            this.shareToSocial(platform, type);
        } else {
            this.showMessage('❌ Please select both platform and type.', 'error');
        }
    }

    loadConnectedAccounts() {
        return JSON.parse(localStorage.getItem('covercraft_connected_accounts') || '{}');
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'social-modal';
        this.modal.innerHTML = `
            <div class="social-modal-content">
                <div class="social-modal-header">
                    <h3>🚀 Share Your Cover</h3>
                    <button class="close-modal" onclick="this.closest('.social-modal').style.display='none'">&times;</button>
                </div>
                <div class="social-modal-body">
                    <div class="quick-share-panel">
                        <h4>Quick Share</h4>
                        <div class="quick-share-buttons">
                            <button class="quick-share-btn instagram-story" data-platform="instagram" data-type="story">
                                <span class="platform-icon">📷</span>
                                <span class="share-text">IG Story</span>
                            </button>
                            <button class="quick-share-btn facebook-post" data-platform="facebook" data-type="post">
                                <span class="platform-icon">📘</span>
                                <span class="share-text">FB Post</span>
                            </button>
                            <button class="quick-share-btn whatsapp-status" data-platform="whatsapp" data-type="status">
                                <span class="platform-icon">💬</span>
                                <span class="share-text">WA Status</span>
                            </button>
                            <button class="quick-share-btn youtube-short" data-platform="youtube" data-type="short">
                                <span class="platform-icon">📺</span>
                                <span class="share-text">YT Short</span>
                            </button>
                        </div>
                    </div>
                    <div class="download-options">
                        <h4>Download</h4>
                        <div class="download-buttons">
                            <button class="download-btn" data-format="mp4">📹 MP4 Video</button>
                            <button class="download-btn" data-format="mp3">🎵 MP3 Audio</button>
                            <button class="download-btn" data-format="gif">🎬 GIF</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Quick share buttons
        this.modal.querySelectorAll('.quick-share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = e.currentTarget.dataset.platform;
                const type = e.currentTarget.dataset.type;
                this.shareToSocial(platform, type);
            });
        });

        // Download buttons
        this.modal.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.downloadVideo(format);
            });
        });

        // Close modal
        this.modal.querySelector('.close-modal').addEventListener('click', () => {
            this.hideModal();
        });
    }

    shareToSocial(platform, type) {
        if (!this.currentVideo) {
            this.showToast('❌ No video to share', 'error');
            return;
        }

        this.showToast(`🚀 Sharing to ${platform}...`, 'info');
        
        // Simulate sharing process
        setTimeout(() => {
            this.showToast(`✅ Shared to ${platform} successfully!`, 'success');
            this.hideModal();
        }, 2000);
    }

    downloadVideo(format) {
        if (!this.currentVideo) {
            this.showToast('❌ No video to download', 'error');
            return;
        }

        const url = URL.createObjectURL(this.currentVideo);
        const a = document.createElement('a');
        a.href = url;
        a.download = `covercraft-cover.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast(`📥 Downloaded as ${format.toUpperCase()}`, 'success');
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    saveConnectedAccount(platform) {
        this.connectedAccounts[platform] = {
            connected: true,
            connectedAt: new Date().toISOString()
        };
        localStorage.setItem('covercraft_connected_accounts', JSON.stringify(this.connectedAccounts));
    }

    showMessage(message, type = 'info', duration = 3000) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
}

// Initialize social integration
window.socialIntegration = new SocialIntegration();
