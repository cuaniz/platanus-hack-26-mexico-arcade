// ─────────────────────────────────────────────────────────
//  ScienceBrawl · Phaser 3 · Visual Overhaul v2
//  Skins fieles a cada científico + poderes temáticos
//  Fondos: laboratorio de batalla + academia de ciencias
// ─────────────────────────────────────────────────────────

const W = 800, H = 600;
const FLOOR_Y = H - 88;
const GRAVITY = 1750;
const JUMP_VEL = -640;
const MOVE_SPD = 240;

const C = {
  // Cielo / ambiente laboratorio nocturno
  sky1: 0x05080f, sky2: 0x0a1428, sky3: 0x142948,
  horizon: 0x2a6cff,
  moon: 0xe8f4ff, moonGlow: 0x6aa8ff, moonHalo: 0x2255cc,

  // Estructura del lab (sustituye pilares)
  pillarDark: 0x0a1020, pillarMid: 0x1a2a44, pillarLight: 0x3a5a8a, pillarGlow: 0x4ff7ff,
  ground: 0x080c14, groundMid: 0x0e1626, groundLine: 0x1e3a5c, groundGlow: 0x4ff7ff,
  fire1: 0x22aaff, fire2: 0x6ae3ff, fire3: 0xeaffff, fireSmoke: 0x0a1828,

  // Bases color de jugador / bot (chaqueta/bata)
  playerFill: 0xe8eef5, playerMid: 0xb8c4d0, playerDark: 0x6a7280, playerSkin: 0xffd9b8, playerHair: 0x2a1640,
  botFill:    0xd8d6ce, botMid:    0xaaa89c, botDark:    0x5a584c, botSkin:    0xffd0b0, botHair:    0x40060e,

  hpGreen: 0x29ffb4, hpYellow: 0xffd64a, hpRed: 0xff2a5c,
  white: 0xffffff, black: 0x000000,

  // Científicos (colores neón temáticos)
  teslaNeon: 0x4ff7ff, teslaBright: 0xeaffff,
  einsteinNeon: 0xffdd44, einsteinBright: 0xfffacc,
  turingNeon: 0x66ff99, turingBright: 0xccffdd,
  curieNeon: 0x88ff66, curieBright: 0xddffcc,   // verde radiactivo
  darwinNeon: 0x88cc55, darwinBright: 0xddeeaa, // verde naturaleza
  hawkingNeon: 0xcc88ff, hawkingBright: 0xeeddff,
  hitFlash: 0xffffff,
  rim: 0xffe6a8,
  metal: 0xb8b8c8, metalDark: 0x4c4c5e, gold: 0xffc848, goldDark: 0x8a5a10,

  // Compatibilidad (heredado)
  aresNeon: 0x4ff7ff, zeusNeon: 0xffdd44,

  // Lab
  chalkboard: 0x0d2818, chalk: 0xeaffea,
  copper: 0xb5651d, copperBright: 0xe8a05a,
  reactor: 0x1a3a5a, reactorGlow: 0x6affd6
};

// ─────────── 6 CIENTÍFICOS CON PODERES ÚNICOS ─────────────
const SCIENTISTS = [
  {
    name: 'TESLA',  neonColor: C.teslaNeon,  brightColor: C.teslaBright,  damageMultiplier: 1.0,
    special: { type: 'arc',       reach: 220, height: 200, duration: 0.55, cooldown: 4.5, dmgMult: 1.0,  label: '⚡ ARCO VOLTAICO' },
    title: 'Maestro del Rayo',
    coat: 0x1a1f2e, coatTrim: 0x4ff7ff, hairColor: 0x141414, skinColor: 0xfde0bf
  },
  {
    name: 'EINSTEIN',neonColor: C.einsteinNeon,brightColor: C.einsteinBright,damageMultiplier: 0.95,
    special: { type: 'gravity',   reach: 300, height: 140, duration: 0.60, cooldown: 5.0, dmgMult: 0.85, label: '🌀 ONDA GRAVITACIONAL' },
    title: 'Dobla el Espacio',
    coat: 0x3a2a1e, coatTrim: 0xffdd44, hairColor: 0xe8e4dc, skinColor: 0xfdd6b0
  },
  {
    name: 'TURING', neonColor: C.turingNeon,brightColor: C.turingBright,damageMultiplier: 1.05,
    special: { type: 'teleport',  reach: 100, height: 130, duration: 0.50, cooldown: 4.0, dmgMult: 1.15, label: '💾 LOOP INFINITO' },
    title: 'Padre del Bit',
    coat: 0x2a3e2a, coatTrim: 0x66ff99, hairColor: 0x3a2818, skinColor: 0xfde0c0
  },
  {
    name: 'CURIE', neonColor: C.curieNeon,brightColor: C.curieBright,damageMultiplier: 1.0,
    special: { type: 'radiation', reach: 130, height: 160, duration: 0.65, cooldown: 5.5, dmgMult: 1.2,  label: '☢️ NUBE RADIACTIVA' },
    title: 'Reina Radiactiva',
    coat: 0xe8e8e0, coatTrim: 0x88ff66, hairColor: 0x2a1a10, skinColor: 0xfde2c4
  },
  {
    name: 'DARWIN', neonColor: C.darwinNeon,brightColor: C.darwinBright,damageMultiplier: 1.1,
    special: { type: 'dash',      reach: 120, height: 110, duration: 0.45, cooldown: 4.0, dmgMult: 1.35, label: '🦎 EVOLUCIÓN SÚBITA' },
    title: 'Selección Natural',
    coat: 0x2e2418, coatTrim: 0x88cc55, hairColor: 0xeeeee0, skinColor: 0xf5cca0
  },
  {
    name: 'HAWKING',neonColor: C.hawkingNeon,brightColor: C.hawkingBright,damageMultiplier: 0.9,
    special: { type: 'singularity',reach: 260, height: 200, duration: 0.70, cooldown: 6.0, dmgMult: 1.25, label: '🕳️ SINGULARIDAD' },
    title: 'El Agujero Negro',
    coat: 0x1a1a24, coatTrim: 0xcc88ff, hairColor: 0xcccccc, skinColor: 0xfde0c4
  }
];

// ─────────────────────────────────────────────────────────
//  Sonidos sintéticos
// ─────────────────────────────────────────────────────────
let SELECTED_SCI_INDEX = 0;

const CABINET_KEYS = {
  P1_U: ['w'],
  P1_D: ['s'],
  P1_L: ['a'],
  P1_R: ['d'],
  P1_1: ['u'],
  P1_2: ['i'],
  P1_3: ['o'],
  P1_4: ['j'],
  P1_5: ['k'],
  P1_6: ['l'],
  P2_U: ['ArrowUp'],
  P2_D: ['ArrowDown'],
  P2_L: ['ArrowLeft'],
  P2_R: ['ArrowRight'],
  P2_1: ['r'],
  P2_2: ['t'],
  P2_3: ['y'],
  P2_4: ['f'],
  P2_5: ['g'],
  P2_6: ['h'],
  START1: ['Enter'],
  START2: ['2'],
};

const KEYBOARD_TO_ARCADE = {};
for (const [arcadeCode, keys] of Object.entries(CABINET_KEYS)) {
  for (const key of keys) KEYBOARD_TO_ARCADE[normalizeIncomingKey(key)] = arcadeCode;
}

function normalizeIncomingKey(key) {
  if (typeof key !== 'string' || key.length === 0) return '';
  if (key === ' ') return 'space';
  return key.toLowerCase();
}

function createArcadeControls(scene) {
  scene.controls = { held: Object.create(null), pressed: Object.create(null) };
  const onKeyDown = (event) => {
    const arcadeCode = KEYBOARD_TO_ARCADE[normalizeIncomingKey(event.key)];
    if (!arcadeCode) return;
    if (!scene.controls.held[arcadeCode]) scene.controls.pressed[arcadeCode] = true;
    scene.controls.held[arcadeCode] = true;
    event.preventDefault();
  };
  const onKeyUp = (event) => {
    const arcadeCode = KEYBOARD_TO_ARCADE[normalizeIncomingKey(event.key)];
    if (!arcadeCode) return;
    scene.controls.held[arcadeCode] = false;
    event.preventDefault();
  };
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  scene.events.once('shutdown', () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  });
}

function isControlHeld(scene, controlCode) {
  return scene.controls && scene.controls.held[controlCode] === true;
}

function consumeAnyPressedControl(scene, controlCodes) {
  if (!scene.controls) return false;
  for (const controlCode of controlCodes) {
    if (scene.controls.pressed[controlCode]) {
      scene.controls.pressed[controlCode] = false;
      return true;
    }
  }
  return false;
}

class SoundFX {
  constructor(scene) {
    this.scene = scene;
    this.audioCtx = null;
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { console.warn("Web Audio not supported"); }
  }
  playHit()    { if (this.audioCtx) this._playTone(220, 0.08, 'sine'); }
  playSpecial(){ if (!this.audioCtx) return; this._playTone(440, 0.15, 'sawtooth'); setTimeout(() => this._playTone(880, 0.1, 'sine'), 50); }
  playJump()   { if (this.audioCtx) this._playTone(330, 0.1, 'triangle'); }
  playKO()     { if (!this.audioCtx) return; this._playTone(110, 0.6, 'sawtooth'); setTimeout(() => this._playTone(82, 0.8, 'sawtooth'), 200); }
  _playTone(freq, duration, type='sine') {
    const ctx = this.audioCtx; const now = ctx.currentTime;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(); osc.stop(now + duration);
  }
}

// ─────────────────────────────────────────────────────────
//  FIGHTER
// ─────────────────────────────────────────────────────────
class Fighter {
  constructor(scene, x, isPlayer, scientist) {
    this.scene = scene;
    this.x = x; this.y = FLOOR_Y;
    this.vx = 0; this.vy = 0;
    this.hp = 100; this.maxHp = 100;
    this.onGround = true;
    this.facing = isPlayer ? 1 : -1;
    this.isPlayer = isPlayer;
    this.sci = scientist;

    this.state = 'idle';
    this.stateTimer = 0;
    this.hitCooldown = 0;
    this.specialCooldown = 0;
    this.punchActive = false;
    this.kickActive = false;
    this.specialActive = false;
    this.crouchAttackActive = false;
    this.hitFlashTimer = 0;
    this.shakeX = 0;
    this.invisible = false;
    this.radiationCloud = null;

    this.specialParticles = [];
    this.shadowGfx = scene.add.graphics();
    this.capeGfx   = scene.add.graphics();
    this.gfx       = scene.add.graphics();
    this.glowGfx   = scene.add.graphics();
    this.width = 38;
    this.height = 78;

    this.motionEchoes = [];
    this.echoTimer = 0;
    this.embers = [];
    this.emberTimer = 0;
    this.capeSegs = Array.from({ length: 6 }, (_, i) => ({ x: 0, y: 0, ox: 0, oy: 0 }));
  }

  get hitbox() {
    const crouched = (this.state === 'crouch' || this.state === 'crouchAttack');
    const h = crouched ? this.height * 0.55 : this.height;
    return { x: this.x - this.width / 2, y: this.y - h, w: this.width, h: h };
  }

