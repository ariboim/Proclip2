import {
  AspectRatioType,
  PropertyPhoto,
  VideoEditorSettings,
  GeneratedVideoScript,
  AgentProfile,
  PropertyFormData,
} from '../types/property';
import { soundEngine } from './audioSynthesizer';

export interface RenderFrameOptions {
  canvas: HTMLCanvasElement;
  currentTime: number; // in seconds
  totalDuration: number;
  script: GeneratedVideoScript;
  photos: PropertyPhoto[];
  propertyData: PropertyFormData;
  agent: AgentProfile;
  settings: VideoEditorSettings;
  imagesCache: Map<string, HTMLImageElement>;
  logoImage: HTMLImageElement | null;
}

export function getResolutionForAspect(aspect: AspectRatioType): { width: number; height: number } {
  switch (aspect) {
    case '9:16':
      return { width: 720, height: 1280 };
    case '1:1':
      return { width: 1080, height: 1080 };
    case '16:9':
      return { width: 1280, height: 720 };
  }
}

/**
 * Preload photos into Image objects
 */
export async function preloadImages(photos: PropertyPhoto[], logoUrl?: string): Promise<{
  imagesCache: Map<string, HTMLImageElement>;
  logoImage: HTMLImageElement | null;
}> {
  const imagesCache = new Map<string, HTMLImageElement>();

  const loadSingle = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(img); // resolve anyway to avoid hanging
      img.src = url;
    });
  };

  for (const photo of photos) {
    if (photo.dataUrl) {
      const img = await loadSingle(photo.dataUrl);
      imagesCache.set(photo.id, img);
    }
  }

  let logoImage: HTMLImageElement | null = null;
  if (logoUrl) {
    logoImage = await loadSingle(logoUrl);
  }

  return { imagesCache, logoImage };
}

/**
 * Core render function for a single frame at currentTime (seconds)
 */
