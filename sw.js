// CoverCraft Service Worker - Offline Support & Caching
const CACHE_NAME = 'covercraft-v1.0.0';
const STATIC_CACHE = 'covercraft-static-v1';
const DYNAMIC_CACHE = 'covercraft-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/covercraft.html',
  '/covercraft-styles.css',
  '/js/covercraft-app.js',
  '/js/voice-detection.js',
  '/js/audio-engine.js',
  '/js/backing-track-generator.js',
  '/manifest.json',
  // Add icon files when available
  '/icon-192.png',
  '/icon-512.png'
];

// Dynamic content patterns to cache
const CACHE_PATTERNS = [
  /\/samples\/.*/,  // Audio samples
  /\/covers\/.*/,   // User generated covers
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/  // Images
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES.map(url => {
          // Handle potential 404s gracefully
          return fetch(url).then(response => {
            if (response.ok) {
              return cache.put(url, response);
            }
            console.warn(`Failed to cache: ${url}`);
          }).catch(err => {
            console.warn(`Failed to fetch for cache: ${url}`, err);
          });
        }));
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((err) => {
        console.error('Service Worker: Cache installation failed', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Strategy 1: Cache First for static assets
    if (isStaticAsset(request)) {
      return await cacheFirst(request);
    }
    
    // Strategy 2: Network First for API calls and dynamic content
    if (isDynamicContent(request)) {
      return await networkFirst(request);
    }
    
    // Strategy 3: Stale While Revalidate for audio samples
    if (isAudioSample(request)) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network First with cache fallback
    return await networkFirst(request);
    
  } catch (error) {
    console.error('Service Worker: Fetch failed', error);
    
    // Return offline fallback if available
    return await getOfflineFallback(request);
  }
}

// Cache First Strategy - for static assets
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, fetch from network and cache
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(STATIC_CACHE);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Network First Strategy - for dynamic content
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate - for audio samples
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Always try to fetch fresh version in background
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => {
    // Ignore network errors for background fetch
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If no cache, wait for network
  return await fetchPromise;
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_FILES.some(file => url.pathname.endsWith(file)) ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.html');
}

function isDynamicContent(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/api/') ||
         url.pathname.includes('/covers/') ||
         url.searchParams.has('dynamic');
}

function isAudioSample(request) {
  const url = new URL(request.url);
  return CACHE_PATTERNS.some(pattern => pattern.test(url.pathname)) ||
         url.pathname.includes('/samples/') ||
         request.headers.get('accept')?.includes('audio/');
}

async function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Return cached main page for navigation requests
  if (request.mode === 'navigate') {
    const cachedPage = await caches.match('/covercraft.html');
    if (cachedPage) {
      return cachedPage;
    }
  }
  
  // Return generic offline response
  return new Response(
    JSON.stringify({
      error: 'Offline',
      message: 'This content is not available offline'
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Background sync for uploading covers when online
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'upload-cover') {
    event.waitUntil(uploadPendingCovers());
  }
});

async function uploadPendingCovers() {
  try {
    // Get pending uploads from IndexedDB or localStorage
    const pendingUploads = await getPendingUploads();
    
    for (const upload of pendingUploads) {
      try {
        await uploadCover(upload);
        await removePendingUpload(upload.id);
        console.log('Service Worker: Successfully uploaded cover', upload.id);
      } catch (error) {
        console.error('Service Worker: Failed to upload cover', upload.id, error);
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notifications for premium features
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'Your cover is ready! Check out your latest creation.',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Cover',
        icon: '/icon-96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CoverCraft', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/covercraft.html#my-covers')
    );
  }
});

// Utility functions for IndexedDB operations
async function getPendingUploads() {
  // Placeholder - implement IndexedDB operations
  return [];
}

async function uploadCover(coverData) {
  // Placeholder - implement actual upload logic
  return Promise.resolve();
}

async function removePendingUpload(uploadId) {
  // Placeholder - implement IndexedDB removal
  return Promise.resolve();
}

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    event.waitUntil(cacheAudioFile(event.data.url));
  }
});

async function cacheAudioFile(url) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.add(url);
    console.log('Service Worker: Audio file cached', url);
  } catch (error) {
    console.error('Service Worker: Failed to cache audio file', url, error);
  }
}