  get attackBox() {
    const sp = this.sci.special;
    const crouched = (this.state === 'crouch' || this.state === 'crouchAttack');
    if (this.crouchAttackActive) {
      return { x: this.facing > 0 ? this.x + 5 : this.x - 85, y: this.y - 16, w: 80, h: 18 };
    }
    if (this.punchActive) {
      return { x: this.facing > 0 ? this.x + 5 : this.x - 80,
        y: this.y - (crouched ? this.height * 0.45 : this.height * 0.75), w: 75, h: 18 };
    }
    if (this.kickActive) {
      return { x: this.facing > 0 ? this.x : this.x - 90,
        y: this.y - (crouched ? this.height * 0.3 : this.height * 0.48), w: 90, h: 22 };
    }
    if (this.specialActive) {
      if (sp.type === 'teleport')   return { x: this.x - 50, y: this.y - sp.height, w: 100, h: sp.height };
      if (sp.type === 'gravity')    return { x: this.facing > 0 ? this.x + 10 : this.x - sp.reach - 10, y: this.y - sp.height, w: sp.reach, h: sp.height };
      if (sp.type === 'radiation')  return { x: this.x - 70, y: this.y - 60, w: 140, h: 90 };
      if (sp.type === 'singularity')return { x: this.x - sp.reach/2, y: this.y - sp.height, w: sp.reach, h: sp.height };
      return { x: this.facing > 0 ? this.x - 20 : this.x - sp.reach, y: this.y - sp.height, w: sp.reach + 20, h: sp.height };
    }
    return null;
  }

  setState(s, duration = 0) {
    if (this.state === 'ko') return;
    this.state = s; this.stateTimer = duration;
    this.punchActive = false; this.kickActive = false;
    this.specialActive = false; this.crouchAttackActive = false;
    this.gfx.setRotation(0); this.gfx.setPosition(0, 0);
  }

  crouchAttack() {
    if (!['idle', 'crouch', 'walk'].includes(this.state)) return;
    this.setState('crouchAttack', 0.22);
    this.scene.time.delayedCall(40, () => { this.crouchAttackActive = true; });
    this.scene.time.delayedCall(130, () => { this.crouchAttackActive = false; });
  }
  punch() {
    if (!['idle', 'walk', 'jump'].includes(this.state) && this.state !== 'crouch') return;
    if (this.state === 'crouch') { this.crouchAttack(); return; }
    this.setState('punch', 0.18);
    this.scene.time.delayedCall(30,  () => { this.punchActive = true; });
    this.scene.time.delayedCall(110, () => { this.punchActive = false; });
    this.scene.soundFX.playHit();
  }
  kick() {
    if (!['idle', 'walk', 'jump'].includes(this.state) && this.state !== 'crouch') return;
    if (this.state === 'crouch') { this.crouchAttack(); return; }
    this.setState('kick', 0.24);
    this.scene.time.delayedCall(50,  () => { this.kickActive = true; });
    this.scene.time.delayedCall(160, () => { this.kickActive = false; });
    this.scene.soundFX.playHit();
  }

  special() {
    if (this.specialCooldown > 0) return;
    if (!['idle', 'walk'].includes(this.state)) return;
    const sp = this.sci.special;
    this.setState('special', sp.duration);
    this.specialCooldown = sp.cooldown;
    this.specialParticles = [];
    this.scene.soundFX.playSpecial();

    switch(sp.type) {
      case 'arc':
        this.scene.time.delayedCall(40, () => { this.specialActive = true; this.vx = this.facing * 60; });
        this.scene.time.delayedCall(sp.duration * 1000 - 80, () => { this.specialActive = false; this.vx = 0; });
        break;
      case 'gravity':
        this.scene.time.delayedCall(40, () => { this.specialActive = true; this.vx = this.facing * 40; });
        this.scene.time.delayedCall(100, () => {
          const opp = this.isPlayer ? this.scene.bot : this.scene.player;
          if (opp && !opp.hitCooldown) { opp.vx += this.facing * 380; opp.vy = -300; }
        });
        this.scene.time.delayedCall(sp.duration * 1000 - 80, () => { this.specialActive = false; this.vx = 0; });
        break;
      case 'teleport':
        this.invisible = true; this.specialActive = false;
        const oppTele = this.isPlayer ? this.scene.bot : this.scene.player;
        this.scene.time.delayedCall(200, () => {
          this.x = oppTele.x + (-this.facing * 70);
          this.invisible = false; this.specialActive = true;
          this.scene.time.delayedCall(30, () => { this.specialActive = false; });
        });
        break;
      case 'radiation':
        this.specialActive = true; this.vx = 0;
        if (this.radiationCloud) this.radiationCloud.clear();
        this.radiationCloud = this.scene.add.graphics();
        const cloudX = this.x; const cloudY = this.y - 40;
        const interval = this.scene.time.addEvent({
          delay: 300, repeat: Math.floor(sp.duration * 1000 / 300),
          callback: () => {
            const opp = this.isPlayer ? this.scene.bot : this.scene.player;
            if (opp && !opp.hitCooldown && Math.abs(opp.x - cloudX) < 90 && Math.abs(opp.y - cloudY) < 70) {
              opp.hurt(6 + Math.random() * 4, this.facing);
            }
          }
        });
        this.scene.time.delayedCall(sp.duration * 1000, () => {
          this.specialActive = false;
          if (this.radiationCloud) this.radiationCloud.clear();
          interval.remove();
        });
        break;
      case 'dash':
        this.scene.time.delayedCall(40, () => { this.specialActive = true; this.vx = this.facing * 700; this.vy = -180; });
        this.scene.time.delayedCall(sp.duration * 1000 - 60, () => { this.specialActive = false; this.vx = 0; });
        break;
      case 'singularity':
        this.scene.time.delayedCall(40, () => { this.specialActive = true; this.vx = this.facing * 30; });
        this.scene.time.delayedCall(120, () => {
          const opp = this.isPlayer ? this.scene.bot : this.scene.player;
          if (opp && !opp.hitCooldown) {
            const pullDir = (this.x - opp.x) > 0 ? 1 : -1;
            opp.vx += pullDir * 380; opp.vy = -280;
          }
        });
        this.scene.time.delayedCall(sp.duration * 1000 - 80, () => { this.specialActive = false; this.vx = 0; });
        break;
    }
  }

  hurt(dmg, knockbackDir = 0) {
    if (this.hitCooldown > 0) return;
    this.hp = Math.max(0, this.hp - (dmg * this.sci.damageMultiplier));
    this.hitCooldown = 0.5; this.hitFlashTimer = 0.14;
    const kb = knockbackDir !== 0 ? knockbackDir : this.facing * -1;
    this.vx = kb * 420; this.vy = -440; this.shakeX = kb * -15;
    if (this.hp <= 0) { this.setState('ko', 9999); this.vx = kb * 300; this.vy = -480; this.scene.soundFX.playKO(); }
    else { this.setState('hurt', 0.2); this.scene.soundFX.playHit(); }
  }

  update(dt) {
    this.stateTimer    = Math.max(0, this.stateTimer - dt);
    this.hitCooldown   = Math.max(0, this.hitCooldown - dt);
    this.specialCooldown = Math.max(0, this.specialCooldown - dt);
    this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);
    this.shakeX *= 0.75;

    if (!this.invisible && (this.state !== 'ko' || !this.onGround)) {
      if (!this.onGround) this.vy += GRAVITY * dt;
      this.x += (this.vx + this.shakeX) * dt;
      this.y += this.vy * dt;
    }

    if (this.y >= FLOOR_Y) {
      this.y = FLOOR_Y; this.vy = 0; this.onGround = true;
      if (this.state === 'jump') this.setState('idle');
      if (this.state === 'ko') this.vx = 0;
    } else { this.onGround = false; }

    this.x = Phaser.Math.Clamp(this.x, this.width / 2 + 20, W - this.width / 2 - 20);

    if (this.stateTimer <= 0 && ['punch', 'kick', 'hurt', 'special', 'crouchAttack'].includes(this.state)) {
      this.setState('idle');
      if (this.state !== 'jump') this.vx = 0;
    }

    this.echoTimer -= dt;
    if (this.echoTimer <= 0 && (this.state === 'walk' || !this.onGround || this.state === 'special')) {
      if (this.motionEchoes.length < 6) {
        this.motionEchoes.push({ x: this.x, y: this.y, alpha: 0.55, state: this.state, f: this.facing });
      }
      this.echoTimer = 0.08;
    }
    this.motionEchoes = this.motionEchoes.filter(e => { e.alpha -= dt * 2.8; return e.alpha > 0; });