export function renderVideoFrame({
  canvas,
  currentTime,
  totalDuration,
  script,
  photos,
  propertyData,
  agent,
  settings,
  imagesCache,
  logoImage,
}: RenderFrameOptions) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  // Fallback if no photos
  if (photos.length === 0) {
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px sans-serif';
    ctx.fillText('Belum ada foto properti', 40, height / 2);
    return;
  }

  // Determine current active scene
  const scenes = script.scenes || [];
  let activeSceneIndex = 0;
  for (let i = 0; i < scenes.length; i++) {
    if (currentTime >= scenes[i].startSec && currentTime < scenes[i].endSec) {
      activeSceneIndex = i;
      break;
    }
  }
  const activeScene = scenes[activeSceneIndex] || scenes[0];

  // Map scene to photo index: Intelligently match specific room photo if uploaded, otherwise cyclic fallback
  const targetRoom = activeScene.photoTarget;
  const matchedPhotoIdx = photos.findIndex((p) => p.type === targetRoom);
  const photoIndex = matchedPhotoIdx !== -1 ? matchedPhotoIdx : (activeSceneIndex % photos.length);
  const currentPhoto = photos[photoIndex];

  // Intelligently match next photo for smooth scene transition
  const nextScene = scenes[activeSceneIndex + 1];
  let nextPhotoIndex = (photoIndex + 1) % photos.length;
  if (nextScene && nextScene.photoTarget) {
    const nextMatchedIdx = photos.findIndex((p, idx) => idx !== photoIndex && p.type === nextScene.photoTarget);
    if (nextMatchedIdx !== -1) {
      nextPhotoIndex = nextMatchedIdx;
    }
  }
  const nextPhoto = photos[nextPhotoIndex];

  const currentImg = imagesCache.get(currentPhoto.id);
  const nextImg = nextPhoto ? imagesCache.get(nextPhoto.id) : null;

  // Calculate local scene progress (0 to 1)
  const sceneDuration = Math.max(1, (activeScene.endSec || totalDuration) - (activeScene.startSec || 0));
  const sceneProgress = Math.min(1, Math.max(0, (currentTime - (activeScene.startSec || 0)) / sceneDuration));

  // 1. Draw Photo with Cinematic Ken Burns (Pan & Zoom)
  const drawKenBurns = (img: HTMLImageElement, progress: number, motion: string, alpha: number = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;

    // Apply Visual Filter
    if (settings.visualFilter === 'luxury_warm') {
      ctx.filter = 'contrast(106%) brightness(104%) saturate(115%) sepia(8%)';
    } else if (settings.visualFilter === 'cinematic_vibrant') {
      ctx.filter = 'contrast(112%) brightness(102%) saturate(125%)';
    } else if (settings.visualFilter === 'bright_modern') {
      ctx.filter = 'contrast(103%) brightness(108%) saturate(108%)';
    }

    let scale = 1.08;
    let offsetX = 0;
    let offsetY = 0;

    // Organic steadicam / handheld gimbal micro-drift (shooting langsung di lokasi)
    const steadicamX = Math.sin(currentTime * 1.8) * 3.5;
    const steadicamY = Math.cos(currentTime * 1.4) * 2.5;

    if (motion.includes('zoom-in') || motion.includes('dramatic')) {
      scale = 1.04 + progress * 0.18;
      offsetX = (progress - 0.5) * 20;
    } else if (motion.includes('zoom-out')) {
      scale = 1.22 - progress * 0.16;
      offsetY = (progress - 0.5) * 15;
    } else if (motion.includes('pan-right')) {
      scale = 1.15;
      offsetX = (progress - 0.5) * 55;
      offsetY = Math.sin(progress * Math.PI) * 10;
    } else if (motion.includes('pan-left')) {
      scale = 1.15;
      offsetX = (0.5 - progress) * 55;
      offsetY = Math.sin(progress * Math.PI) * 10;
    } else if (motion.includes('tilt-up')) {
      scale = 1.14;
      offsetY = (progress - 0.5) * 45;
    } else {
      // Cinematic slow architectural dolly
      scale = 1.08 + Math.sin(progress * Math.PI) * 0.08;
      offsetX = (progress - 0.5) * 30;
    }

    offsetX += steadicamX;
    offsetY += steadicamY;

    const imgAspect = img.width / img.height;
    const canvasAspect = width / height;
    let drawW: number;
    let drawH: number;

    if (imgAspect > canvasAspect) {
      drawH = height * scale;
      drawW = drawH * imgAspect;
    } else {
      drawW = width * scale;
      drawH = drawW / imgAspect;
    }

    const drawX = (width - drawW) / 2 + offsetX;
    const drawY = (height - drawH) / 2 + offsetY;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Natural Cinematic Golden Sun Glare / Ambient Sunlight Bloom on Location
    const sunIntensity = 0.18 + Math.sin(progress * Math.PI) * 0.08;
    const sunX = width * 0.85 + Math.sin(currentTime) * 30;
    const sunY = height * 0.12 + Math.cos(currentTime) * 20;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, width * 0.7);
    sunGrad.addColorStop(0, `rgba(255, 240, 200, ${sunIntensity})`);
    sunGrad.addColorStop(0.35, `rgba(255, 215, 140, ${sunIntensity * 0.45})`);
    sunGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, width, height);

    ctx.restore();
  };

  if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
    drawKenBurns(currentImg, sceneProgress, activeScene.motionStyle || 'zoom-in', 1.0);
  } else {
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);
  }

  // ==========================================
  // CUSTOM CINEMATIC TRANSITIONS BETWEEN SCENES
  // ==========================================
  const transitionEffect = settings.transitionEffect || 'cross_dissolve';
  const transitionDuration = settings.transitionDuration || 0.75;
  const remainingInScene = (activeScene.endSec || totalDuration) - currentTime;

  if (remainingInScene < transitionDuration && nextImg && nextImg.complete && nextImg.naturalWidth > 0) {
    const rawT = (transitionDuration - remainingInScene) / transitionDuration;
    const t = Math.min(1, Math.max(0, rawT)); // 0 to 1

    if (transitionEffect === 'cross_dissolve') {
      // Smooth S-Curve ease-in-out alpha
      const fadeAlpha = t * t * (3 - 2 * t);
      drawKenBurns(nextImg, 0, activeScene.motionStyle || 'zoom-in', fadeAlpha);
    } else if (transitionEffect === 'light_leak') {
      // Crossfade base
      const fadeAlpha = t * t * (3 - 2 * t);
      drawKenBurns(nextImg, 0, 'zoom-in', fadeAlpha);

      // Anamorphic Warm Light Leak Film Burn Flare (Peak intensity at t = 0.5)
      const leakIntensity = Math.sin(t * Math.PI);
      if (leakIntensity > 0.04) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';

        // Sweeping beam of golden-orange and luminous white light
        const leakX = width * (0.2 + t * 0.7);
        const leakY = height * (0.3 + Math.sin(t * Math.PI) * 0.35);
        const leakGrad = ctx.createRadialGradient(leakX, leakY, 15, leakX, leakY, width * 0.85);
        leakGrad.addColorStop(0, `rgba(255, 255, 255, ${leakIntensity * 0.95})`);
        leakGrad.addColorStop(0.25, `rgba(255, 210, 120, ${leakIntensity * 0.85})`);
        leakGrad.addColorStop(0.55, `rgba(249, 115, 22, ${leakIntensity * 0.65})`);
        leakGrad.addColorStop(0.85, `rgba(225, 29, 72, ${leakIntensity * 0.3})`);
        leakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = leakGrad;
        ctx.fillRect(0, 0, width, height);

        // Additional diagonal anamorphic streak across the lens
        const streakGrad = ctx.createLinearGradient(0, leakY - 70, width, leakY + 70);
        streakGrad.addColorStop(0, 'rgba(255, 180, 50, 0)');
        streakGrad.addColorStop(0.5, `rgba(255, 245, 210, ${leakIntensity * 0.75})`);
        streakGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
        ctx.fillStyle = streakGrad;
        ctx.fillRect(0, leakY - 80, width, 160);

        ctx.restore();
      }
    } else if (transitionEffect === 'smooth_zoom') {
      // Smooth dynamic zoom-through: incoming room zooms through with seamless velocity
      const fadeAlpha = Math.min(1, t * 1.5);
      ctx.save();
      const extraScale = 1.35 - t * 0.3; // Starts scaled up and pulls in
      const drawCustomZoom = (img: HTMLImageElement, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        const s = extraScale;
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let dW: number, dH: number;
        if (imgAspect > canvasAspect) {
          dH = height * s;
          dW = dH * imgAspect;
        } else {
          dW = width * s;
          dH = dW / imgAspect;
        }
        ctx.drawImage(img, (width - dW) / 2, (height - dH) / 2, dW, dH);
        ctx.restore();
      };
      drawCustomZoom(nextImg, fadeAlpha);
      ctx.restore();
    } else if (transitionEffect === 'film_blur') {
      // Defocus rack-focus: blur peaks at t=0.5
      const blurAmount = Math.sin(t * Math.PI) * 10;
      const fadeAlpha = t * t * (3 - 2 * t);
      ctx.save();
      if (blurAmount > 0.4) {
        ctx.filter = `blur(${blurAmount.toFixed(1)}px) brightness(${100 + blurAmount * 2.5}%)`;
      }
      drawKenBurns(nextImg, 0, 'zoom-in', fadeAlpha);
      ctx.restore();
    } else if (transitionEffect === 'whip_pan') {
      // Dynamic whip swipe with horizontal motion
      const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const panOffset = (1 - easeT) * width;
      const motionBlurStreak = Math.sin(t * Math.PI) * 16;

      ctx.save();
      const drawPanned = (img: HTMLImageElement, offsetX: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;
        const s = 1.1;
        const imgAspect = img.width / img.height;
        const canvasAspect = width / height;
        let dW: number, dH: number;
        if (imgAspect > canvasAspect) {
          dH = height * s;
          dW = dH * imgAspect;
        } else {
          dW = width * s;
          dH = dW / imgAspect;
        }
        ctx.drawImage(img, (width - dW) / 2 + offsetX, (height - dH) / 2, dW, dH);
        ctx.restore();
      };

      drawPanned(nextImg, panOffset, 1.0);

      // Directional motion blur streak highlight
      if (motionBlurStreak > 2) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.14 * (motionBlurStreak / 16)})`;
        ctx.fillRect(0, 0, width, height);
      }
      ctx.restore();
    }
  }

  // 2. Cinematic Vignette & Dark Gradients for Crisp Legibility
  // Top gradient
  const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.28);
  topGrad.addColorStop(0, 'rgba(2, 6, 23, 0.85)');
  topGrad.addColorStop(0.5, 'rgba(2, 6, 23, 0.45)');
  topGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, height * 0.28);

  // Bottom gradient
  const bottomGrad = ctx.createLinearGradient(0, height * 0.55, 0, height);
  bottomGrad.addColorStop(0, 'rgba(2, 6, 23, 0)');
  bottomGrad.addColorStop(0.35, 'rgba(2, 6, 23, 0.6)');
  bottomGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
  ctx.fillStyle = bottomGrad;
  ctx.fillRect(0, height * 0.55, width, height * 0.45);

  // 3. Top Branding Header (Agency Logo & Agent Info)
  if (settings.watermarkEnabled) {
    const isTop = settings.logoPosition.startsWith('top');
    const isRight = settings.logoPosition.endsWith('right');

    const brandX = isRight ? width - 240 : 24;
    const brandY = isTop ? 28 : height - 120;

    // Glass pill background
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(brandX, brandY, 216, 68, 14);
    ctx.fill();
    ctx.stroke();

    if (logoImage && logoImage.complete && logoImage.naturalWidth > 0) {
      // Draw Agency Logo
      const logoScale = settings.logoScale || 1.0;
      const logoW = 54 * logoScale;
      const logoH = 46 * logoScale;
      ctx.drawImage(logoImage, brandX + 8, brandY + (68 - logoH) / 2, logoW, logoH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(agent.agencyName ? agent.agencyName.slice(0, 14) : 'PRO AGENCY', brandX + 70, brandY + 28);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(agent.name ? agent.name.slice(0, 16) : 'Verified Agent', brandX + 70, brandY + 48);
    } else {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(agent.agencyName || 'PROPERTI PRO', brandX + 16, brandY + 30);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(agent.name || 'Verified Agent', brandX + 16, brandY + 50);
    }
    ctx.restore();
  }

  // 4. Headline / Title Ribbon (Top-Left or Under Brand)
  if (propertyData.price || propertyData.title) {
    ctx.save();
    const priceY = 110;

    // Price Badge (High Visibility Gold / Amber Gradient)
    if (propertyData.price) {
      const priceGrad = ctx.createLinearGradient(24, priceY, 320, priceY + 42);
      priceGrad.addColorStop(0, '#f59e0b');
      priceGrad.addColorStop(1, '#ea580c');
      ctx.fillStyle = priceGrad;
      ctx.beginPath();
      ctx.roundRect(24, priceY, 290, 44, 10);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('HARGA SPESIAL', 38, priceY + 16);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(propertyData.price, 38, priceY + 36);
    }

    // Property Title & Location
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 10;
    const shortTitle = (propertyData.title || propertyData.propertyType || '').slice(0, 32);
    ctx.fillText(shortTitle, 24, priceY + 76);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
    const shortLoc = (propertyData.location || '').slice(0, 38);
    ctx.fillText('📍 ' + shortLoc, 24, priceY + 100);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // 5. Spec Badges (LT, LB, KT, KM, SHM) - Animated or clean lower pills
  if (settings.showBadges && propertyData) {
    ctx.save();
    const badges: string[] = [];
    if (propertyData.landArea) badges.push(`LT ${propertyData.landArea}m²`);
    if (propertyData.buildingArea) badges.push(`LB ${propertyData.buildingArea}m²`);
    if (propertyData.bedrooms) badges.push(`${propertyData.bedrooms} KT`);
    if (propertyData.bathrooms) badges.push(`${propertyData.bathrooms} KM`);
    if (propertyData.certificate) badges.push(propertyData.certificate.slice(0, 6));

    const badgeY = height - 210;
    let badgeX = 24;

    badges.slice(0, 5).forEach((badgeText) => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, 96, 32, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, badgeX + 48, badgeY + 21);
      ctx.textAlign = 'left';

      badgeX += 104;
    });
    ctx.restore();
  }

  // 6. Animated Captions / Subtitle (TikTok/Reels Style)
  const spokenText = activeScene.spokenText || script.fullScript || '';
  if (spokenText) {
    ctx.save();
    const captionY = height - 140;

    // Caption Colors based on theme
    let boxBg = 'rgba(15, 23, 42, 0.9)';
    let highlightColor = '#facc15'; // Yellow
    if (settings.captionTheme === 'luxury_gold') {
      highlightColor = '#fbbf24';
      boxBg = 'rgba(26, 18, 7, 0.9)';
    } else if (settings.captionTheme === 'cyan_modern') {
      highlightColor = '#38bdf8';
      boxBg = 'rgba(8, 28, 44, 0.9)';
    } else if (settings.captionTheme === 'minimal_white') {
      highlightColor = '#ffffff';
      boxBg = 'rgba(0, 0, 0, 0.85)';
    }

    // Split text into words to create karaoke animated reading
    const words = spokenText.split(' ');
    const activeWordIndex = Math.min(words.length - 1, Math.floor(sceneProgress * words.length));

    // Show a window of words around active word
    const startIdx = Math.max(0, activeWordIndex - 2);
    const endIdx = Math.min(words.length, startIdx + 6);
    const displayedWords = words.slice(startIdx, endIdx);

    // Caption container pill
    ctx.fillStyle = boxBg;
    ctx.strokeStyle = highlightColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(20, captionY - 32, width - 40, 56, 12);
    ctx.fill();
    ctx.stroke();

    // Render words with current active word in bold highlight
    ctx.font = `bold ${settings.captionFontSize || 18}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';

    let renderedText = '';
    displayedWords.forEach((w, idx) => {
      const realIdx = startIdx + idx;
      if (realIdx === activeWordIndex) {
        renderedText += `【 ${w.toUpperCase()} 】 `;
      } else {
        renderedText += `${w} `;
      }
    });

    ctx.fillStyle = highlightColor;
    ctx.fillText(renderedText.trim(), width / 2, captionY + 4);
    ctx.textAlign = 'left';
    ctx.restore();
  }

  // 7. Footer Contact Call-to-Action Bar (WhatsApp CTA)
  ctx.save();
  const ctaY = height - 64;
  const ctaGrad = ctx.createLinearGradient(0, ctaY, width, ctaY);
  ctaGrad.addColorStop(0, '#16a34a'); // WhatsApp green
  ctaGrad.addColorStop(1, '#059669');
  ctx.fillStyle = ctaGrad;
  ctx.fillRect(0, ctaY, width, 64);

  // WhatsApp Icon / Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const waContact = agent.whatsapp || '089673686625';
  ctx.fillText(`💬 INFO & SURVEY HUBUNGI: ${agent.name.toUpperCase()} (WA: ${waContact})`, width / 2, ctaY + 38);
  ctx.textAlign = 'left';
  ctx.restore();

  // 8. Video Progress Bar at Top
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(0, 0, width, 5);
  const progRatio = Math.min(1, Math.max(0, currentTime / totalDuration));
  const progGrad = ctx.createLinearGradient(0, 0, width, 0);
  progGrad.addColorStop(0, '#f59e0b');
  progGrad.addColorStop(1, '#10b981');
  ctx.fillStyle = progGrad;
  ctx.fillRect(0, 0, width * progRatio, 5);
}