    if (this.state === 'special' && this.specialActive && this.sci.special.type !== 'radiation') {
      const spType = this.sci.special.type;
      for (let i = 0; i < 3; i++) {
        this.specialParticles.push({
          x: this.x + (Math.random() - 0.5) * 50,
          y: this.y - Math.random() * this.height,
          vx: (Math.random() - 0.5) * 140,
          vy: -60 - Math.random() * 160,
          life: 0.35, maxLife: 0.35,
          kind: spType, color: this.sci.neonColor
        });
      }
    }
    this.specialParticles = this.specialParticles.filter(p => {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.kind !== 'arc') p.vy += 400 * dt;
      return p.life > 0;
    });

    if (!this.invisible) this.draw();
    else { this.gfx.clear(); this.shadowGfx.clear(); this.glowGfx.clear(); this.capeGfx.clear(); }
  }

  _drawJaggedBolt(g, x1, y1, x2, y2, color, width = 3, segs = 6) {
    const pts = [{ x: x1, y: y1 }];
    for (let i = 1; i < segs; i++) {
      const t = i / segs;
      const cx = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 14;
      const cy = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 6;
      pts.push({ x: cx, y: cy });
    }
    pts.push({ x: x2, y: y2 });
    g.lineStyle(width + 4, color, 0.18);
    for (let i = 0; i < pts.length - 1; i++) g.lineBetween(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
    g.lineStyle(width, color, 0.95);
    for (let i = 0; i < pts.length - 1; i++) g.lineBetween(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
    g.lineStyle(1, C.white, 1);
    for (let i = 0; i < pts.length - 1; i++) g.lineBetween(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y);
  }

  draw() {
    const g = this.gfx;
    const sGfx = this.shadowGfx;
    const cape = this.capeGfx;
    const glow = this.glowGfx;
    g.clear(); sGfx.clear(); cape.clear(); glow.clear();

    const x = this.x, y = this.y, f = this.facing;
    const crouched = (this.state === 'crouch' || this.state === 'crouchAttack');
    const jumping  = this.state === 'jump' || !this.onGround;
    const ko       = this.state === 'ko';
    const hurt     = this.hitFlashTimer > 0;
    const sc       = this.sci.name;

    // Colores derivados del científico (cada uno con su bata/chaqueta)
    const baseFill = this.sci.coat;
    const baseMid  = Phaser.Display.Color.IntegerToColor(this.sci.coat).darken(15).color;
    const baseDark = Phaser.Display.Color.IntegerToColor(this.sci.coat).darken(35).color;
    const baseSkin = this.sci.skinColor;
    const baseHair = this.sci.hairColor;

    const fill = hurt ? C.hitFlash : baseFill;
    const mid  = hurt ? C.hitFlash : baseMid;
    const dark = hurt ? C.hitFlash : baseDark;
    const skin = hurt ? C.hitFlash : baseSkin;
    const hair = hurt ? C.hitFlash : baseHair;

    // Sombra
    const shadowDistance = FLOOR_Y - y;
    const shadowScale = Math.max(0.15, 1 - (shadowDistance / 240));
    sGfx.fillStyle(this.sci.neonColor, 0.18);
    sGfx.fillEllipse(x, FLOOR_Y + 3, ko ? 95 : 60 * shadowScale, ko ? 14 : 11 * shadowScale);
    sGfx.fillStyle(0x000000, ko ? 0.35 : 0.55);
    sGfx.fillEllipse(x, FLOOR_Y + 2, ko ? 85 : 44 * shadowScale, ko ? 10 : 7 * shadowScale);

    // Estelas
    this.motionEchoes.forEach(e => {
      g.fillStyle(this.sci.neonColor, e.alpha * 0.18);
      g.fillRoundedRect(e.x - 16, e.y - this.height, 32, this.height, 6);
      g.fillStyle(this.sci.brightColor, e.alpha * 0.08);
      g.fillRoundedRect(e.x - 8, e.y - this.height * 0.9, 16, this.height * 0.9, 4);
    });

    // Partículas
    for (const p of this.specialParticles) {
      const a = p.life / p.maxLife;
      if (p.kind === 'arc') {
        g.lineStyle(4, p.color, a * 0.9);
        g.lineBetween(p.x, p.y, p.x + (Math.random()-0.5)*6, p.y + 22);
        g.lineStyle(1, C.white, a);
        g.lineBetween(p.x, p.y + 2, p.x, p.y + 20);
      } else if (p.kind === 'teleport') {
        // Dígitos binarios cayendo
        g.fillStyle(p.color, a);
        g.fillRect(p.x, p.y, 4, 6);
        g.fillStyle(C.white, a);
        g.fillRect(p.x + 1, p.y + 1, 2, 4);
      } else if (p.kind === 'radiation') {
        g.fillStyle(p.color, a * 0.6);
        g.fillCircle(p.x, p.y, 7 * a);
        g.fillStyle(C.white, a * 0.4);
        g.fillCircle(p.x, p.y, 3 * a);
      } else {
        g.fillStyle(p.color, a * 0.6);
        g.fillCircle(p.x, p.y, 7 * a);
        g.fillStyle(C.white, a * 0.4);
        g.fillCircle(p.x, p.y, 3 * a);
      }
    }

    if (ko) {
      g.setPosition(x, y - 12); g.setRotation(f * 1.35);
      g.fillStyle(this.sci.neonColor, 0.35); g.fillRoundedRect(-22, -10, 44, 36, 6);
      g.fillStyle(dark, 1); g.fillRoundedRect(-16, -16, 32, 42, 5);
      g.fillStyle(mid, 1);  g.fillRoundedRect(-12, -10, 24, 30, 4);
      g.fillStyle(skin, 1); g.fillCircle(0, -32, 12);
      g.fillStyle(hair, 1); g.fillRoundedRect(-12, -42, 24, 12, 5);
      g.lineStyle(2, C.black, 1);
      g.lineBetween(-6, -34, -2, -30); g.lineBetween(-2, -34, -6, -30);
      g.lineBetween(2, -34, 6, -30);   g.lineBetween(6, -34, 2, -30);
      g.fillStyle(fill, 1);
      g.fillRoundedRect(-18, 12, 11, 22, 3); g.fillRoundedRect(7, 12, 11, 22, 3);
      return;
    }

    g.setPosition(0, 0); g.setRotation(0);

    const cycle = Date.now();
    const breathe = Math.sin(cycle * 0.009) * 1.8;
    const walkCycle = this.state === 'walk' ? cycle * 0.018 : 0;

    let bobY = crouched ? 22 : (this.state === 'walk' ? Math.abs(Math.sin(walkCycle)) * -4 : breathe);
    let lean = 0;
    if (this.state === 'walk')  lean = f * 4;
    if (this.state === 'punch') lean = f * 9;
    if (this.state === 'kick')  lean = f * -4;
    if (this.state === 'hurt')  lean = f * -10;

    const hipX = x + lean * 0.4;
    const hipY = y - 28 + bobY;
    const chestX = x + lean;
    const chestY = y - 52 + bobY;
    const headX = chestX + f * 2;
    const headY = chestY - 16;

    // ── Aura ──
    glow.fillStyle(this.sci.neonColor, 0.10); glow.fillCircle(chestX, chestY + 6, 36);
    glow.fillStyle(this.sci.neonColor, 0.07); glow.fillCircle(chestX, chestY + 6, 54);

    // ── HAWKING: silla de ruedas en vez de piernas ──
    if (sc === 'HAWKING' && !jumping) {
      // base silla
      g.fillStyle(C.metalDark, 1);
      g.fillRoundedRect(hipX - 22, hipY + 4, 44, 18, 4);
      g.fillStyle(C.metal, 1);
      g.fillRoundedRect(hipX - 20, hipY + 6, 40, 4, 2);
      // ruedas
      g.fillStyle(C.black, 1);
      g.fillCircle(hipX - 18, hipY + 22, 10);
      g.fillCircle(hipX + 18, hipY + 22, 10);
      g.fillStyle(C.metal, 1);
      g.fillCircle(hipX - 18, hipY + 22, 4);
      g.fillCircle(hipX + 18, hipY + 22, 4);
      // radios neón
      g.lineStyle(1, this.sci.neonColor, 0.8);
      for (let a = 0; a < 4; a++) {
        const ang = a * Math.PI / 2 + (cycle * 0.003);
        g.lineBetween(hipX - 18, hipY + 22, hipX - 18 + Math.cos(ang) * 9, hipY + 22 + Math.sin(ang) * 9);
        g.lineBetween(hipX + 18, hipY + 22, hipX + 18 + Math.cos(ang) * 9, hipY + 22 + Math.sin(ang) * 9);
      }
      // pantalla/teclado en regazo
      g.fillStyle(this.sci.neonColor, 0.7);
      g.fillRect(hipX - 10, hipY - 2, 20, 6);
    } else {
      // Piernas normales
      g.fillStyle(dark, 1);
      if (jumping) {
        g.fillRoundedRect(hipX - 13, hipY, 12, 16, 3);
        g.fillRoundedRect(hipX + 1, hipY, 12, 10, 3);
        g.fillStyle(C.metalDark, 1);
        g.fillRect(hipX - 13, hipY + 8, 12, 3);
        g.fillRect(hipX + 1,  hipY + 6, 12, 3);
      } else if (crouched) {
        g.fillRoundedRect(hipX - 14, hipY, 13, 14, 4);
        g.fillRoundedRect(hipX + 1, hipY, 13, 14, 4);
        g.fillStyle(C.metalDark, 1);
        g.fillRect(hipX - 14, hipY + 8, 13, 3);
        g.fillRect(hipX + 1,  hipY + 8, 13, 3);
      } else {
        const lS = Math.sin(walkCycle) * 3.2;
        const rS = -Math.sin(walkCycle) * 3.2;
        g.fillRoundedRect(hipX - 13 + lS, hipY, 12, 24 + lS * 0.5, 4);
        g.fillRoundedRect(hipX + 1  + rS, hipY, 12, 24 + rS * 0.5, 4);
        g.fillStyle(C.metalDark, 1);
        g.fillRoundedRect(hipX - 14 + lS, hipY + 22 + lS * 0.5, 14, 5, 2);
        g.fillRoundedRect(hipX + 0  + rS, hipY + 22 + rS * 0.5, 14, 5, 2);
      }
    }

    // ── Torso (bata/chaqueta del científico) ──
    const bW = 32 - Math.abs(breathe) * 0.2;
    g.fillStyle(dark, 1);
    g.fillPoints([
      { x: chestX - bW / 2 - 1, y: chestY - 1 },
      { x: chestX + bW / 2 + 1, y: chestY - 1 },
      { x: hipX + 15, y: hipY + 5 },
      { x: hipX - 15, y: hipY + 5 }
    ], true);
    g.fillStyle(mid, 1);
    g.fillPoints([
      { x: chestX - bW / 2, y: chestY },
      { x: chestX + bW / 2, y: chestY },
      { x: hipX + 14, y: hipY + 4 },
      { x: hipX - 14, y: hipY + 4 }
    ], true);
    g.fillStyle(fill, 1);
    g.fillPoints([
      { x: chestX - bW / 2 + 3, y: chestY + 1 },
      { x: chestX + bW / 2 - 3, y: chestY + 1 },
      { x: hipX + 10, y: hipY + 2 },
      { x: hipX - 10, y: hipY + 2 }
    ], true);

    // Solapas de la bata (línea central)
    g.lineStyle(1.2, this.sci.coatTrim, 0.9);
    g.lineBetween(chestX, chestY + 1, hipX, hipY + 3);

    // Curie: cinta verde radiactiva como pin
    if (sc === 'CURIE') {
      g.fillStyle(this.sci.neonColor, 1);
      g.fillTriangle(chestX - 5, chestY + 6, chestX + 5, chestY + 6, chestX, chestY + 14);
    }
    // Turing: corbata
    if (sc === 'TURING') {
      g.fillStyle(0x8a1a1a, 1);
      g.fillTriangle(chestX - 4, chestY + 3, chestX + 4, chestY + 3, chestX, chestY + 22);
      g.fillStyle(this.sci.neonColor, 1);
      g.fillRect(chestX - 3, chestY + 8, 6, 1);
      g.fillRect(chestX - 3, chestY + 14, 6, 1);
    }
    // Einstein: pequeño chaleco oscuro abierto + parche con E=mc²
    if (sc === 'EINSTEIN') {
      g.fillStyle(0x1a1410, 1);
      g.fillTriangle(chestX - bW/2 + 2, chestY + 2, chestX, chestY + 2, chestX - 2, hipY);
      g.fillTriangle(chestX + bW/2 - 2, chestY + 2, chestX, chestY + 2, chestX + 2, hipY);
    }
    // Tesla: emblema bobina
    if (sc === 'TESLA') {
      g.lineStyle(1.4, this.sci.neonColor, 1);
      for (let r = 2; r <= 6; r += 2) g.strokeCircle(chestX, chestY + 12, r);
    }
    // Darwin: bolsillo con lupa
    if (sc === 'DARWIN') {
      g.fillStyle(this.sci.neonColor, 0.9);
      g.strokeCircle && g.lineStyle(1.4, this.sci.neonColor, 1);
      g.strokeCircle(chestX + 4, chestY + 12, 3);
      g.lineBetween(chestX + 6, chestY + 14, chestX + 9, chestY + 17);
    }
    // Hawking: pantalla del comunicador en el pecho
    if (sc === 'HAWKING') {
      g.fillStyle(this.sci.neonColor, 0.8);
      g.fillRoundedRect(chestX - 6, chestY + 8, 12, 8, 1);
      g.fillStyle(C.black, 0.7);
      g.fillRect(chestX - 5, chestY + 10, 10, 1);
      g.fillRect(chestX - 5, chestY + 12, 7,  1);
      g.fillRect(chestX - 5, chestY + 14, 9,  1);
    }

    // ── Brazos ──
    if (this.state === 'crouchAttack') {
      g.fillStyle(mid, 1);
      g.fillRoundedRect(chestX - f * 14, chestY + 6, 10, 18, 3);
      g.fillStyle(skin, 1);
      g.fillRoundedRect(chestX + f * 12, chestY + 12, 32, 9, 4);
      g.fillStyle(this.sci.neonColor, 0.8);
      g.fillCircle(chestX + f * 38, chestY + 16, 4);
    } else if (this.state === 'punch') {
      g.fillStyle(mid, 1);
      g.fillRoundedRect(chestX - f * 14, chestY + 6, 10, 18, 3);
      g.fillStyle(skin, 1);
      g.fillRoundedRect(chestX + f * 12, chestY + 1, 38, 11, 4);
      g.fillStyle(this.sci.neonColor, 1);
      g.fillCircle(chestX + f * 46, chestY + 6, 6);
      g.fillStyle(this.sci.brightColor, 1);
      g.fillCircle(chestX + f * 46, chestY + 6, 3);
    } else if (this.state === 'kick') {
      g.fillStyle(mid, 1);
      g.fillRoundedRect(chestX - f * 15, chestY + 2, 9, 18, 2);
      g.fillStyle(skin, 1);
      g.fillRoundedRect(chestX + f * 6, chestY + 10, 9, 16, 2);
    } else if (this.state === 'special') {
      g.fillStyle(mid, 1);
      g.fillRoundedRect(chestX - f * 14, chestY - 4, 9, 18, 3);
      g.fillRoundedRect(chestX + f * 6, chestY - 6, 9, 18, 3);
      g.fillStyle(skin, 1);
      g.fillCircle(chestX - f * 9,  chestY - 8, 4);
      g.fillCircle(chestX + f * 11, chestY - 10, 4);
      g.fillStyle(this.sci.neonColor, 0.4);
      g.fillCircle(chestX + f * 2, chestY - 14, 14);
      g.fillStyle(this.sci.brightColor, 1);
      g.fillCircle(chestX + f * 2, chestY - 14, 5);
    } else {
      const swing = this.state === 'walk' ? Math.cos(walkCycle) * 5 : breathe * 0.6;
      g.fillStyle(mid, 1);
      g.fillRoundedRect(chestX - f * 14 + swing * 0.3, chestY + 4 + swing, 10, 22, 3);
      g.fillStyle(skin, 1);
      g.fillRoundedRect(chestX + f * 11 - swing * 0.3, chestY + 4 - swing, 10, 21, 3);
    }

    // ── Cabeza ──
    g.fillStyle(skin, 1);
    g.fillRoundedRect(headX - 4, headY + 8, 8, 6, 2); // cuello
    g.fillCircle(headX, headY, 12);
    g.fillStyle(0x000000, 0.18);
    g.fillCircle(headX - f * 4, headY + 1, 9);

    // ── Pelo + rasgos por científico ──
    this._drawScientistHead(g, headX, headY, f, sc, hair, skin);

    // Ojo + gafas según ciencia
    g.fillStyle(C.white, 1);
    g.fillCircle(headX + f * 4, headY - 1, 3);
    g.fillStyle(C.black, 1);
    g.fillCircle(headX + f * 4, headY - 1, 1.6);
    g.fillStyle(this.sci.brightColor, 1);
    g.fillCircle(headX + f * 4.5, headY - 1.5, 0.9);

    // Gafas (Hawking, Curie, Turing, Einstein dejan ver con bigote)
    if (sc === 'HAWKING' || sc === 'CURIE' || sc === 'TURING') {
      g.lineStyle(1.4, C.metalDark, 1);
      g.strokeCircle(headX + f * 4, headY - 1, 4);
      g.strokeCircle(headX - f * 3, headY - 1, 4);
      g.lineBetween(headX + f * 1, headY - 1, headX - f * 1, headY - 1);
    }
    // Boca + bigote
    if (sc === 'EINSTEIN' || sc === 'TESLA' || sc === 'DARWIN') {
      g.fillStyle(hair, 1);
      g.fillRoundedRect(headX - 6, headY + 5, 12, 3, 1);
    } else {
      g.lineStyle(1.2, C.black, 0.6);
      g.lineBetween(headX - 3, headY + 6, headX + 3, headY + 6);
    }
    // Darwin: barba grande
    if (sc === 'DARWIN') {
      g.fillStyle(hair, 1);
      g.fillEllipse(headX, headY + 13, 22, 18);
      g.fillStyle(skin, 0.0);
    }

    // Pierna kick + efecto poder
    if (this.state === 'kick') {
      g.fillStyle(mid, 1);
      g.fillRoundedRect(hipX, hipY, 30 * f, 14, 4);
      g.fillStyle(C.metalDark, 1);
      g.fillRoundedRect(hipX + f * 24, hipY - 2, 26 * f, 16, 4);
      g.fillStyle(this.sci.neonColor, 1);
      g.fillRoundedRect(hipX + f * 40, hipY + 2, 12 * f, 9, 3);
    }

    // ── Efecto visual del poder en uso ──
    if (this.state === 'special' && this.specialActive && this.sci.special.type !== 'radiation') {
      this._drawSpecialEffect(g, x, y, f);
    }
    // Nube radiactiva persistente
    if (this.state === 'special' && this.specialActive && this.sci.special.type === 'radiation') {
      this._drawRadiationCloud(g, x, y, cycle);
    }

    // ── Barra de cooldown ──
    if (this.specialCooldown > 0) {
      const ratio = 1 - (this.specialCooldown / this.sci.special.cooldown);
      g.fillStyle(0x000000, 0.7); g.fillRoundedRect(x - 22, y + 8, 44, 6, 2);
      g.fillStyle(this.sci.neonColor, 1); g.fillRoundedRect(x - 21, y + 9, 42 * ratio, 4, 2);
    } else {
      const pulse = 0.6 + Math.sin(Date.now() * 0.012) * 0.4;
      g.fillStyle(0x000000, 0.55); g.fillRoundedRect(x - 22, y + 8, 44, 6, 2);
      g.fillStyle(this.sci.brightColor, pulse); g.fillRoundedRect(x - 21, y + 9, 42, 4, 2);
    }
  }

  _drawScientistHead(g, headX, headY, f, sc, hair, skin) {
    if (sc === 'EINSTEIN') {
      // Pelo blanco alborotado, calvo arriba
      g.fillStyle(hair, 1);
      for (let i = -12; i <= 12; i += 3) {
        const h = 6 + Math.abs(Math.sin(i)) * 8;
        g.fillTriangle(headX + i, headY - 8, headX + i - 4, headY - 8 - h, headX + i + 4, headY - 8 - h);
      }
      g.fillRoundedRect(headX - 14, headY - 4, 6, 12, 2);
      g.fillRoundedRect(headX + 8,  headY - 4, 6, 12, 2);
      // Sombra calva
      g.fillStyle(skin, 1);
      g.fillEllipse(headX, headY - 8, 14, 6);
    } else if (sc === 'TESLA') {
      // Pelo negro peinado hacia atrás, raya al medio
      g.fillStyle(hair, 1);
      g.fillRoundedRect(headX - 12, headY - 12, 24, 8, 4);
      g.fillRoundedRect(headX - 12, headY - 8, 5, 8, 2);
      g.fillRoundedRect(headX + 7,  headY - 8, 5, 8, 2);
      g.lineStyle(1, skin, 1);
      g.lineBetween(headX, headY - 12, headX, headY - 6);
      // Pequeña bobina flotante encima
      g.lineStyle(1.4, C.teslaNeon, 0.9);
      for (let r = 2; r <= 6; r += 2) g.strokeCircle(headX, headY - 20, r);
      g.fillStyle(C.teslaBright, 1);
      g.fillCircle(headX, headY - 20, 1.5);
    } else if (sc === 'TURING') {
      // Pelo corto castaño con flequillo
      g.fillStyle(hair, 1);
      g.fillRoundedRect(headX - 12, headY - 11, 24, 10, 5);
      g.fillTriangle(headX - 8, headY - 1, headX + 2, headY - 1, headX - 4, headY + 4);
    } else if (sc === 'CURIE') {
      // Moño alto + cabello recogido
      g.fillStyle(hair, 1);
      g.fillRoundedRect(headX - 12, headY - 9, 24, 12, 6);
      g.fillCircle(headX, headY - 14, 7);
      g.fillCircle(headX + 5, headY - 12, 3);
    } else if (sc === 'DARWIN') {
      // Calvo + sombrero de copa
      g.fillStyle(skin, 1);
      g.fillEllipse(headX, headY - 8, 18, 8);
      // sombrero
      g.fillStyle(C.black, 1);
      g.fillRect(headX - 14, headY - 12, 28, 3);
      g.fillRect(headX - 10, headY - 26, 20, 16);
      g.fillStyle(this.sci.neonColor, 0.6);
      g.fillRect(headX - 10, headY - 16, 20, 2);
    } else if (sc === 'HAWKING') {
      // Cabello fino canoso
      g.fillStyle(hair, 1);
      g.fillRoundedRect(headX - 12, headY - 10, 24, 6, 3);
      g.fillRect(headX - 11, headY - 6, 22, 2);
    } else {
      g.fillStyle(hair, 1);
      g.fillRoundedRect(headX - 11, headY - 11, 22, 10, 5);
    }
  }

  _drawSpecialEffect(g, x, y, f) {
    const sp = this.sci.special;
    const color = this.sci.neonColor;
    const bright = this.sci.brightColor;
    const t = Date.now() * 0.008;

    if (sp.type === 'arc') {
      // Bobina Tesla: dos terminales que sueltan arcos al frente
      const baseX = x + f * 20, baseY = y - 70;
      // Cuerpo de la bobina
      g.fillStyle(C.copper, 1);
      g.fillRect(x - 6, y - 20, 12, 18);
      for (let i = 0; i < 6; i++) {
        g.lineStyle(2, C.copperBright, 0.9);
        g.strokeRect(x - 8, y - 22 - i * 8, 16, 3);
      }
      g.fillStyle(C.metal, 1);
      g.fillCircle(x, y - 76, 8);
      g.fillStyle(bright, 0.8);
      g.fillCircle(x, y - 76, 4);
      // Arcos al frente
      for (let i = 0; i < 3; i++) {
        const tx = x + f * (60 + Math.random() * 140);
        const ty = y - 30 - Math.random() * 80;
        this._drawJaggedBolt(g, x + f * 4, y - 76, tx, ty, color, 3, 7);
      }
      // Halo
      g.fillStyle(color, 0.18);
      g.fillCircle(x, y - 76, 22);
    }
    else if (sp.type === 'gravity') {
      // Malla espacio-tiempo deformada por una masa
      const cx = x + f * 60, cy = y - 50;
      g.lineStyle(1.2, color, 0.6);
      for (let r = 12; r <= 90; r += 12) {
        g.strokeEllipse(cx, cy + Math.sin(t + r*0.05) * 2, r * 1.6, r * 0.55);
      }
      // Líneas radiales
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI * 2 + t * 0.5;
        g.lineStyle(1, color, 0.4);
        g.lineBetween(cx, cy, cx + Math.cos(ang) * 100, cy + Math.sin(ang) * 35);
      }
      // Masa central
      g.fillStyle(C.black, 0.9); g.fillCircle(cx, cy, 12);
      g.fillStyle(bright, 1);    g.fillCircle(cx, cy, 6);
      g.fillStyle(C.white, 0.7); g.fillCircle(cx - 2, cy - 2, 2);
    }
    else if (sp.type === 'teleport') {
      // Lluvia de bits / glitch matricial alrededor
      for (let i = 0; i < 12; i++) {
        const px = x - 40 + Math.random() * 80;
        const py = y - Math.random() * 90;
        g.fillStyle(color, 0.9);
        g.fillRect(px, py, 4, 7);
        g.fillStyle(C.white, 0.9);
        g.fillRect(px + 1, py + 1, 2, 5);
      }
      // Marco de pantalla
      g.lineStyle(2, color, 0.7);
      g.strokeRect(x - 30, y - 100, 60, 100);
      // Texto 01
      g.fillStyle(C.white, 0.85);
      for (let i = 0; i < 4; i++) {
        const ty = y - 95 + i * 18;
        g.fillRect(x - 25, ty, 3, 8);    // 1
        g.fillRect(x - 15, ty, 8, 8);    // 0 outer
        g.fillStyle(C.black, 1);
        g.fillRect(x - 13, ty + 2, 4, 4);
        g.fillStyle(C.white, 0.85);
      }
    }
    else if (sp.type === 'dash') {
      // Hélice de ADN como estela
      const startX = x - f * 60, endX = x + f * 60;
      for (let i = 0; i < 18; i++) {
        const tt = i / 17;
        const sx = startX + (endX - startX) * tt;
        const off = Math.sin(tt * Math.PI * 3 + t * 2) * 18;
        const off2 = -off;
        g.fillStyle(color, 0.9);
        g.fillCircle(sx, y - 40 + off, 3);
        g.fillStyle(bright, 0.9);
        g.fillCircle(sx, y - 40 + off2, 3);
        if (i % 2 === 0) {
          g.lineStyle(1.2, C.white, 0.5);
          g.lineBetween(sx, y - 40 + off, sx, y - 40 + off2);
        }
      }
    }
    else if (sp.type === 'singularity') {
      // Disco de acreción + agujero negro
      const cx = x, cy = y - 60;
      // Anillos en perspectiva
      for (let i = 6; i > 0; i--) {
        const a = 0.18 - i * 0.02;
        g.lineStyle(3, C.hawkingNeon, a);
        g.strokeEllipse(cx, cy, 60 + i * 14, 22 + i * 6);
      }
      g.lineStyle(2, bright, 0.9);
      g.strokeEllipse(cx, cy, 90, 32);
      g.lineStyle(2, color, 0.9);
      g.strokeEllipse(cx, cy, 70, 24);
      // Núcleo negro
      g.fillStyle(C.black, 1); g.fillCircle(cx, cy, 18);
      g.fillStyle(color, 0.35); g.fillCircle(cx, cy, 22);
      // Estrellas absorbidas
      for (let i = 0; i < 6; i++) {
        const ang = t * 2 + i;
        const r = 50 + Math.sin(t + i) * 10;
        g.fillStyle(C.white, 0.9);
        g.fillRect(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.35, 2, 2);
      }
    }
  }

  _drawRadiationCloud(g, x, y, cycle) {
    const cx = x, cy = y - 40;
    // Trébol radiactivo giratorio
    const rot = cycle * 0.003;
    g.fillStyle(this.sci.neonColor, 0.25);
    g.fillCircle(cx, cy, 55);
    g.fillStyle(this.sci.brightColor, 0.5);
    g.fillCircle(cx, cy, 30);
    g.fillStyle(C.black, 0.85);
    g.fillCircle(cx, cy, 8);
    for (let i = 0; i < 3; i++) {
      const ang = rot + i * (Math.PI * 2 / 3);
      const px = cx + Math.cos(ang) * 22;
      const py = cy + Math.sin(ang) * 22;
      g.fillStyle(C.black, 0.85);
      g.fillCircle(px, py, 10);
      g.fillStyle(this.sci.neonColor, 0.9);
      g.fillCircle(px, py, 6);
    }
    // Partículas alfa volando
    for (let i = 0; i < 8; i++) {
      const ang = cycle * 0.004 + i;
      const r = 40 + Math.sin(cycle * 0.005 + i) * 18;
      g.fillStyle(this.sci.brightColor, 0.8);
      g.fillCircle(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r, 2);
    }
  }
}

// ─────────────────────────────────────────────────────────
//  GAME SCENE  (Laboratorio)
// ─────────────────────────────────────────────────────────
class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  create() {
    this.soundFX = new SoundFX(this);
    this.gameState = 'intro';
    this.roundTimer = 60;
    this.winner = null;

    this.drawBackground();
    this.drawGround();

    const p1Sci = SCIENTISTS[SELECTED_SCI_INDEX];
    let p2Sci = Phaser.Utils.Array.GetRandom(SCIENTISTS);
    while (p2Sci.name === p1Sci.name) p2Sci = Phaser.Utils.Array.GetRandom(SCIENTISTS);

    this.player = new Fighter(this, 200, true, p1Sci);
    this.bot    = new Fighter(this, 600, false, p2Sci);

    this.fgGfx = this.add.graphics();
    this.dustParticles = [];
    for (let i = 0; i < 14; i++) {
      this.dustParticles.push({
        x: Math.random() * W, y: FLOOR_Y - Math.random() * 120,
        vx: -8 - Math.random() * 14,
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.2
      });
    }
    this.lightningTimer = 0;
    this.lightningAlpha = 0;

    this.drawHUD();
    this.specialWasReady = true;
    this.time.delayedCall(1100, () => {
      if (this.gameState === 'intro') { this.gameState = 'fighting'; this.introText.setAlpha(0); }
    });