/**
 * Record and Export Canvas to Video File (MP4 or WebM) with Audio Track Mixed!
 */
export async function exportVideoWithAudio({
  duration,
  aspectRatio,
  script,
  photos,
  propertyData,
  agent,
  settings,
  onProgress,
}: {
  duration: number;
  aspectRatio: AspectRatioType;
  script: GeneratedVideoScript;
  photos: PropertyPhoto[];
  propertyData: PropertyFormData;
  agent: AgentProfile;
  settings: VideoEditorSettings;
  onProgress?: (progressPercent: number, statusText: string) => void;
}): Promise<Blob> {
  // Preload images
  if (onProgress) onProgress(5, 'Menyiapkan aset visual & foto properti...');
  const { imagesCache, logoImage } = await preloadImages(photos, agent.agencyLogoUrl);

  const { width, height } = getResolutionForAspect(aspectRatio);
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  // Prepare audio stream from soundEngine
  if (onProgress) onProgress(15, 'Menyiapkan audio BGM & narasi suara room tour...');
  soundEngine.init();
  soundEngine.setVolumes(settings.bgmVolume, settings.voiceVolume);
  soundEngine.startBgm(settings.bgmTrack);
  if (settings.voiceVolume > 0 && script.fullScript) {
    soundEngine.speakNaturalRoomTour(script.fullScript, propertyData.voiceName || 'Kore').catch(() => {});
  }

  // Get video stream from canvas
  const videoStream = offscreenCanvas.captureStream(30); // 30 FPS

  // Combine video + audio streams
  const combinedStream = new MediaStream();
  videoStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));

  const audioTrack = soundEngine.getMediaStreamTrack();
  if (audioTrack) {
    combinedStream.addTrack(audioTrack);
  }

  // Determine supported mime type
  const mimeTypes = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4;codecs=avc1,mp4a.40.2',
    'video/mp4',
  ];
  let chosenMime = 'video/webm';
  for (const m of mimeTypes) {
    if (MediaRecorder.isTypeSupported(m)) {
      chosenMime = m;
      break;
    }
  }

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(combinedStream, {
    mimeType: chosenMime,
    videoBitsPerSecond: 4500000, // 4.5 Mbps high quality
  });

  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      soundEngine.stopBgm();
      soundEngine.stopAllSpeech();
      const outputBlob = new Blob(recordedChunks, { type: chosenMime });
      if (onProgress) onProgress(100, 'Selesai! Video siap diunduh.');
      resolve(outputBlob);
    };

    recorder.onerror = (err) => {
      soundEngine.stopBgm();
      soundEngine.stopAllSpeech();
      reject(err);
    };

    recorder.start(250);

    // Render frame by frame at 30fps
    const fps = 30;
    const totalFrames = Math.round(duration * fps);
    let currentFrame = 0;

    const renderNextFrame = () => {
      if (currentFrame > totalFrames) {
        recorder.stop();
        return;
      }

      const currentTime = currentFrame / fps;
      renderVideoFrame({
        canvas: offscreenCanvas,
        currentTime,
        totalDuration: duration,
        script,
        photos,
        propertyData,
        agent,
        settings,
        imagesCache,
        logoImage,
      });

      const pct = Math.round(20 + (currentFrame / totalFrames) * 75);
      if (onProgress && currentFrame % 15 === 0) {
        onProgress(pct, `Meng-encode frame ${currentFrame} / ${totalFrames} (${Math.round(currentTime)}s)...`);
      }

      currentFrame++;
      // Give browser room to flush canvas to stream
      setTimeout(renderNextFrame, 1000 / fps);
    };

    renderNextFrame();
  });
}