    createArcadeControls(this);
    this.specialHeld = false;
    this.aiTimer = 0; this.aiAction = 'idle';
    this.hitEffects = []; this.effectPool = [];
    this.ambientTime = 0;
  }

  drawBackground() {
    const g = this.add.graphics();
    // Gradiente cielo nocturno azul
    const bands = 36;
    for (let i = 0; i < bands; i++) {
      const col = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.IntegerToColor(C.sky1),
        Phaser.Display.Color.IntegerToColor(C.sky3),
        bands, i
      );
      g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
      g.fillRect(0, (H * 0.85) * (i / bands), W, (H * 0.85) / bands + 1);
    }
    g.fillStyle(C.horizon, 0.18); g.fillRect(0, H * 0.55, W, 80);
    g.fillStyle(C.horizon, 0.10); g.fillRect(0, H * 0.50, W, 80);

    // Luna fría
    for (let i = 6; i > 0; i--) {
      g.fillStyle(C.moonHalo, 0.05 * i);
      g.fillCircle(700, 90, 36 + i * 10);
    }
    g.fillStyle(C.moonGlow, 0.6); g.fillCircle(700, 90, 38);
    g.fillStyle(C.moon, 1);       g.fillCircle(700, 90, 30);

    // Estrellas
    this.stars = [];
    for (let i = 0; i < 50; i++) {
      this.stars.push([Phaser.Math.Between(10, W - 10), Phaser.Math.Between(10, 180), Math.random()]);
    }
    this.starGfx = this.add.graphics();

    // Silueta de skyline del campus científico
    g.fillStyle(0x0a1228, 1);
    g.beginPath();
    g.moveTo(0, 280);
    const mts = [[0,280],[80,250],[160,260],[240,220],[330,240],[420,210],[520,235],[620,220],[720,255],[800,235],[800,FLOOR_Y],[0,FLOOR_Y]];
    for (const [mx, my] of mts) g.lineTo(mx, my);
    g.closePath(); g.fillPath();

    // Reactor central (cúpula del observatorio)
    g.fillStyle(0x0a162c, 1);
    g.fillRect(340, FLOOR_Y - 150, 120, 150);
    g.fillStyle(C.reactor, 1);
    g.fillEllipse(400, FLOOR_Y - 150, 130, 70);
    g.fillStyle(C.reactorGlow, 0.35);
    g.fillEllipse(400, FLOOR_Y - 150, 100, 50);
    g.fillStyle(C.reactorGlow, 0.7);
    g.fillCircle(400, FLOOR_Y - 158, 8);
    // Ventanas iluminadas
    g.fillStyle(C.reactorGlow, 0.7);
    for (let wx = 355; wx < 460; wx += 22) {
      for (let wy = FLOOR_Y - 130; wy < FLOOR_Y - 20; wy += 28) {
        if (Math.random() > 0.3) g.fillRect(wx, wy, 10, 14);
      }
    }
    // Antena/parabólica
    g.fillStyle(C.metalDark, 1);
    g.fillRect(398, FLOOR_Y - 200, 4, 50);
    g.fillStyle(C.metal, 1);
    g.fillCircle(400, FLOOR_Y - 200, 10);
    g.fillStyle(C.reactorGlow, 1);
    g.fillCircle(400, FLOOR_Y - 200, 4);

    // Pizarras con ecuaciones (a izquierda y derecha) en lugar de pilares
    const boards = [{x: 60, w: 130}, {x: 610, w: 130}];
    boards.forEach(b => {
      g.fillStyle(0x2a1a08, 1);
      g.fillRect(b.x - 4, FLOOR_Y - 130, b.w + 8, 100); // marco madera
      g.fillStyle(C.chalkboard, 1);
      g.fillRect(b.x, FLOOR_Y - 126, b.w, 92);
      g.lineStyle(2, C.chalk, 0.85);
      // Ecuaciones simuladas con trazos
      const eqs = [
        () => { // E = mc²
          g.lineBetween(b.x + 8, FLOOR_Y - 110, b.x + 20, FLOOR_Y - 110);
          g.lineBetween(b.x + 8, FLOOR_Y - 104, b.x + 16, FLOOR_Y - 104);
          g.lineBetween(b.x + 8, FLOOR_Y - 98,  b.x + 20, FLOOR_Y - 98);
          g.lineBetween(b.x + 28, FLOOR_Y - 108, b.x + 36, FLOOR_Y - 108);
          g.strokeCircle(b.x + 48, FLOOR_Y - 104, 5);
          g.strokeCircle(b.x + 62, FLOOR_Y - 104, 5);
          g.fillStyle(C.chalk, 0.9); g.fillRect(b.x + 70, FLOOR_Y - 112, 2, 4);
        },
        () => { // F=ma
          g.lineBetween(b.x + 10, FLOOR_Y - 80, b.x + 22, FLOOR_Y - 80);
          g.lineBetween(b.x + 10, FLOOR_Y - 80, b.x + 10, FLOOR_Y - 92);
          g.lineBetween(b.x + 30, FLOOR_Y - 80, b.x + 38, FLOOR_Y - 80);
          g.strokeCircle(b.x + 50, FLOOR_Y - 86, 5);
          g.strokeCircle(b.x + 64, FLOOR_Y - 86, 5);
        },
        () => { // π graph
          for (let i = 0; i < 20; i++) {
            const px = b.x + 10 + i * (b.w - 20)/20;
            const py = FLOOR_Y - 50 + Math.sin(i * 0.6) * 8;
            const py2= FLOOR_Y - 50 + Math.sin((i+1) * 0.6) * 8;
            const px2= b.x + 10 + (i+1) * (b.w - 20)/20;
            g.lineBetween(px, py, px2, py2);
          }
          g.lineBetween(b.x + 6, FLOOR_Y - 38, b.x + b.w - 6, FLOOR_Y - 38);
        }
      ];
      eqs.forEach(fn => fn());
    });

    // Bobinas Tesla decorativas a los costados
    this.coilPositions = [30, 770];
    g.fillStyle(C.metalDark, 1);
    this.coilPositions.forEach(cx => {
      g.fillRect(cx - 14, FLOOR_Y - 8, 28, 8); // base
      g.fillStyle(C.copper, 1);
      g.fillRect(cx - 8, FLOOR_Y - 80, 16, 72);
      for (let i = 0; i < 10; i++) {
        g.lineStyle(1.5, C.copperBright, 0.9);
        g.strokeRect(cx - 10, FLOOR_Y - 78 + i * 7, 20, 2);
      }
      g.fillStyle(C.metal, 1);
      g.fillCircle(cx, FLOOR_Y - 90, 10);
      g.fillStyle(C.teslaBright, 0.8);
      g.fillCircle(cx, FLOOR_Y - 90, 5);
      g.fillStyle(C.metalDark, 1);
    });
    this.coilGfx = this.add.graphics(); // arcos dinámicos

    // Tubos de ensayo flotantes (decoración baja)
    this.firePositions = [120, 680];
    g.fillStyle(C.metalDark, 1);
    this.firePositions.forEach(fx => {
      g.fillRect(fx - 10, FLOOR_Y - 22, 20, 4);
      g.fillStyle(C.metal, 1);
      g.fillRect(fx - 12, FLOOR_Y - 26, 24, 4);
      g.fillStyle(C.curieNeon, 0.7);
      g.fillRoundedRect(fx - 6, FLOOR_Y - 20, 12, 18, 4);
      g.fillStyle(C.metalDark, 1);
    });
    this.fireGfx = this.add.graphics();

    // Bruma neón cerca del suelo
    g.fillStyle(0x103a5a, 0.10); g.fillRect(0, FLOOR_Y - 26, W, 26);
    g.fillStyle(0x103a5a, 0.06); g.fillRect(0, FLOOR_Y - 50, W, 24);
  }

  drawGround() {
    const g = this.add.graphics();
    g.fillStyle(C.ground); g.fillRect(0, FLOOR_Y, W, H - FLOOR_Y);
    g.fillStyle(C.groundGlow, 0.18); g.fillRect(0, FLOOR_Y - 1, W, 2);
    g.fillStyle(C.groundGlow, 0.10); g.fillRect(0, FLOOR_Y + 1, W, 2);
    // Rejilla del laboratorio
    g.lineStyle(1, C.groundLine, 0.6);
    for (let tx = 0; tx < W; tx += 40) g.lineBetween(tx, FLOOR_Y, tx, H);
    for (let ty = FLOOR_Y; ty < H; ty += 14) g.lineBetween(0, ty, W, ty);
    g.lineStyle(2, C.teslaNeon, 0.4);
    g.lineBetween(0, FLOOR_Y, W, FLOOR_Y);
  }

  drawHUD() {
    const frame = this.add.graphics();
    frame.fillStyle(0x000000, 0.55); frame.fillRect(0, 0, W, 72);
    frame.fillStyle(C.pillarGlow, 0.12); frame.fillRect(0, 70, W, 2);
    frame.lineStyle(1, C.pillarLight, 0.6); frame.lineBetween(0, 72, W, 72);

    this.hpBgLeft  = this.add.graphics();
    this.hpBgRight = this.add.graphics();
    this.hpBarLeft = this.add.graphics();
    this.hpBarRight= this.add.graphics();

    this.timerBg = this.add.graphics();
    const tx = W / 2;
    this.timerBg.fillStyle(0x0a0512, 0.95);
    this.timerBg.fillRoundedRect(tx - 36, 10, 72, 50, 8);
    this.timerBg.lineStyle(2, C.gold, 0.9);
    this.timerBg.strokeRoundedRect(tx - 36, 10, 72, 50, 8);
    this.timerBg.lineStyle(1, C.teslaNeon, 0.6);
    this.timerBg.strokeRoundedRect(tx - 32, 14, 64, 42, 6);

    this.timerText = this.add.text(tx, 36, '60',
      { font: 'bold 30px "Courier New", monospace', color: '#ffe6a8', stroke: '#000000', strokeThickness: 4 }
    ).setOrigin(0.5);

    const portrait = (px, alignRight, fighter) => {
      const w = 64, h = 64;
      const bx = alignRight ? W - 14 - w : 14;
      const fg = this.add.graphics();
      fg.fillStyle(0x000000, 0.85);
      fg.fillRoundedRect(bx, 6, w, h, 4);
      fg.lineStyle(2, fighter.sci.neonColor, 1);
      fg.strokeRoundedRect(bx, 6, w, h, 4);
      fg.fillStyle(fighter.sci.coat, 1);
      fg.fillRoundedRect(bx + 8, 30, w - 16, 30, 4);
      fg.fillStyle(fighter.sci.skinColor, 1);
      fg.fillCircle(bx + w / 2, 28, 12);
      fg.fillStyle(fighter.sci.hairColor, 1);
      // Mini-cabello según científico
      if (fighter.sci.name === 'EINSTEIN') {
        for (let i = -3; i <= 3; i++) fg.fillCircle(bx + w/2 + i*3, 20, 3);
      } else if (fighter.sci.name === 'DARWIN') {
        fg.fillRect(bx + w/2 - 8, 14, 16, 4);
        fg.fillRect(bx + w/2 - 6, 8, 12, 8);
        fg.fillStyle(fighter.sci.skinColor, 1);
        fg.fillEllipse(bx + w/2, 36, 14, 8); // barba
        fg.fillStyle(fighter.sci.hairColor, 1);
        fg.fillEllipse(bx + w/2, 36, 14, 8);
      } else if (fighter.sci.name === 'CURIE') {
        fg.fillCircle(bx + w/2, 18, 6);
        fg.fillRoundedRect(bx + w/2 - 10, 22, 20, 8, 4);
      } else {
        fg.fillRoundedRect(bx + w/2 - 10, 18, 20, 6, 3);
      }
      fg.fillStyle(fighter.sci.neonColor, 1);
      fg.fillRoundedRect(bx + 12, 33, w - 24, 4, 2);
      return { bx, w };
    };

    const leftP  = portrait(0, false, this.player);
    const rightP = portrait(0, true,  this.bot);

    this.add.text(leftP.bx + leftP.w + 8, 10, this.player.sci.name,
      { font: 'bold 18px "Courier New", monospace', color: '#ffffff', stroke: '#000000', strokeThickness: 3 });
    this.add.text(leftP.bx + leftP.w + 8, 30, this.player.sci.title,
      { font: '10px "Courier New", monospace', color: Phaser.Display.Color.IntegerToColor(this.player.sci.neonColor).rgba });

    this.add.text(rightP.bx - 8, 10, this.bot.sci.name,
      { font: 'bold 18px "Courier New", monospace', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }
    ).setOrigin(1, 0);
    this.add.text(rightP.bx - 8, 30, this.bot.sci.title,
      { font: '10px "Courier New", monospace', color: Phaser.Display.Color.IntegerToColor(this.bot.sci.neonColor).rgba }
    ).setOrigin(1, 0);

    this._hpLeftX  = leftP.bx + leftP.w + 8;
    this._hpRightX = rightP.bx - 8;
    this.updateHUD();

    this.roundText = this.add.text(W / 2, H / 2 - 30, '', {
      font: 'bold 56px "Courier New", monospace',
      color: '#ffd64a', stroke: '#000000', strokeThickness: 9
    }).setOrigin(0.5).setAlpha(0);
    this.introText = this.add.text(W / 2, H / 2 - 6, this.player.sci.name + '  VS  ' + this.bot.sci.name, {
      font: 'bold 42px "Courier New", monospace', color: '#ffffff', stroke: '#000000', strokeThickness: 8
    }).setOrigin(0.5);
    this.specialReadyText = this.add.text(W / 2, 104, 'SPECIAL READY', {
      font: 'bold 24px "Courier New", monospace', color: '#ffffff', stroke: '#000000', strokeThickness: 5
    }).setOrigin(0.5).setAlpha(0);
    this.rematchText = this.add.text(W / 2, H / 2 + 42, 'START REMATCH | B2 SELECT', {
      font: 'bold 18px "Courier New", monospace', color: '#9dccdd', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);
  }

  updateHUD() {
    const BAR_W = 240, BAR_H = 18;
    const p = this.player, b = this.bot;
    this.hpBgLeft.clear();
    this.hpBgLeft.fillStyle(0x000000, 0.85);
    this.hpBgLeft.fillRoundedRect(this._hpLeftX, 46, BAR_W, BAR_H, 3);
    this.hpBgLeft.lineStyle(2, 0x4a3a6a, 1);
    this.hpBgLeft.strokeRoundedRect(this._hpLeftX, 46, BAR_W, BAR_H, 3);
    this.hpBarLeft.clear();
    const pRatio = p.hp / p.maxHp;
    const pColor = pRatio > 0.5 ? C.hpGreen : pRatio > 0.25 ? C.hpYellow : C.hpRed;
    if (pRatio > 0) {
      this.hpBarLeft.fillStyle(pColor, 0.3);
      this.hpBarLeft.fillRoundedRect(this._hpLeftX - 1, 45, BAR_W * pRatio + 2, BAR_H + 2, 3);
      this.hpBarLeft.fillStyle(pColor, 1);
      this.hpBarLeft.fillRoundedRect(this._hpLeftX, 46, BAR_W * pRatio, BAR_H, 3);
      this.hpBarLeft.fillStyle(C.white, 0.4);
      this.hpBarLeft.fillRect(this._hpLeftX + 2, 48, BAR_W * pRatio - 4, 2);
    }
    this.hpBgRight.clear();
    this.hpBgRight.fillStyle(0x000000, 0.85);
    this.hpBgRight.fillRoundedRect(this._hpRightX - BAR_W, 46, BAR_W, BAR_H, 3);
    this.hpBgRight.lineStyle(2, 0x4a3a6a, 1);
    this.hpBgRight.strokeRoundedRect(this._hpRightX - BAR_W, 46, BAR_W, BAR_H, 3);
    this.hpBarRight.clear();
    const bRatio = b.hp / b.maxHp;
    const bColor = bRatio > 0.5 ? C.hpGreen : bRatio > 0.25 ? C.hpYellow : C.hpRed;
    if (bRatio > 0) {
      this.hpBarRight.fillStyle(bColor, 0.3);
      this.hpBarRight.fillRoundedRect(this._hpRightX - BAR_W * bRatio - 1, 45, BAR_W * bRatio + 2, BAR_H + 2, 3);
      this.hpBarRight.fillStyle(bColor, 1);
      this.hpBarRight.fillRoundedRect(this._hpRightX - BAR_W * bRatio, 46, BAR_W * bRatio, BAR_H, 3);
      this.hpBarRight.fillStyle(C.white, 0.4);
      this.hpBarRight.fillRect(this._hpRightX - BAR_W * bRatio + 2, 48, BAR_W * bRatio - 4, 2);
    }
  }

  spawnHitEffect(x, y, isBig, color = C.hitFlash) {
    let e = this.effectPool.pop();
    if (!e) e = { g: this.add.graphics() };
    e.x = x; e.y = y;
    e.life = isBig ? 0.45 : 0.22;
    e.maxLife = e.life;
    e.big = isBig; e.color = color;
    e.seed = Math.random() * Math.PI * 2;
    this.hitEffects.push(e);
  }

  updateHitEffects(dt) {
    for (let i = this.hitEffects.length - 1; i >= 0; i--) {
      const e = this.hitEffects[i];
      e.life -= dt;
      if (e.life <= 0) { e.g.clear(); this.effectPool.push(e); this.hitEffects.splice(i, 1); continue; }
      e.g.clear();
      const progress = 1 - (e.life / e.maxLife);
      const alpha = 1 - progress;
      const r = progress * (e.big ? 95 : 38);
      const points = e.big ? 12 : 8;
      e.g.fillStyle(e.color, alpha * 0.4);
      const pts = [];
      for (let k = 0; k < points * 2; k++) {
        const rr = (k % 2 === 0) ? r : r * 0.45;
        const ang = e.seed + (k / (points * 2)) * Math.PI * 2;
        pts.push({ x: e.x + Math.cos(ang) * rr, y: e.y + Math.sin(ang) * rr });
      }
      e.g.fillPoints(pts, true);
      e.g.fillStyle(C.white, alpha);
      e.g.fillCircle(e.x, e.y, (e.big ? 14 : 7) * (1 - progress * 0.7));
      e.g.lineStyle(e.big ? 4 : 2, e.color, alpha);
      e.g.strokeCircle(e.x, e.y, r);
      e.g.lineStyle(1, C.white, alpha * 0.8);
      e.g.strokeCircle(e.x, e.y, r * 0.7);
      if (e.big) {
        e.g.lineStyle(3, C.white, alpha * 0.7);
        e.g.lineBetween(e.x - r, e.y - r, e.x + r, e.y + r);
        e.g.lineBetween(e.x + r, e.y - r, e.x - r, e.y + r);
        e.g.lineBetween(e.x - r * 1.2, e.y, e.x + r * 1.2, e.y);
        e.g.lineBetween(e.x, e.y - r * 1.2, e.x, e.y + r * 1.2);
      }
    }
  }

  showSpecialReady() {
    this.specialReadyText.setText(this.player.sci.name + ' SPECIAL READY');
    this.specialReadyText.setColor(Phaser.Display.Color.IntegerToColor(this.player.sci.neonColor).rgba);
    this.specialReadyText.setAlpha(1).setScale(0.86);
    this.cameras.main.flash(70, 255, 255, 255, false);
    this.tweens.add({ targets: this.specialReadyText, scale: 1.12, alpha: 0, duration: 900, ease: 'sine.out' });
    this.soundFX._playTone(660, 0.08, 'triangle');
  }

  updateSpecialReadyFeedback() {
    if (this.player.specialCooldown > 0) { this.specialWasReady = false; return; }
    if (!this.specialWasReady && this.gameState === 'fighting') { this.specialWasReady = true; this.showSpecialReady(); }
  }

  updateAI(dt) {
    const bot = this.bot, player = this.player;
    if (['punch', 'kick', 'hurt', 'special', 'ko', 'crouchAttack'].includes(bot.state)) return;
    this.aiTimer -= dt;
    const dist = player.x - bot.x;
    const absDist = Math.abs(dist);
    if (player.state === 'punch' || player.state === 'kick' || player.state === 'crouchAttack') {
      if (absDist < 100 && Math.random() > 0.35) {
        if (Math.random() > 0.6) bot.setState('crouch', 0.3);
        else if (bot.onGround) { bot.vy = JUMP_VEL * 0.9; bot.setState('jump'); }
        return;
      }
    }
    if (this.aiTimer > 0) {
      if (this.aiAction === 'approach') { bot.vx = bot.facing * MOVE_SPD * 0.85; bot.setState('walk'); }
      else if (this.aiAction === 'retreat') { bot.vx = -bot.facing * MOVE_SPD * 0.7; bot.setState('walk'); }
      else { bot.vx = 0; if (bot.state === 'walk') bot.setState('idle'); }
      return;
    }
    if (absDist < 140) {
      const r = Math.random();
      if (r < 0.25 && bot.specialCooldown <= 0) { bot.special(); this.aiTimer = bot.sci.special.duration + 0.15; }
      else if (r < 0.5) { bot.punch(); this.aiTimer = 0.24; }
      else if (r < 0.75)  { bot.kick();  this.aiTimer = 0.28; }
      else if (r < 0.9 && bot.state === 'crouch') { bot.crouchAttack(); this.aiTimer = 0.22; }
      else { this.aiAction = 'retreat'; this.aiTimer = 0.25; }
    } else { this.aiAction = 'approach'; this.aiTimer = 0.45; }
  }

  handleInput(dt) {
    const p = this.player;
    if (['punch', 'kick', 'special', 'hurt', 'ko', 'crouchAttack'].includes(p.state)) return;
    const punchDown = isControlHeld(this, 'P1_1');
    const kickDown  = isControlHeld(this, 'P1_2');
    if (punchDown && kickDown) {
      if (!this.specialHeld) {
        this.controls.pressed.P1_1 = false;
        this.controls.pressed.P1_2 = false;
        p.special(); this.specialHeld = true; return;
      }
    } else {
      this.specialHeld = false;
    }
    if (consumeAnyPressedControl(this, ['P1_1'])) p.punch();
    if (consumeAnyPressedControl(this, ['P1_2'])) p.kick();
    if (['punch', 'kick', 'special'].includes(p.state)) return;
    if (isControlHeld(this, 'P1_D')) { p.setState('crouch', 0.08); p.vx = 0; }
    else if (isControlHeld(this, 'P1_U') && p.onGround) { p.vy = JUMP_VEL; p.setState('jump'); this.soundFX.playJump(); }
    else if (isControlHeld(this, 'P1_L'))  { p.vx = -MOVE_SPD; if (p.onGround) p.setState('walk'); p.facing = -1; }
    else if (isControlHeld(this, 'P1_R')) { p.vx =  MOVE_SPD; if (p.onGround) p.setState('walk'); p.facing = 1; }
    else { p.vx = 0; if (p.state === 'walk') p.setState('idle'); }
  }

  checkHit(attacker, defender) {
    const atk = attacker.attackBox;
    if (!atk) return;
    if (defender.hitCooldown > 0) return;
    const def = defender.hitbox;
    const hit = atk.x < def.x + def.w && atk.x + atk.w > def.x &&
                atk.y < def.y + def.h && atk.y + atk.h > def.y;
    if (hit) {
      let dmg = 0, big = false;
      if (attacker.crouchAttackActive) dmg = 9 + Math.floor(Math.random() * 4);
      else if (attacker.punchActive) dmg = 8 + Math.floor(Math.random() * 4);
      else if (attacker.kickActive)  dmg = 13 + Math.floor(Math.random() * 5);
      else if (attacker.specialActive) { dmg = 24 + Math.floor(Math.random() * 8); big = true; }
      if (dmg > 0) {
        const knockDir = (defender.x - attacker.x) > 0 ? 1 : -1;
        defender.hurt(dmg, knockDir);
        const ex = def.x + def.w / 2, ey = def.y + def.h * 0.4;
        this.spawnHitEffect(ex, ey, big, big ? attacker.sci.neonColor : C.hitFlash);
        this.cameras.main.shake(big ? 220 : 100, big ? 0.009 : 0.0042);
        if (big) this.cameras.main.flash(80, 255, 255, 255, false);
      }
    }
  }

  endRound(winnerName) {
    this.gameState = 'roundEnd';
    this.winner = winnerName;
    this.roundText.setText(winnerName === 'DRAW' ? 'ROUND DRAW' : winnerName + ' WINS!');
    this.roundText.setAlpha(1);
    this.rematchText.setAlpha(1);
    this.tweens.add({ targets: this.roundText, scaleX: 1.2, scaleY: 1.2, duration: 180, yoyo: true, repeat: 0 });
    this.tweens.add({ targets: this.rematchText, alpha: 0.25, duration: 450, yoyo: true, repeat: -1 });
  }

  update(time, deltams) {
    const dt = Math.min(deltams / 1000, 0.05);
    this.ambientTime += dt;

    // Estrellas titilantes
    this.starGfx.clear();
    this.stars.forEach(([sx, sy, ph]) => {
      const a = Math.sin(this.ambientTime * 3 + ph * 9) * 0.45 + 0.55;
      this.starGfx.fillStyle(C.white, a);
      this.starGfx.fillRect(sx, sy, 2, 2);
    });

    // Bobinas Tesla decorativas (arcos al techo)
    this.coilGfx.clear();
    if (Math.random() < 0.4) {
      this.coilPositions.forEach(cx => {
        const tx = cx + (Math.random() - 0.5) * 40;
        const ty = FLOOR_Y - 140 - Math.random() * 30;
        const pts = [];
        let px = cx, py = FLOOR_Y - 90;
        const segs = 6;
        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          pts.push({ x: px + (tx - px) * t + (Math.random() - 0.5) * 20, y: py + (ty - py) * t + (Math.random() - 0.5) * 10 });
        }
        this.coilGfx.lineStyle(4, C.teslaNeon, 0.25);
        for (let i = 0; i < pts.length - 1; i++) this.coilGfx.lineBetween(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
        this.coilGfx.lineStyle(2, C.teslaBright, 0.9);
        for (let i = 0; i < pts.length - 1; i++) this.coilGfx.lineBetween(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
        this.coilGfx.lineStyle(1, C.white, 1);
        for (let i = 0; i < pts.length - 1; i++) this.coilGfx.lineBetween(pts[i].x, pts[i].y, pts[i+1].x, pts[i+1].y);
      });
    }

    // Burbujas en tubos de ensayo
    this.fireGfx.clear();
    this.firePositions.forEach(fx => {
      this.fireGfx.fillStyle(C.curieNeon, 0.18);
      this.fireGfx.fillCircle(fx, FLOOR_Y - 12, 12);
      for (let i = 0; i < 4; i++) {
        const by = FLOOR_Y - 4 - ((this.ambientTime * 30 + i * 5) % 16);
        const bx = fx + Math.sin(this.ambientTime * 4 + i) * 3;
        this.fireGfx.fillStyle(C.curieBright, 0.9);
        this.fireGfx.fillCircle(bx, by, 1.5);
      }
    });

    // Polvo / partículas flotantes
    this.fgGfx.clear();
    this.dustParticles.forEach(d => {
      d.x += d.vx * dt;
      if (d.x < -20) { d.x = W + 20; d.y = FLOOR_Y - Math.random() * 140; }
      this.fgGfx.fillStyle(0x6aaaee, d.alpha);
      this.fgGfx.fillCircle(d.x, d.y, d.size);
    });

    // Destellos ocasionales
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) { this.lightningTimer = 4 + Math.random() * 6; this.lightningAlpha = 0.5; }
    if (this.lightningAlpha > 0) {
      this.fgGfx.fillStyle(0xaaccff, this.lightningAlpha * 0.18);
      this.fgGfx.fillRect(0, 0, W, FLOOR_Y);
      this.lightningAlpha -= dt * 2.2;
    }

    if (this.gameState === 'roundEnd') {
      if (consumeAnyPressedControl(this, ['P1_2'])) this.scene.start('TitleScene');
      if (consumeAnyPressedControl(this, ['START1', 'P1_1'])) this.scene.restart();
    }

    if (this.gameState === 'fighting') {
      this.roundTimer -= dt;
      const secs = Math.ceil(this.roundTimer);
      this.timerText.setText(String(secs));
      if (secs <= 10) this.timerText.setStyle({ font: 'bold 30px "Courier New", monospace', color: '#ff3366', stroke: '#000000', strokeThickness: 4 });
      this.handleInput(dt);
      this.updateAI(dt);
    }

    this.player.update(dt);
    this.bot.update(dt);
    this.updateHUD();
    this.updateHitEffects(dt);
    this.updateSpecialReadyFeedback();

    if (this.gameState === 'fighting') {
      if (this.player.state !== 'ko' && this.bot.state !== 'ko') {
        this.player.facing = this.bot.x > this.player.x ? 1 : -1;
        this.bot.facing    = this.player.x > this.bot.x ? 1 : -1;
      }
      this.checkHit(this.player, this.bot);
      this.checkHit(this.bot, this.player);
      const minDist = 32;
      const dx = this.bot.x - this.player.x;
      if (Math.abs(dx) < minDist && this.player.onGround && this.bot.onGround && this.player.state !== 'special' && this.bot.state !== 'special') {
        const push = (minDist - Math.abs(dx)) / 2;
        this.player.x -= push * Math.sign(dx);
        this.bot.x    += push * Math.sign(dx);
      }
      if (this.player.state === 'ko' && this.player.onGround) this.endRound(this.bot.sci.name);
      else if (this.bot.state === 'ko' && this.bot.onGround)  this.endRound(this.player.sci.name);
      else if (this.roundTimer <= 0) {
        if (this.player.hp > this.bot.hp) this.endRound(this.player.sci.name);
        else if (this.bot.hp > this.player.hp) this.endRound(this.bot.sci.name);
        else this.endRound('DRAW');
      }
    }
  }
}

// ─────────────────────────────────────────────────────────
//  TITLE SCENE  (Academia de Ciencias)
// ─────────────────────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() { super({ key: 'TitleScene' }); }

  create() {
    createArcadeControls(this);
    const g = this.add.graphics();
    // Cielo gradiente azul profundo
    const bands = 30;
    for (let i = 0; i < bands; i++) {
      const col = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.IntegerToColor(C.sky1),
        Phaser.Display.Color.IntegerToColor(C.sky3),
        bands, i
      );
      g.fillStyle(Phaser.Display.Color.GetColor(col.r, col.g, col.b), 1);
      g.fillRect(0, (H * 0.95) * (i / bands), W, (H * 0.95) / bands + 1);
    }
    // Halo central (átomo gigante)
    for (let i = 6; i > 0; i--) {
      g.fillStyle(C.moonHalo, 0.06 * i);
      g.fillCircle(W / 2, 140, 70 + i * 16);
    }
    g.fillStyle(C.moon, 1); g.fillCircle(W / 2, 140, 26);
    g.fillStyle(C.teslaBright, 1); g.fillCircle(W / 2, 140, 10);

    // Órbitas del átomo
    this.atomGfx = this.add.graphics();
    this.atomRings = [
      { rx: 130, ry: 32, rot: 0,  speed: 0.6, color: C.teslaNeon,  phase: 0 },
      { rx: 130, ry: 32, rot: Math.PI / 3, speed: -0.4, color: C.curieNeon,  phase: 1 },
      { rx: 130, ry: 32, rot: -Math.PI / 3, speed: 0.3, color: C.einsteinNeon, phase: 2 },
    ];

    // Suelo del laboratorio
    g.fillStyle(C.ground, 1); g.fillRect(0, H - 50, W, 50);
    g.lineStyle(2, C.teslaNeon, 0.5); g.lineBetween(0, H - 50, W, H - 50);
    g.lineStyle(1, C.groundLine, 0.5);
    for (let tx = 0; tx < W; tx += 40) g.lineBetween(tx, H - 50, tx + 20, H);

    // Estrellas
    this.titleStars = [];
    for (let i = 0; i < 60; i++) this.titleStars.push([Math.random() * W, Math.random() * (H - 80), Math.random()]);
    this.starGfx = this.add.graphics();

    // Ecuaciones flotantes en el fondo (tipo pizarra)
    g.fillStyle(C.chalk, 0.10);
    for (let i = 0; i < 8; i++) {
      const ex = 20 + Math.random() * (W - 80);
      const ey = 240 + Math.random() * 130;
      g.fillRect(ex, ey, 4 + Math.random() * 12, 2);
      g.fillRect(ex + 16, ey, 4 + Math.random() * 8, 2);
      g.fillRect(ex + 32, ey, 4 + Math.random() * 6, 2);
    }

    // Líneas decorativas
    g.lineStyle(2, C.teslaNeon, 0.6); g.lineBetween(60, H / 2 - 80, W - 60, H / 2 - 80);
    g.lineStyle(2, C.einsteinNeon, 0.6); g.lineBetween(60, H / 2 + 70, W - 60, H / 2 + 70);

    // Título con sombra
    this.add.text(W / 2 + 5, H / 2 - 35, 'SCIENCE', {
      font: 'bold 88px "Courier New", monospace', color: '#000000'
    }).setOrigin(0.5).setAlpha(0.6);

    const titleA = this.add.text(W / 2, H / 2 - 40, 'SCIENCE', {
      font: 'bold 88px "Courier New", monospace', color: '#4ff7ff',
      stroke: '#00264d', strokeThickness: 10
    }).setOrigin(0.5);
    const titleB = this.add.text(W / 2, H / 2 + 30, 'BRAWL', {
      font: 'bold 64px "Courier New", monospace', color: '#ffffff',
      stroke: '#1a0040', strokeThickness: 8
    }).setOrigin(0.5);
    this.tweens.add({ targets: titleA, y: H / 2 - 44, duration: 1600, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    this.tweens.add({ targets: titleB, scale: 1.03, duration: 1100, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    const blink = this.add.text(W / 2, H / 2 + 115, '◆ PRESS START TO START THE BRAWL ◆', {
      font: 'bold 18px "Courier New", monospace', color: '#4ff7ff',
      stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);
    this.tweens.add({ targets: blink, alpha: 0.2, duration: 500, yoyo: true, repeat: -1 });
    this.pickIndex = SELECTED_SCI_INDEX;
    this.pickText = this.add.text(W / 2, H / 2 + 150, '', {
      font: 'bold 18px "Courier New", monospace', color: '#ffffff', stroke: '#000000', strokeThickness: 4
    }).setOrigin(0.5);
    this.powerText = this.add.text(W / 2, H / 2 + 176, '', {
      font: 'bold 12px "Courier New", monospace', color: '#9dccdd', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5);
    this.refreshPick();


    // Siluetas de científicos en la parte baja
    const drawSilhouette = (cx, sci) => {
      const sg = this.add.graphics();
      sg.fillStyle(sci.neonColor, 0.25); sg.fillCircle(cx, H - 90, 36);
      sg.fillStyle(sci.coat, 1);
      sg.fillRoundedRect(cx - 14, H - 100, 28, 40, 5);
      sg.fillStyle(sci.skinColor, 1);
      sg.fillCircle(cx, H - 108, 11);
      // Cabello/sombrero
      sg.fillStyle(sci.hairColor, 1);
      if (sci.name === 'EINSTEIN') {
        for (let i = -3; i <= 3; i++) sg.fillCircle(cx + i * 3, H - 116, 3);
      } else if (sci.name === 'DARWIN') {
        sg.fillStyle(0x000000, 1);
        sg.fillRect(cx - 12, H - 116, 24, 3);
        sg.fillRect(cx - 9,  H - 128, 18, 14);
      } else if (sci.name === 'CURIE') {
        sg.fillCircle(cx, H - 121, 6);
        sg.fillRoundedRect(cx - 9, H - 117, 18, 7, 3);
      } else if (sci.name === 'TESLA') {
        sg.fillRoundedRect(cx - 10, H - 118, 20, 7, 3);
        sg.lineStyle(1, sci.neonColor, 1);
        for (let r = 2; r <= 5; r += 1.5) sg.strokeCircle(cx, H - 128, r);
      } else {
        sg.fillRoundedRect(cx - 10, H - 117, 20, 7, 3);
      }
      // Pin del científico
      sg.fillStyle(sci.neonColor, 1);
      sg.fillCircle(cx + 3, H - 80, 2.5);
      // Nombre
      this.add.text(cx, H - 56, sci.name, {
        font: 'bold 10px "Courier New", monospace', color: Phaser.Display.Color.IntegerToColor(sci.neonColor).rgba
      }).setOrigin(0.5);
    };
    drawSilhouette(110, SCIENTISTS[0]); // TESLA
    drawSilhouette(220, SCIENTISTS[1]); // EINSTEIN
    drawSilhouette(330, SCIENTISTS[2]); // TURING
    drawSilhouette(W - 330, SCIENTISTS[3]); // CURIE
    drawSilhouette(W - 220, SCIENTISTS[4]); // DARWIN
    drawSilhouette(W - 110, SCIENTISTS[5]); // HAWKING

    this.add.text(W / 2, H - 22, 'JOYSTICK MOVE | UP JUMP | DOWN CROUCH | B1 PUNCH | B2 KICK | B1+B2 SPECIAL', {
      font: 'bold 11px "Courier New", monospace', color: '#9dccdd'
    }).setOrigin(0.5);

  }

  refreshPick() {
    const sci = SCIENTISTS[this.pickIndex];
    SELECTED_SCI_INDEX = this.pickIndex;
    this.pickText.setText('<  ' + sci.name + '  >');
    this.pickText.setColor(Phaser.Display.Color.IntegerToColor(sci.neonColor).rgba);
    this.powerText.setText(sci.title + ' | ' + sci.special.label);
  }

  update(_, deltams) {
    if (consumeAnyPressedControl(this, ['P1_L'])) { this.pickIndex = Phaser.Math.Wrap(this.pickIndex - 1, 0, SCIENTISTS.length); this.refreshPick(); }
    if (consumeAnyPressedControl(this, ['P1_R'])) { this.pickIndex = Phaser.Math.Wrap(this.pickIndex + 1, 0, SCIENTISTS.length); this.refreshPick(); }
    if (consumeAnyPressedControl(this, ['START1', 'P1_1'])) this.scene.start('GameScene');
    const dt = deltams / 1000;
    this.t = (this.t || 0) + dt;

    this.starGfx.clear();
    this.titleStars.forEach(([sx, sy, ph]) => {
      const a = Math.sin(this.t * 3 + ph * 9) * 0.45 + 0.55;
      this.starGfx.fillStyle(C.white, a);
      this.starGfx.fillRect(sx, sy, 2, 2);
    });

    // Átomo con electrones orbitando
    this.atomGfx.clear();
    const cx = W / 2, cy = 140;
    this.atomRings.forEach((ring, idx) => {
      // Órbita
      this.atomGfx.lineStyle(1.5, ring.color, 0.5);
      // Aproximación visual de elipse rotada
      const steps = 60;
      let prev = null;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const ex = Math.cos(a) * ring.rx;
        const ey = Math.sin(a) * ring.ry;
        const rx = ex * Math.cos(ring.rot) - ey * Math.sin(ring.rot);
        const ry = ex * Math.sin(ring.rot) + ey * Math.cos(ring.rot);
        const px = cx + rx, py = cy + ry;
        if (prev) this.atomGfx.lineBetween(prev.x, prev.y, px, py);
        prev = { x: px, y: py };
      }
      // Electrón
      const phase = this.t * ring.speed + ring.phase;
      const ex = Math.cos(phase) * ring.rx;
      const ey = Math.sin(phase) * ring.ry;
      const rx = ex * Math.cos(ring.rot) - ey * Math.sin(ring.rot);
      const ry = ex * Math.sin(ring.rot) + ey * Math.cos(ring.rot);
      this.atomGfx.fillStyle(ring.color, 0.4);
      this.atomGfx.fillCircle(cx + rx, cy + ry, 8);
      this.atomGfx.fillStyle(ring.color, 1);
      this.atomGfx.fillCircle(cx + rx, cy + ry, 4);
      this.atomGfx.fillStyle(C.white, 1);
      this.atomGfx.fillCircle(cx + rx, cy + ry, 1.5);
    });
  }
}

// ─────────────────────────────────────────────────────────
//  GAME CONFIG
// ─────────────────────────────────────────────────────────
new Phaser.Game({
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#030206',
  parent: 'game-root',
  scene: [TitleScene, GameScene],
  physics: { default: 'arcade' },
  audio: { noAudio: false },
  render: { pixelArt: false, antialias: true },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
});
