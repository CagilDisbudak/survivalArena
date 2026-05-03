/**
 * Zombie Survival Arena - Hack & Slash (Vampire Survivors Style)
 */

// --- Constants & Config ---
const CONFIG = {
    canvasId: 'gameCanvas',
    gridSize: 64,
    colors: {
        player: '#4444ff',
        zombieNormal: '#111',
        zombieFast: '#331111',
        zombieTank: '#113311',
        zombieBoss: '#550000',
        xp: '#3b5998', // Blue gems
        gold: '#d4af37',
        health: '#cc0000',
        blood: '#8b0000',
        whip: '#ffffff'
    },
    spawnIntervalInitial: 500,
    spawnIntervalMin: 50,
    difficultyIncreaseInterval: 10000,
    dungeonAssetsPath: 'free-pixel-art-dungeon-objects-asset-pack/PNG/'
};

// --- Maps & Difficulty ---
const MAPS = {
    crypt: {
        name: 'Crypt',
        desc: 'Dark dungeon. Balanced enemy mix.',
        bgColor: '#1a1a1a',
        floorTint: null,
        decoColor: { rock: '#555', flower: '#8a8' },
        propCounts: { breakable: 70, solid: 35, shrines: 18, candelabras: 40 },
        weightBias: null,
        bossTimerStart: 90
    },
    forest: {
        name: 'Forest Arena',
        desc: 'Open green field. Faster swarms, more shrines.',
        bgColor: '#0e2010',
        floorTint: 'rgba(50, 130, 60, 0.28)',
        decoColor: { rock: '#3a5a3a', flower: '#ffeb6e' },
        propCounts: { breakable: 50, solid: 18, shrines: 26, candelabras: 20 },
        weightBias: { runner: 1.5, imp: 1.6, wogol: 1.3, brute: 0.6, tank: 0.5, orc_warrior: 0.7 },
        bossTimerStart: 100
    },
    hellscape: {
        name: 'Hellscape',
        desc: 'Crimson wasteland. Heavy hitters, early boss.',
        bgColor: '#1a0808',
        floorTint: 'rgba(170, 35, 25, 0.30)',
        decoColor: { rock: '#3a1a1a', flower: '#ff4422' },
        propCounts: { breakable: 60, solid: 50, shrines: 12, candelabras: 60 },
        weightBias: { brute: 1.6, tank: 1.7, orc_warrior: 1.5, walker: 0.6, runner: 0.7, imp: 0.7 },
        bossTimerStart: 60
    }
};

const DIFFICULTIES = {
    easy:      { name: 'Easy',      desc: 'Reduced enemy stats',          hpMult: 0.7, dmgMult: 0.7, budgetMult: 0.75, eliteMult: 0.5, goldMult: 0.8 },
    normal:    { name: 'Normal',    desc: 'Balanced challenge',           hpMult: 1.0, dmgMult: 1.0, budgetMult: 1.00, eliteMult: 1.0, goldMult: 1.0 },
    hard:      { name: 'Hard',      desc: 'Tougher, denser, more elites', hpMult: 1.4, dmgMult: 1.3, budgetMult: 1.30, eliteMult: 1.5, goldMult: 1.3 },
    nightmare: { name: 'Nightmare', desc: 'Brutal — bring everything',    hpMult: 1.9, dmgMult: 1.6, budgetMult: 1.60, eliteMult: 2.2, goldMult: 1.6 }
};

// --- Asset Loader ---
const ASSETS_PATH = '0x72_DungeonTilesetII_v1.7/frames/';
const ASSETS = {
    player: [],
    playerArmor1: [],
    playerArmor2: [],
    playerArmor3: [],
    playerArmor4: [],
    swords: [],
    walker: [],
    runner: [],
    imp: [],
    skelet: [],
    wogol: [],
    brute: [],
    spitter: [],
    orc_warrior: [],
    tank: [],
    howler: [],
    doc: [],
    boss: [],
    angel: [],
    orc_shaman: [],
    meat: null,
    xp: [],
    floor: [],
    dungeon: {
        supplies: null,
        other: null,
        pedestals: null,
        full: null
    }
};

async function loadAssets() {
    const loadImg = (path) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => { console.warn('Asset not found:', ASSETS_PATH + path); resolve(img); };
        img.src = ASSETS_PATH + path;
    });

    // Player (Knight)
    for(let i=0; i<4; i++) {
        ASSETS.player.push(await loadImg(`knight_m_idle_anim_f${i}.png`));
        ASSETS.playerArmor1.push(await loadImg(`knight_f_idle_anim_f${i}.png`));
        ASSETS.playerArmor2.push(await loadImg(`wizzard_m_idle_anim_f${i}.png`));
        ASSETS.playerArmor3.push(await loadImg(`wizzard_f_idle_anim_f${i}.png`));
        ASSETS.playerArmor4.push(await loadImg(`elf_m_idle_anim_f${i}.png`));
    }

    // Enemies
    for(let i=0; i<4; i++) {
        ASSETS.walker.push(await loadImg(`tiny_zombie_idle_anim_f${i}.png`));
        ASSETS.runner.push(await loadImg(`chort_idle_anim_f${i}.png`));
        ASSETS.imp.push(await loadImg(`imp_idle_anim_f${i}.png`));
        ASSETS.skelet.push(await loadImg(`skelet_idle_anim_f${i}.png`));
        ASSETS.wogol.push(await loadImg(`wogol_idle_anim_f${i}.png`));
        ASSETS.brute.push(await loadImg(`big_zombie_idle_anim_f${i}.png`));
        ASSETS.spitter.push(await loadImg(`goblin_idle_anim_f${i}.png`));
        ASSETS.orc_warrior.push(await loadImg(`orc_warrior_idle_anim_f${i}.png`));
        ASSETS.tank.push(await loadImg(`ogre_idle_anim_f${i}.png`));
        ASSETS.howler.push(await loadImg(`necromancer_anim_f${i}.png`));
        ASSETS.doc.push(await loadImg(`doc_idle_anim_f${i}.png`));
        ASSETS.boss.push(await loadImg(`big_demon_idle_anim_f${i}.png`));
        ASSETS.angel.push(await loadImg(`angel_idle_anim_f${i}.png`));
        ASSETS.orc_shaman.push(await loadImg(`orc_shaman_idle_anim_f${i}.png`));
        ASSETS.xp.push(await loadImg(`coin_anim_f${i}.png`));
    }

    // Weapons
    ASSETS.swords.push(await loadImg('weapon_regular_sword.png'));
    ASSETS.swords.push(await loadImg('weapon_knight_sword.png'));
    ASSETS.swords.push(await loadImg('weapon_golden_sword.png'));
    ASSETS.swords.push(await loadImg('weapon_lavish_sword.png'));

    // Misc
    ASSETS.meat = await loadImg('flask_red.png');
    
    // Terrain
    for(let i=1; i<=8; i++) {
        ASSETS.floor.push(await loadImg(`floor_${i}.png`));
    }

    // Dungeon Assets
    const loadDungeonImg = (path) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => { console.warn('Dungeon asset not found:', CONFIG.dungeonAssetsPath + path); resolve(img); };
        img.src = CONFIG.dungeonAssetsPath + path;
    });

    ASSETS.dungeon.supplies = await loadDungeonImg('supplies_objects.png');
    ASSETS.dungeon.other = await loadDungeonImg('Other_objects.png');
    ASSETS.dungeon.pedestals = await loadDungeonImg('pedestals.png');
    ASSETS.dungeon.full = await loadDungeonImg('full.png');
}


// --- Utilities ---
const dist = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
const randomRange = (min, max) => Math.random() * (max - min) + min;

class Vector2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    set(x, y) { this.x = x; this.y = y; return this; }
    add(v) { this.x += v.x; this.y += v.y; return this; }
    sub(v) { this.x -= v.x; this.y -= v.y; return this; }
    mul(s) { this.x *= s; this.y *= s; return this; }
    length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    normalize() {
        const len = this.length();
        if (len > 0) { this.x /= len; this.y /= len; }
        return this;
    }
    static dist(v1, v2) { return Math.sqrt((v2.x - v1.x) ** 2 + (v2.y - v1.y) ** 2); }
}

// --- Spatial Hashing for Optimization ---
class SpatialHash {
    constructor(cellSize = 100) {
        this.cellSize = cellSize;
        this.grid = new Map();
    }
    _key(x, y) {
        const cx = Math.floor(x / this.cellSize);
        const cy = Math.floor(y / this.cellSize);
        return `${cx},${cy}`;
    }
    clear() { this.grid.clear(); }
    insert(obj) {
        const key = this._key(obj.pos.x, obj.pos.y);
        if (!this.grid.has(key)) this.grid.set(key, []);
        this.grid.get(key).push(obj);
    }
    query(x, y, radius) {
        const results = [];
        const startX = Math.floor((x - radius) / this.cellSize);
        const endX = Math.floor((x + radius) / this.cellSize);
        const startY = Math.floor((y - radius) / this.cellSize);
        const endY = Math.floor((y + radius) / this.cellSize);

        for (let ix = startX; ix <= endX; ix++) {
            for (let iy = startY; iy <= endY; iy++) {
                const key = `${ix},${iy}`;
                const cell = this.grid.get(key);
                if (cell) results.push(...cell);
            }
        }
        return results;
    }
}

// --- Game Engine Classes ---

class Camera {
    constructor() {
        this.pos = new Vector2();
        this.targetPos = new Vector2();
        this.shake = 0;
        this.lerpSpeed = 0.1;
    }
    update(playerPos, canvasWidth, canvasHeight, dt) {
        this.targetPos.x = playerPos.x - canvasWidth / 2;
        this.targetPos.y = playerPos.y - canvasHeight / 2;
        
        // Smooth follow (lerp)
        this.pos.x += (this.targetPos.x - this.pos.x) * this.lerpSpeed;
        this.pos.y += (this.targetPos.y - this.pos.y) * this.lerpSpeed;

        if (this.shake > 0) {
            this.pos.x += randomRange(-this.shake, this.shake);
            this.pos.y += randomRange(-this.shake, this.shake);
            this.shake -= dt * 25;
        }
    }
    applyShake(intensity = 8) {
        this.shake = intensity;
    }
}

class Particle {
    constructor(x, y, color, size, velocity, life) {
        this.pos = new Vector2(x, y);
        this.vel = velocity;
        this.color = color;
        this.size = size;
        this.life = life;
        this.maxLife = life;
    }
    update(dt) {
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        this.life -= dt;
    }
    draw(ctx, cam) {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.pos.x - cam.pos.x, this.pos.y - cam.pos.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

class FloatingText {
    constructor(x, y, text, color, life = 0.8) {
        this.pos = new Vector2(x, y);
        this.text = text;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.vel = new Vector2(randomRange(-10, 10), -40);
    }
    update(dt) {
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;
        this.life -= dt;
    }
    draw(ctx, cam) {
        ctx.globalAlpha = this.life / this.maxLife;
        ctx.fillStyle = this.color;
        ctx.font = '16px "VT323"';
        ctx.textAlign = 'center';
        // Add outline for readability
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeText(this.text, this.pos.x - cam.pos.x, this.pos.y - cam.pos.y);
        ctx.fillText(this.text, this.pos.x - cam.pos.x, this.pos.y - cam.pos.y);
        ctx.globalAlpha = 1;
    }
}

// Whip Effect (Hack & Slash)
class WhipAttack {
    constructor(x, y, angle, range, thickness, tier) {
        this.pos = new Vector2(x, y);
        this.angle = angle;
        this.range = range;
        this.thickness = thickness;
        this.tier = tier; // Allow high tiers for magic effect
        this.life = 0.15; 
        this.maxLife = 0.15;
    }
    update(dt) {
        this.life -= dt;
    }
    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.angle);
        
        ctx.globalAlpha = (this.life / this.maxLife);
        
        // Calculate swing progress 0.0 to 1.0
        const progress = 1.0 - (this.life / this.maxLife);
        const swingAngle = (progress * Math.PI) - (Math.PI / 2); // Swing from -90 to +90 degrees

        // Draw Sword Sprite
        const swordImg = ASSETS.swords[Math.min(ASSETS.swords.length - 1, this.tier)];
        ctx.save();
        ctx.rotate(swingAngle);
        // Draw sword extending outward from the center - Scaled to match player
        const swordScale = 2;
        ctx.drawImage(swordImg, - (swordImg.width * swordScale)/2, -this.range + 10, swordImg.width * swordScale, swordImg.height * swordScale);
        ctx.restore();

        // Swoosh effect (draws the arc behind the sword)
        const grad = ctx.createRadialGradient(this.range/2, 0, 0, this.range/2, 0, this.range);
        const colors = ["#fff", "#88f", "#ffd700", "#ff00ff", "#0ff"];
        const tierColor = colors[Math.min(4, this.tier)];
        grad.addColorStop(0, tierColor);
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        
        ctx.fillStyle = grad;

        ctx.beginPath();
        // The arc starts at the beginning of the swing and ends at the current sword position
        ctx.ellipse(0, 0, this.range, this.range, 0, -Math.PI/2, swingAngle);
        ctx.lineTo(0,0);
        ctx.fill();
        
        ctx.restore();
    }
}

class HealthPickup {
    constructor(x, y, amount) {
        this.pos = new Vector2(x, y);
        this.amount = amount;
        this.toDelete = false;
        this.radius = 15;
    }
    update(player, dt) {
        if (Vector2.dist(this.pos, player.pos) < player.radius + this.radius) {
            player.heal(this.amount);
            this.toDelete = true;
            gameInstance.addFloatingText(this.pos.x, this.pos.y, `+${this.amount}HP`, "#0f0");
        }
    }
    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        ctx.drawImage(ASSETS.meat, x - 15, y - 15);
    }
}

class XPOrb {
    constructor(x, y, value) {
        this.pos = new Vector2(x, y);
        this.value = value;
        this.radius = 4;
        this.isBeingPulled = false;
        this.toDelete = false;
    }
    update(player, dt) {
        const dx = player.pos.x - this.pos.x;
        const dy = player.pos.y - this.pos.y;
        const d = Math.hypot(dx, dy) || 1;

        if (d < player.magnetRange) this.isBeingPulled = true;

        if (this.isBeingPulled) {
            // Direct beeline toward player — speed ramps up as it gets closer
            const speed = 480 + (1 - Math.min(d / player.magnetRange, 1)) * 480;
            this.pos.x += (dx / d) * speed * dt;
            this.pos.y += (dy / d) * speed * dt;
        }

        if (d < 16) {
            player.gainXP(this.value);
            this.toDelete = true;
        }
    }
    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        const frame = Math.floor(Date.now() / 150) % ASSETS.xp.length;
        const img = ASSETS.xp[frame];
        ctx.drawImage(img, x - 10, y - 10, 20, 20);
    }
}

class Prop {
    constructor(x, y, type) {
        this.pos = new Vector2(x, y);
        this.type = type;
        this.toDelete = false;

        // hp: breakable props take damage, solid ones are indestructible
        const breakable = ['barrel', 'crate', 'chest', 'sack', 'vase'];
        this.hp = breakable.includes(type) ? (type === 'chest' ? 3 : 1) : Infinity;

        // collision radius by type
        const radii = { barrel: 18, crate: 18, chest: 20, sack: 14, vase: 12, pillar: 22, statue: 20, column: 26 };
        this.radius = radii[type] || 18;

        // sprite regions — (sheet, x, y, w, h) in 16-px grid
        // supplies_objects.png (208×592): barrel col7r9, crate col5r9
        // supplies nearby: chest-like objects at row 7 (y=112), sacks/vases near top
        // Other_objects.png (352×112): pillar col1r1, statue col5r1, column col10r1
        this.regions = {
            'barrel':  { sheet: 'supplies', x: 112, y: 144, w: 16, h: 16 },
            'crate':   { sheet: 'supplies', x:  80, y: 144, w: 16, h: 16 },
            'chest':   { sheet: 'supplies', x:   0, y: 112, w: 16, h: 16 },
            'sack':    { sheet: 'supplies', x:  16, y:   0, w: 16, h: 16 },
            'vase':    { sheet: 'supplies', x:  32, y:   0, w: 16, h: 16 },
            'pillar':  { sheet: 'other',    x:  16, y:  16, w: 16, h: 32 },
            'statue':  { sheet: 'other',    x:  80, y:  16, w: 16, h: 32 },
            'column':  { sheet: 'other',    x: 160, y:  16, w: 16, h: 32 },
        };
    }
    update(player, dt) {
        const d = Vector2.dist(this.pos, player.pos);
        if (d < this.radius + player.radius) {
            const overlap = (this.radius + player.radius) - d;
            const dir = new Vector2(player.pos.x - this.pos.x, player.pos.y - this.pos.y).normalize();
            player.pos.add(dir.mul(overlap));
        }
    }
    takeDamage(amount, game) {
        if (this.hp === Infinity) return;
        this.hp -= amount;
        if (this.hp <= 0) {
            this.toDelete = true;
            if (this.type === 'chest') {
                // Chest: generous loot burst
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    game.xpOrbs.push(new XPOrb(this.pos.x + Math.cos(a) * 20, this.pos.y + Math.sin(a) * 20, 6));
                }
                if (Math.random() < 0.55) game.healthPickups.push(new HealthPickup(this.pos.x, this.pos.y, 20));
                game.addFloatingText(this.pos.x, this.pos.y - 16, '+Chest', CONFIG.colors.gold);
            } else {
                game.xpOrbs.push(new XPOrb(this.pos.x, this.pos.y, this.type === 'sack' ? 3 : 5));
                if (Math.random() < 0.25) game.healthPickups.push(new HealthPickup(this.pos.x, this.pos.y, 10));
            }
        }
    }
    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        const reg = this.regions[this.type];
        if (!reg) return;
        const img = ASSETS.dungeon[reg.sheet];
        if (!img || !img.complete || !img.naturalWidth) return;

        const scale = 3;
        ctx.drawImage(img, reg.x, reg.y, reg.w, reg.h,
            x - (reg.w * scale) / 2, y - (reg.h * scale) / 2,
            reg.w * scale, reg.h * scale);
    }
}

// --- Shrine: Interactive pedestal that gives XP burst when touched ---
class Shrine {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.radius = 28;
        this.used = false;
        this.toDelete = false;
        this.glowTimer = Math.random() * Math.PI * 2; // random phase
        this.variant = Math.floor(Math.random() * 5); // 5 pedestal designs
    }
    update(player, dt, game) {
        this.glowTimer += dt;
        if (!this.used && Vector2.dist(this.pos, player.pos) < this.radius + player.radius) {
            this.activate(game);
        }
    }
    activate(game) {
        this.used = true;
        for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            game.xpOrbs.push(new XPOrb(
                this.pos.x + Math.cos(angle) * 40,
                this.pos.y + Math.sin(angle) * 40,
                8
            ));
        }
        if (Math.random() < 0.4) {
            game.healthPickups.push(new HealthPickup(this.pos.x, this.pos.y, 30));
        }
        game.addFloatingText(this.pos.x, this.pos.y - 24, '✦ Blessed!', '#ffd700');
        game.camera.applyShake(4);
    }
    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        const img = ASSETS.dungeon.pedestals;
        if (!img || !img.complete || !img.naturalWidth) return;

        const scale = 3;
        const sw = 16, sh = 32;
        const sx = this.variant * 32;

        if (this.used) {
            const prevAlpha = ctx.globalAlpha;
            ctx.globalAlpha = 0.4;
            ctx.drawImage(img, sx, 0, sw, sh, x - (sw * scale) / 2, y - sh * scale, sw * scale, sh * scale);
            ctx.globalAlpha = prevAlpha;
            return;
        }

        const glowVal = (Math.sin(this.glowTimer * 2.5) + 1) * 0.5;
        const glowSprite = gameInstance && gameInstance.glowSprite;
        if (glowSprite) {
            const gs = 90 + glowVal * 30;
            const prevComp = ctx.globalCompositeOperation;
            const prevAlpha = ctx.globalAlpha;
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.30 + glowVal * 0.25;
            ctx.drawImage(glowSprite, x - gs/2, y - sh*scale/2 - gs/2, gs, gs);
            ctx.globalCompositeOperation = prevComp;
            ctx.globalAlpha = prevAlpha;
        }

        ctx.drawImage(img, sx, 0, sw, sh, x - (sw * scale) / 2, y - sh * scale, sw * scale, sh * scale);

        const bounce = Math.sin(this.glowTimer * 3) * 4;
        ctx.fillStyle = '#ffe066';
        const prevAlpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(x, y - sh * scale - 8 + bounce, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = prevAlpha;
    }
}

// --- Candelabra: Decorative dungeon light source ---
class Candelabra {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.radius = 8;
        this.animTimer = Math.random() * Math.PI * 2;
        this.variant = Math.floor(Math.random() * 4); // 4 light objects from full.png
        this.flickerOffset = Math.random() * Math.PI * 2;
    }
    update(dt) {
        this.animTimer += dt;
    }
    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        const img = ASSETS.dungeon.full;
        if (!img || !img.complete || !img.naturalWidth) return;

        const flicker = (Math.sin(this.animTimer * 8 + this.flickerOffset) + 1) * 0.5;
        const glow = gameInstance && gameInstance.glowSprite;
        if (glow) {
            const gs = 80 + flicker * 30;
            const prevComp = ctx.globalCompositeOperation;
            const prevAlpha = ctx.globalAlpha;
            ctx.globalCompositeOperation = 'lighter';
            ctx.globalAlpha = 0.35 + flicker * 0.15;
            ctx.drawImage(glow, x - gs/2, y - 32 - gs/2, gs, gs);
            ctx.globalCompositeOperation = prevComp;
            ctx.globalAlpha = prevAlpha;
        }

        const scale = 3;
        const sw = 16, sh = 32;
        const sx = this.variant * 16;
        const sy = 0;
        ctx.drawImage(img, sx, sy, sw, sh, x - (sw * scale) / 2, y - sh * scale, sw * scale, sh * scale);
    }
}

class Zombie {
    constructor(x, y, type = 'normal') {
        this.pos = new Vector2(x, y);
        this.type = type;
        this.toDelete = false;
        this.radius = 16;
        this.flash = 0;
        this.animTimer = 0;
        this.isElite = Math.random() < 0.05; // 5% chance for elite
        
        this.abilityTimer = 0;

        switch (type) {
            // ── Tier 1 ──────────────────────────────────────────────────
            case 'runner':
                this.hp = 14; this.speed = 2.2; this.damage = 8;
                this.xpValue = 1; this.spriteKey = 'runner';
                break;
            case 'imp':
                this.hp = 10; this.speed = 3.0; this.damage = 5;
                this.xpValue = 1; this.radius = 10; this.spriteKey = 'imp';
                break;
            // ── Tier 2 ──────────────────────────────────────────────────
            case 'skelet':
                this.hp = 38; this.speed = 1.7; this.damage = 12;
                this.xpValue = 2; this.spriteKey = 'skelet';
                break;
            case 'wogol':
                this.hp = 52; this.speed = 1.55; this.damage = 14;
                this.xpValue = 2; this.spriteKey = 'wogol';
                break;
            case 'spitter':
                this.hp = 28; this.speed = 1.2; this.damage = 6;
                this.xpValue = 2; this.spriteKey = 'spitter';
                break;
            // ── Tier 3 ──────────────────────────────────────────────────
            case 'brute':
                this.hp = 72; this.speed = 1.0; this.damage = 18;
                this.xpValue = 3; this.radius = 32; this.spriteKey = 'brute';
                break;
            case 'orc_warrior':
                this.hp = 130; this.speed = 1.2; this.damage = 22;
                this.xpValue = 4; this.radius = 22; this.spriteKey = 'orc_warrior';
                break;
            case 'howler':
                this.hp = 90; this.speed = 1.05; this.damage = 12;
                this.xpValue = 4; this.spriteKey = 'howler';
                break;
            // ── Tier 4 ──────────────────────────────────────────────────
            case 'tank':
                this.hp = 180; this.speed = 0.75; this.damage = 25;
                this.xpValue = 5; this.radius = 40; this.spriteKey = 'tank';
                break;
            case 'doc':
                this.hp = 65; this.speed = 0.9; this.damage = 8;
                this.xpValue = 3; this.spriteKey = 'doc';
                this.abilityTimer = 3;
                break;
            // ── Bosses ──────────────────────────────────────────────────
            case 'boss':
                this.hp = 1000; this.speed = 0.55; this.damage = 50;
                this.xpValue = 500; this.radius = 60;
                this.spriteKey = 'boss'; this.isElite = false;
                break;
            case 'angel_boss':
                this.hp = 800; this.speed = 1.4; this.damage = 40;
                this.xpValue = 400; this.radius = 52;
                this.spriteKey = 'angel'; this.isElite = false;
                break;
            case 'shaman_boss':
                this.hp = 650; this.speed = 0.85; this.damage = 32;
                this.xpValue = 350; this.radius = 48;
                this.spriteKey = 'orc_shaman'; this.isElite = false;
                this.abilityTimer = 5;
                break;
            default: // walker
                this.hp = 20; this.speed = 1.35; this.damage = 10;
                this.xpValue = 1; this.spriteKey = 'walker';
        }
        
        // Difficulty multipliers (set on Game; default to Normal if missing)
        const diff = (gameInstance && gameInstance.diffCfg) || { hpMult:1, dmgMult:1, eliteMult:1 };

        // Elite chance grows with time, scaled by difficulty
        if (!this.isElite && this.type !== 'boss' && this.type !== 'angel_boss' && this.type !== 'shaman_boss') {
            const m = gameInstance ? (Date.now() - gameInstance.startTime) / 60000 : 0;
            const eliteChance = Math.min(0.5, (0.05 + m * 0.015) * diff.eliteMult);
            this.isElite = Math.random() < eliteChance;
        }

        if (this.isElite) {
            this.hp *= 3;
            this.damage *= 1.8;
            this.speed *= 1.3;
            this.xpValue *= 5;
        }

        // Scale stats by time — aggressive curve
        if (gameInstance && gameInstance.startTime) {
            const m = (Date.now() - gameInstance.startTime) / 60000;
            const hpScale  = 1 + 0.30 * m + 0.04 * m * m;
            const dmgScale = 1 + 0.18 * m + 0.012 * m * m;
            const spdScale = 1 + 0.06 * m;
            this.hp     *= hpScale;
            this.damage *= dmgScale;
            this.speed  *= spdScale;
        }

        // Apply difficulty multipliers
        this.hp     *= diff.hpMult;
        this.damage *= diff.dmgMult;

        this.maxHp = this.hp;
    }

    update(player, dt, game) {
        this.animTimer += dt * 5;

        const dir = new Vector2(player.pos.x - this.pos.x, player.pos.y - this.pos.y).normalize();

        // Imp: erratic zigzag movement
        if (this.type === 'imp') {
            dir.x += Math.sin(this.animTimer * 5) * 0.8;
            dir.y += Math.cos(this.animTimer * 4.3) * 0.8;
            dir.normalize();
        }

        this.pos.add(dir.mul(this.speed * dt * 60));

        if (this.flash > 0) this.flash -= dt * 10;

        // Doc: periodically heals nearby allies
        if (this.type === 'doc') {
            this.abilityTimer -= dt;
            if (this.abilityTimer <= 0) {
                this.abilityTimer = 4;
                const nearby = game.spatialHash.query(this.pos.x, this.pos.y, 130);
                nearby.forEach(z => {
                    if (z !== this && z.hp < z.maxHp) {
                        const heal = z.maxHp * 0.12;
                        z.hp = Math.min(z.maxHp, z.hp + heal);
                        game.addFloatingText(z.pos.x, z.pos.y - 10, `+${Math.floor(heal)}`, '#33ff66');
                    }
                });
            }
        }

        // Shaman boss: summons adds
        if (this.type === 'shaman_boss') {
            this.abilityTimer -= dt;
            if (this.abilityTimer <= 0) {
                this.abilityTimer = 5;
                for (let i = 0; i < 4; i++) {
                    const a = (i / 4) * Math.PI * 2 + Math.random();
                    const r = 70 + Math.random() * 60;
                    game.zombies.push(new Zombie(this.pos.x + Math.cos(a) * r, this.pos.y + Math.sin(a) * r, Math.random() < 0.5 ? 'runner' : 'skelet'));
                }
                game.addFloatingText(this.pos.x, this.pos.y - 30, 'ÇAĞIRMA!', '#a335ee');
            }
        }

        // Collision with player
        const d = Vector2.dist(this.pos, player.pos);
        if (d < this.radius + player.radius) {
            player.takeDamage(this.damage * dt);
        }
    }

    takeDamage(amount, game) {
        this.hp -= amount;
        this.flash = 1;
        game.addFloatingText(this.pos.x, this.pos.y, Math.floor(amount), '#fff');
        
        // Minor knockback
        const kbDir = new Vector2(this.pos.x - game.player.pos.x, this.pos.y - game.player.pos.y).normalize();
        this.pos.add(kbDir.mul(10));

        if (this.hp <= 0) {
            this.die(game);
        }
    }

    die(game) {
        this.toDelete = true;
        game.kills++;
        
        const r = Math.random();
        const diffGoldMult = (game.diffCfg && game.diffCfg.goldMult) || 1;
        const goldMult = (1 + (game.player.meta.goldGain * 0.1)) * diffGoldMult;
        if (r < 0.05 * goldMult) {
            game.gold += 1;
            game.addFloatingText(this.pos.x, this.pos.y, "+1🪙", CONFIG.colors.gold);
        } else if (r < 0.08) {
            game.healthPickups.push(new HealthPickup(this.pos.x, this.pos.y, 20));
        } else {
            const xpMult = 1 + (game.player.meta.xpGain * 0.05);
            game.xpOrbs.push(new XPOrb(this.pos.x, this.pos.y, this.xpValue * xpMult));
        }
        
        // Persistent blood stain on ground
        game.bloodStains.push({
            pos: new Vector2(this.pos.x, this.pos.y),
            size: randomRange(10, 25),
            life: 8.0 
        });
    }

    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;
        
        ctx.save();
        if (this.flash > 0) {
            ctx.filter = 'brightness(220%) contrast(160%)';
        } else if (this.type === 'angel_boss') {
            ctx.filter = 'brightness(140%) drop-shadow(0 0 8px #88ffff)';
        } else if (this.type === 'shaman_boss') {
            ctx.filter = 'hue-rotate(280deg) brightness(130%) drop-shadow(0 0 8px #a335ee)';
        } else if (this.type === 'doc') {
            ctx.filter = 'hue-rotate(120deg) brightness(110%)';
        } else if (this.isElite) {
            ctx.filter = 'hue-rotate(240deg) brightness(120%) drop-shadow(0 0 5px #f0f)';
        }

        const sprites = ASSETS[this.spriteKey];
        const frame = Math.floor(this.animTimer) % sprites.length;
        const img = sprites[frame];

        let scale = 3;
        if (this.type === 'imp')         scale = 2;
        if (this.type === 'brute')       scale = 4.5;
        if (this.type === 'orc_warrior') scale = 3.5;
        if (this.type === 'tank')        scale = 5;
        if (this.type === 'boss')        scale = 8;
        if (this.type === 'angel_boss')  scale = 7;
        if (this.type === 'shaman_boss') scale = 6;

        // Draw centered
        ctx.drawImage(img, x - (img.width*scale)/2, y - (img.height*scale)/2, img.width*scale, img.height*scale);
        
        // Health bar — wider for bosses
        const isBoss = this.type === 'boss' || this.type === 'angel_boss' || this.type === 'shaman_boss';
        const hbWidth = isBoss ? 80 : (this.type === 'brute' || this.type === 'tank' ? 44 : 30);
        const hbHeight = isBoss ? 7 : 4;
        const hbX = x - hbWidth / 2;
        const hbY = y - (img.height * scale) / 2 - 12;
        ctx.fillStyle = '#000';
        ctx.fillRect(hbX, hbY, hbWidth, hbHeight);
        ctx.fillStyle = isBoss ? '#ff4444' : CONFIG.colors.health;
        ctx.fillRect(hbX, hbY, (this.hp / this.maxHp) * hbWidth, hbHeight);

        ctx.restore();
    }
}

class Player {
    constructor(meta) {
        // Load Meta Upgrades
        const m = meta || { hp: 0, damage: 0, goldGain: 0, xpGain: 0 };
        
        this.pos = new Vector2(0, 0);
        this.radius = 12;
        this.maxHp = 100 + m.hp * 10;
        this.hp = this.maxHp;
        this.speed = 3.5;
        this.xp = 0;
        this.level = 1;
        this.magnetRange = 80;
        this.regen = 0;
        
        this.facingRight = true;
        
        // Whip Stats
        this.whipDamage = 25 * (1 + m.damage * 0.05);
        this.whipCooldown = 0.4; 
        this.whipRange = 140;
        this.whipThickness = 60;
        this.whipTimer = 0;
        
        this.animTimer = 0;
        this.isMoving = false;
        this.armorLevel = 0;
        this.swingTimer = 0;
        this.projectiles = 1;
        
        this.meta = m; // Store for gainXP and die logic
    }

    update(input, dt, game) {
        if (this.regen > 0) {
            this.hp = Math.min(this.maxHp, this.hp + this.regen * dt);
        }

        const move = new Vector2();
        if (input.keys['w'] || input.keys['arrowup']) move.y -= 1;
        if (input.keys['s'] || input.keys['arrowdown']) move.y += 1;
        if (input.keys['a'] || input.keys['arrowleft']) { move.x -= 1; this.facingRight = false; }
        if (input.keys['d'] || input.keys['arrowright']) { move.x += 1; this.facingRight = true; }
        
        this.isMoving = move.length() > 0;
        if (this.isMoving) {
            this.animTimer += dt * 8;
            move.normalize();
            this.pos.add(move.mul(this.speed * dt * 60));
        } else {
            this.animTimer = 0;
        }

        // Update armor display UI
        document.getElementById('armorLevelText').innerText = `Armor: ${this.armorLevel}`;
        this.whipTimer -= dt;
        if (this.swingTimer > 0) this.swingTimer -= dt;

        if (this.whipTimer <= 0) {
            // Find nearest enemy if not clicking
            if (!input.mouseDown) {
                const nearest = game.getNearestEnemy(this.pos, this.whipRange);
                if (nearest) {
                    const angle = Math.atan2(nearest.pos.y - this.pos.y, nearest.pos.x - this.pos.x);
                    this.performAttack(game, angle);
                }
            } else {
                const mouseX = game.input.mousePos.x + game.camera.pos.x;
                const mouseY = game.input.mousePos.y + game.camera.pos.y;
                const angle = Math.atan2(mouseY - this.pos.y, mouseX - this.pos.x);
                this.performAttack(game, angle);
            }
        }
    }

    performAttack(game, angle) {
        this.whipTimer = this.whipCooldown;
        this.swingTimer = 0.15;
        
        for (let i = 0; i < this.projectiles; i++) {
            // Slight delay or offset for multiple projectiles
            const offset = (i - (this.projectiles - 1) / 2) * 0.4;
            const attack = new WhipAttack(this.pos.x, this.pos.y, angle + offset, this.whipRange, this.whipThickness, this.armorLevel);
            game.attacks.push(attack);
            
            // Damage zombies in a cone/arc for each swing
            const nearZombies = game.spatialHash.query(this.pos.x, this.pos.y, this.whipRange);
            nearZombies.forEach(z => {
                const dx = z.pos.x - this.pos.x;
                const dy = z.pos.y - this.pos.y;
                const distZ = Math.sqrt(dx*dx + dy*dy);
                
                if (distZ < this.whipRange) {
                    const zAngle = Math.atan2(dy, dx);
                    let diff = Math.abs((angle + offset) - zAngle);
                    if (diff > Math.PI) diff = Math.PI * 2 - diff;
                    if (diff < 0.8) z.takeDamage(this.whipDamage, game);
                }
            });

            // Damage props
            game.props.forEach(p => {
                const dx = p.pos.x - this.pos.x;
                const dy = p.pos.y - this.pos.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < this.whipRange) {
                    const pAngle = Math.atan2(dy, dx);
                    let diff = Math.abs((angle + offset) - pAngle);
                    if (diff > Math.PI) diff = Math.PI * 2 - diff;
                    if (diff < 1.0) p.takeDamage(this.whipDamage, game);
                }
            });
        }
        
        game.camera.applyShake(2);
    }

    attack(game) {
        const mouseX = game.input.mousePos.x + game.camera.pos.x;
        const mouseY = game.input.mousePos.y + game.camera.pos.y;
        const angle = Math.atan2(mouseY - this.pos.y, mouseX - this.pos.x);
        
        const attack = new WhipAttack(this.pos.x, this.pos.y, angle, this.whipRange, this.whipThickness, this.armorLevel);
        game.attacks.push(attack);
        game.camera.applyShake(3);
        
        // Damage zombies in a cone/arc
        game.zombies.forEach(z => {
            const dx = z.pos.x - this.pos.x;
            const dy = z.pos.y - this.pos.y;
            const distZ = Math.sqrt(dx*dx + dy*dy);
            
            if (distZ < this.whipRange) {
                const zAngle = Math.atan2(dy, dx);
                let diff = Math.abs(angle - zAngle);
                if (diff > Math.PI) diff = Math.PI * 2 - diff;
                
                if (diff < 0.8) { // Approx 45 degrees arc
                    z.takeDamage(this.whipDamage, game);
                }
            }
        });
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp <= 0) {
            this.hp = 0;
            gameInstance.gameOver();
        }
    }

    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }

    gainXP(amount) {
        this.xp += amount;
        const req = this.getLevelRequirement();
        if (this.xp >= req) {
            this.xp -= req;
            this.level++;
            gameInstance.levelUp();
        }
    }

    getLevelRequirement() {
        // Report formula: round(24 + 8*level + 1.9*level^2)
        return Math.round(24 + 8 * this.level + 1.9 * Math.pow(this.level, 2));
    }

    draw(ctx, cam) {
        const x = this.pos.x - cam.pos.x;
        const y = this.pos.y - cam.pos.y;

        let sprites = ASSETS.player;
        if (this.armorLevel === 1) sprites = ASSETS.playerArmor1;
        if (this.armorLevel === 2) sprites = ASSETS.playerArmor2;
        if (this.armorLevel === 3) sprites = ASSETS.playerArmor3;
        if (this.armorLevel >= 4) sprites = ASSETS.playerArmor4;

        const frame = this.isMoving ? (Math.floor(this.animTimer) % sprites.length) : 0;
        const img = sprites[frame];

        ctx.save();
        ctx.translate(x, y);
        if (!this.facingRight) {
            ctx.scale(-1, 1); // Flip horizontally
        }
        
        // Draw centered on position with proper scale
        const playerScale = 2;
        ctx.drawImage(img, -(img.width * playerScale)/2, -(img.height * playerScale)/2, img.width * playerScale, img.height * playerScale);
        
        ctx.restore();

        // Draw Resting Sword if not currently swinging
        if (this.swingTimer <= 0) {
            const swordImg = ASSETS.swords[Math.min(3, this.armorLevel)];
            ctx.save();
            ctx.translate(x, y);
            // Flip if facing left
            if (!this.facingRight) ctx.scale(-1, 1);
            
            // Draw sword in hand (resting pointing somewhat up/forward)
            ctx.rotate(Math.PI / 4); 
            const swordScale = 2;
            ctx.drawImage(swordImg, -(swordImg.width * swordScale)/2, -20, swordImg.width * swordScale, swordImg.height * swordScale);
            ctx.restore();
        }

        // Draw Health bar BELOW the player directly in world space
        const barWidth = 30;
        const barHeight = 4;
        ctx.fillStyle = '#000';
        ctx.fillRect(x - barWidth/2, y + this.radius + 10, barWidth, barHeight);
        ctx.fillStyle = CONFIG.colors.health;
        ctx.fillRect(x - barWidth/2, y + this.radius + 10, (this.hp / this.maxHp) * barWidth, barHeight);
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById(CONFIG.canvasId);
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.ctx.imageSmoothingEnabled = false;
        this.terrainPattern = null;
        this.hudAccum = 0;
        this.fpsCap = 60;
        this.frameMinDt = 1 / this.fpsCap - 0.001;
        this.lastFrameTime = 0;
        this.glowSprite = null;
        
        // Meta Progression
        this.totalGold = parseInt(localStorage.getItem('zsaTotalGold')) || 0;
        this.metaUpgrades = JSON.parse(localStorage.getItem('zsaMetaUpgrades')) || {
            hp: 0,
            damage: 0,
            goldGain: 0,
            xpGain: 0
        };

        this.state = 'start';
        this.player = new Player(this.metaUpgrades);
        this.camera = new Camera();
        this.input = { 
            keys: {},
            mousePos: { x: 0, y: 0 },
            mouseDown: false
        };
        
        this.zombies = [];
        this.attacks = [];
        this.xpOrbs = [];
        this.particles = [];
        this.floatingTexts = [];
        this.bloodStains = [];
        this.healthPickups = [];
        this.decorations = [];
        this.props = [];
        this.shrines = [];
        this.candelabras = [];
        this.spatialHash = new SpatialHash(100);
        
        // Generate Terrain Decorations
        for(let i=0; i<100; i++) {
            this.decorations.push({
                x: randomRange(-2000, 2000),
                y: randomRange(-2000, 2000),
                type: Math.random() > 0.5 ? 'rock' : 'flower'
            });
        }
        
        this.kills = 0;
        this.gold = 0;
        this.startTime = 0;
        this.currentTime = 0;
        this.lastTime = 0;
        
        this.spawnTimer = 0;
        this.spawnInterval = CONFIG.spawnIntervalInitial;
        this.difficultyTimer = 0;
        this.zombiesPerSpawn = 2; // Start with more
        
        this.spawnBudget = 0;
        this.bossTimer = 90; // first boss at 90 seconds

        // Map & difficulty (persist last choice)
        this.selectedMap = localStorage.getItem('zsaMap') || 'crypt';
        if (!MAPS[this.selectedMap]) this.selectedMap = 'crypt';
        this.selectedDifficulty = localStorage.getItem('zsaDifficulty') || 'normal';
        if (!DIFFICULTIES[this.selectedDifficulty]) this.selectedDifficulty = 'normal';
        this.mapCfg = MAPS[this.selectedMap];
        this.diffCfg = DIFFICULTIES[this.selectedDifficulty];

        this.loading = true;
        loadAssets().then(() => {
            this.loading = false;
            this.buildTerrainPattern();
            this.buildGlowSprite();
            this.init();
        });
    }

    buildGlowSprite() {
        const size = 96;
        const off = document.createElement('canvas');
        off.width = size;
        off.height = size;
        const g = off.getContext('2d');
        const grad = g.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        grad.addColorStop(0, 'rgba(255,255,255,0.9)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.35)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
        this.glowSprite = off;
    }

    buildTerrainPattern() {
        const tileSize = 64;
        const chunkTiles = 8;
        const off = document.createElement('canvas');
        off.width = chunkTiles * tileSize;
        off.height = chunkTiles * tileSize;
        const ictx = off.getContext('2d');
        ictx.imageSmoothingEnabled = false;
        const len = ASSETS.floor.length || 1;
        for (let c = 0; c < chunkTiles; c++) {
            for (let r = 0; r < chunkTiles; r++) {
                const idx = Math.abs((c * 13 + r * 7) % len);
                const img = ASSETS.floor[idx];
                if (img) ictx.drawImage(img, c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
        this.terrainPattern = this.ctx.createPattern(off, 'repeat');
    }

    init() {
        window.addEventListener('resize', () => this.resize());
        this.resize();

        window.addEventListener('keydown', (e) => {
            this.input.keys[e.key.toLowerCase()] = true;
            if (e.key === 'Escape') this.togglePause();
        });
        window.addEventListener('keyup', (e) => {
            this.input.keys[e.key.toLowerCase()] = false;
        });

        window.addEventListener('mousemove', (e) => {
            this.input.mousePos.x = e.clientX;
            this.input.mousePos.y = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            this.input.mouseDown = true;
        });

        window.addEventListener('mouseup', () => {
            this.input.mouseDown = false;
        });

        document.getElementById('startBtn').onclick = () => this.start();
        document.getElementById('restartBtn').onclick = () => this.restart();
        document.getElementById('shopBtn').onclick = () => this.openShop();
        document.getElementById('closeShopBtn').onclick = () => this.showScreen('startScreen');
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) menuBtn.onclick = () => {
            this.state = 'start';
            this.renderSelectors();
            this.updateStartScreen();
            this.showScreen('startScreen');
        };

        this.renderSelectors();
        this.updateStartScreen();
        requestAnimationFrame((t) => this.loop(t));
    }

    renderSelectors() {
        const mapRow = document.getElementById('mapSelector');
        const mapDesc = document.getElementById('mapDesc');
        mapRow.innerHTML = '';
        Object.entries(MAPS).forEach(([id, cfg]) => {
            const btn = document.createElement('button');
            btn.className = 'selector-btn' + (id === this.selectedMap ? ' active' : '');
            btn.innerText = cfg.name;
            btn.onclick = () => {
                this.selectedMap = id;
                this.mapCfg = cfg;
                localStorage.setItem('zsaMap', id);
                this.renderSelectors();
            };
            mapRow.appendChild(btn);
        });
        mapDesc.innerText = this.mapCfg.desc;

        const diffRow = document.getElementById('difficultySelector');
        const diffDesc = document.getElementById('difficultyDesc');
        diffRow.innerHTML = '';
        Object.entries(DIFFICULTIES).forEach(([id, cfg]) => {
            const btn = document.createElement('button');
            btn.className = 'selector-btn' + (id === this.selectedDifficulty ? ' active' : '');
            btn.innerText = cfg.name;
            btn.onclick = () => {
                this.selectedDifficulty = id;
                this.diffCfg = cfg;
                localStorage.setItem('zsaDifficulty', id);
                this.renderSelectors();
            };
            diffRow.appendChild(btn);
        });
        diffDesc.innerText = this.diffCfg.desc;
    }

    updateStartScreen() {
        const highScore = parseInt(localStorage.getItem('zsaHighScore')) || 0;
        document.getElementById('startHighScore').innerText = highScore;
        document.getElementById('mainGoldCount').innerText = this.totalGold;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.imageSmoothingEnabled = false;
    }

    start() {
        this.startTime = Date.now();
        this.state = 'playing';
        this.player = new Player(this.metaUpgrades);
        this.zombies = [];
        this.attacks = [];
        this.xpOrbs = [];
        this.particles = [];
        this.floatingTexts = [];
        this.bloodStains = [];
        this.healthPickups = [];
        this.props = [];
        this.shrines = [];
        this.candelabras = [];
        this.kills = 0;
        this.gold = 0;
        this.spawnInterval = CONFIG.spawnIntervalInitial;
        this.spawnTimer = 0;
        this.difficultyTimer = 0;
        this.zombiesPerSpawn = 2;
        this.spawnBudget = 0;
        this.mapCfg = MAPS[this.selectedMap];
        this.diffCfg = DIFFICULTIES[this.selectedDifficulty];
        this.bossTimer = this.mapCfg.bossTimerStart;

        this.showScreen('hud');
        this.spawnInitialProps();
        // Update start screen high score
        const stored = localStorage.getItem('zsaHighScore');
        const highScore = stored ? parseInt(stored) : 0;
        document.getElementById('startHighScore').innerText = highScore;
    }

    spawnInitialProps() {
        const counts = this.mapCfg.propCounts;
        // Breakable scatter props (barrels, crates, chests, sacks, vases)
        const breakable = ['barrel', 'barrel', 'crate', 'crate', 'chest', 'sack', 'sack', 'vase'];
        for (let i = 0; i < counts.breakable; i++) {
            const x = randomRange(-3000, 3000);
            const y = randomRange(-3000, 3000);
            this.props.push(new Prop(x, y, breakable[Math.floor(Math.random() * breakable.length)]));
        }
        // Solid dungeon architecture (pillars, statues, columns)
        const solid = ['pillar', 'pillar', 'statue', 'column'];
        for (let i = 0; i < counts.solid; i++) {
            const x = randomRange(-2800, 2800);
            const y = randomRange(-2800, 2800);
            this.props.push(new Prop(x, y, solid[Math.floor(Math.random() * solid.length)]));
        }
        // Shrines — spread across the map, never too close to spawn
        for (let i = 0; i < counts.shrines; i++) {
            const angle = (i / counts.shrines) * Math.PI * 2 + randomRange(-0.3, 0.3);
            const dist = randomRange(400, 2600);
            this.shrines.push(new Shrine(Math.cos(angle) * dist, Math.sin(angle) * dist));
        }
        // Candelabras — atmospheric lighting, clustered in groups
        for (let i = 0; i < counts.candelabras; i++) {
            const x = randomRange(-2800, 2800);
            const y = randomRange(-2800, 2800);
            this.candelabras.push(new Candelabra(x, y));
        }
    }

    restart() {
        this.start();
    }

    togglePause() {
        if (this.state === 'playing') {
            this.state = 'paused';
            this.showScreen('pauseScreen');
        } else if (this.state === 'paused') {
            this.state = 'playing';
            this.showScreen('hud');
        }
    }

    gameOver() {
        this.state = 'gameOver';

        this.totalGold += this.gold;
        localStorage.setItem('zsaTotalGold', this.totalGold);

        const finalScore = this.lastScore || (this.kills * 10 + Math.floor(this.currentTime / 1000) + this.player.level * 20);
        const storedHigh = parseInt(localStorage.getItem('zsaHighScore')) || 0;
        const newHighScore = finalScore > storedHigh;
        if (newHighScore) localStorage.setItem('zsaHighScore', finalScore);
        document.getElementById('goNewHighScore').classList.toggle('visible', newHighScore);
        document.getElementById('goScore').innerText = finalScore;

        document.getElementById('goTime').innerText = this.formatTime(this.currentTime);
        document.getElementById('goKills').innerText = this.kills;
        document.getElementById('goLevel').innerText = this.player.level;
        this.showScreen('gameOverScreen');
        this.updateStartScreen();
    }

    levelUp() {
        this.state = 'levelUp';
        this.showScreen('levelUpScreen');
        this.generateUpgrades();
    }

    generateUpgrades() {
        const container = document.getElementById('upgradeCardsContainer');
        container.innerHTML = '';
        
        const possible = [
            { name: 'Whip Damage', desc: '+10 Damage', icon: '🗡️', action: (m) => this.player.whipDamage += 10 * m },
            { name: 'Whip Speed', desc: '-0.05s Cooldown', icon: '⏱️', action: (m) => this.player.whipCooldown = Math.max(0.1, this.player.whipCooldown - 0.05 * m) },
            { name: 'Whip Area', desc: '+30 Range', icon: '➰', action: (m) => this.player.whipRange += 30 * m },
            { name: 'Boots', desc: '+0.8 Speed', icon: '👢', action: (m) => this.player.speed += 0.8 * m },
            { name: 'Armor', desc: 'New Visual & +50 HP', icon: '🛡️', action: (m) => { 
                this.player.maxHp += 50 * m; 
                this.player.hp += 50 * m; 
                this.player.armorLevel++; 
            } },
            { name: 'Attractorb', desc: '+100 Magnet', icon: '🧲', action: (m) => this.player.magnetRange += 100 * m },
            { name: 'Pummarola', desc: 'Regen 2 HP/sec', icon: '❤️', action: (m) => this.player.regen += 2 * m },
            { name: 'Spinach', desc: '+15% Total Damage', icon: '🥬', action: (m) => this.player.whipDamage *= (1 + 0.15 * m) },
            { name: 'Duplicator', desc: '+1 Attack Count', icon: '💍', action: (m) => this.player.projectiles += 1 },
        ];

        const shuffled = possible.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        selected.forEach(upg => {
            // Determine rarity
            const r = Math.random();
            let rarity = { id: 'common', color: '#fff', mult: 1.0 };
            if (r < 0.1) rarity = { id: 'epic', color: '#a335ee', mult: 2.5 };
            else if (r < 0.3) rarity = { id: 'rare', color: '#3b5998', mult: 1.6 };

            const card = document.createElement('div');
            card.className = `upgrade-card ${rarity.id}`;
            card.style.borderColor = rarity.color;
            card.innerHTML = `
                <div class="upgrade-icon">${upg.icon}</div>
                <div class="upgrade-name" style="color: ${rarity.color}">${rarity.id.toUpperCase()} ${upg.name}</div>
                <div class="upgrade-desc">${upg.desc}</div>
            `;
            card.onclick = () => {
                upg.action(rarity.mult);
                this.state = 'playing';
                this.showScreen('hud');
            };
            container.appendChild(card);
        });
    }

    openShop() {
        this.showScreen('shopScreen');
        this.updateShopUI();
    }

    updateShopUI() {
        document.getElementById('shopGoldCount').innerText = this.totalGold;
        const container = document.getElementById('shopItemsContainer');
        container.innerHTML = '';

        const items = [
            { id: 'hp', name: 'Vitality', icon: '❤️', cost: 10, desc: '+10 Permanent HP' },
            { id: 'damage', name: 'Might', icon: '💪', cost: 15, desc: '+5% Permanent Damage' },
            { id: 'goldGain', name: 'Greed', icon: '💰', cost: 20, desc: '+10% Gold Gain' },
            { id: 'xpGain', name: 'Growth', icon: '🌱', cost: 20, desc: '+5% XP Gain' }
        ];

        items.forEach(item => {
            const level = this.metaUpgrades[item.id] || 0;
            const currentCost = item.cost * (level + 1);
            const card = document.createElement('div');
            card.className = 'upgrade-card';
            card.innerHTML = `
                <div class="upgrade-icon">${item.icon}</div>
                <div class="upgrade-name">${item.name} (Lv ${level})</div>
                <div class="upgrade-desc">${item.desc}</div>
                <button class="buy-btn" ${this.totalGold < currentCost ? 'disabled' : ''}>Buy: ${currentCost}🪙</button>
            `;
            card.querySelector('.buy-btn').onclick = (e) => {
                e.stopPropagation();
                if (this.totalGold >= currentCost) {
                    this.totalGold -= currentCost;
                    this.metaUpgrades[item.id]++;
                    localStorage.setItem('zsaTotalGold', this.totalGold);
                    localStorage.setItem('zsaMetaUpgrades', JSON.stringify(this.metaUpgrades));
                    this.updateShopUI();
                    this.updateStartScreen();
                }
            };
            container.appendChild(card);
        });
    }

    showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    formatTime(ms) {
        const totalSec = Math.floor(ms / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    addFloatingText(x, y, text, color) {
        this.floatingTexts.push(new FloatingText(x, y, text, color));
    }

    getNearestEnemy(pos, range) {
        let nearest = null;
        let minDist = range;
        this.zombies.forEach(z => {
            const d = Vector2.dist(pos, z.pos);
            if (d < minDist) {
                minDist = d;
                nearest = z;
            }
        });
        return nearest;
    }

    updateSpawn(dt) {
        const m = (Date.now() - this.startTime) / 60000;
        // Steeper curve: much more pressure after min 4
        const budgetPerSec = (4.0 + 0.7 * m + 0.18 * m * m) * this.diffCfg.budgetMult;
        this.spawnBudget += budgetPerSec * dt;
        this.spawnBudget = Math.min(this.spawnBudget, 80);

        const enemyCosts = {
            walker: 1.0, runner: 1.2, imp: 0.8,
            skelet: 1.8, wogol: 2.0, spitter: 2.4,
            brute: 3.6, orc_warrior: 4.5, howler: 4.8, doc: 3.2,
            tank: 6.2
        };

        // Harder enemies enter the mix earlier
        let weights;
        if      (m > 10) weights = { walker:6,  runner:10, imp:14, skelet:10, wogol:10, spitter:10, brute:12, orc_warrior:10, howler:8, doc:6, tank:8 };
        else if (m >  8) weights = { walker:10, runner:12, imp:12, skelet:12, wogol:10, spitter:12, brute:14, orc_warrior:8,  howler:6, doc:4, tank:8 };
        else if (m >  6) weights = { walker:14, runner:16, imp:12, skelet:14, wogol:10, spitter:12, brute:14, orc_warrior:6,  howler:6, doc:3 };
        else if (m >  4) weights = { walker:20, runner:18, imp:14, skelet:16, wogol:12, spitter:12, brute:10, orc_warrior:2,  doc:2 };
        else if (m >  2) weights = { walker:32, runner:24, imp:18, skelet:14, wogol:8,  spitter:10 };
        else if (m >  1) weights = { walker:50, runner:28, imp:22 };
        else             weights = { walker:70, runner:18, imp:12 };

        // Apply map-specific weight bias
        const bias = this.mapCfg.weightBias;
        if (bias) {
            const biased = {};
            for (const [k, v] of Object.entries(weights)) {
                biased[k] = v * (bias[k] != null ? bias[k] : 1);
            }
            weights = biased;
        }

        while (this.spawnBudget >= 1.0) {
            const type = this.pickWeighted(weights);
            const cost = enemyCosts[type] || 1.0;
            if (this.spawnBudget >= cost) {
                this.spawnZombie(type);
                this.spawnBudget -= cost;
            } else {
                break;
            }
        }
    }

    updateBossWave(dt) {
        this.bossTimer -= dt;
        if (this.bossTimer > 0) return;

        const m = this.currentTime / 60000;
        // Interval shrinks fast — minimum scales with the map's starting cadence
        const baseInterval = this.mapCfg.bossTimerStart + 30; // crypt:120 forest:130 hell:90
        const minInterval  = Math.max(40, this.mapCfg.bossTimerStart - 35);
        const nextInterval = Math.max(minInterval, baseInterval - m * 6);
        this.bossTimer = nextInterval;

        const bossTypes = ['boss', 'angel_boss', 'shaman_boss'];
        // Boss count ramps up faster
        const count = m > 10 ? 3 : (m > 5 ? 2 : 1);

        for (let i = 0; i < count; i++) {
            const type = bossTypes[Math.floor(Math.random() * bossTypes.length)];
            const angle = (i / count) * Math.PI * 2 + Math.random();
            const margin = 120;
            const wx = this.player.pos.x + Math.cos(angle) * (this.canvas.width / 2 + margin);
            const wy = this.player.pos.y + Math.sin(angle) * (this.canvas.height / 2 + margin);
            this.zombies.push(new Zombie(wx, wy, type));
        }

        this.addFloatingText(this.player.pos.x, this.player.pos.y - 60, '⚠ BOSS!', '#ff3333');
        this.camera.applyShake(10);
    }

    pickWeighted(weights) {
        const total = Object.values(weights).reduce((a, b) => a + b, 0);
        let roll = Math.random() * total;
        for (const [id, weight] of Object.entries(weights)) {
            roll -= weight;
            if (roll <= 0) return id;
        }
        return Object.keys(weights)[0];
    }

    spawnZombie(type = 'walker') {
        const margin = 100;
        let x, y;
        const side = Math.floor(Math.random() * 4);
        
        if (side === 0) { x = Math.random() * this.canvas.width; y = -margin; }
        else if (side === 1) { x = this.canvas.width + margin; y = Math.random() * this.canvas.height; }
        else if (side === 2) { x = Math.random() * this.canvas.width; y = this.canvas.height + margin; }
        else { x = -margin; y = Math.random() * this.canvas.height; }

        const worldX = x + this.camera.pos.x;
        const worldY = y + this.camera.pos.y;
        
        this.zombies.push(new Zombie(worldX, worldY, type));
    }

    update(dt) {
        if (this.state !== 'playing') return;

        this.currentTime = Date.now() - this.startTime;
        this.player.update(this.input, dt, this);
        this.camera.update(this.player.pos, this.canvas.width, this.canvas.height, dt);

        this.updateSpawn(dt);
        this.updateBossWave(dt);

        // Update Spatial Hash
        this.spatialHash.clear();
        this.zombies.forEach(z => this.spatialHash.insert(z));

        this.attacks.forEach(a => a.update(dt));
        this.zombies.forEach(z => z.update(this.player, dt, this));
        this.props.forEach(p => p.update(this.player, dt));
        this.shrines.forEach(s => s.update(this.player, dt, this));
        this.candelabras.forEach(c => c.update(dt));
        this.xpOrbs.forEach(o => o.update(this.player, dt));
        this.healthPickups.forEach(h => h.update(this.player, dt));
        this.particles.forEach(p => p.update(dt));
        this.floatingTexts.forEach(t => t.update(dt));

        this.bloodStains.forEach(s => s.life -= dt);
        this.bloodStains = this.bloodStains.filter(s => s.life > 0);

        // Cleanup
        this.attacks = this.attacks.filter(a => a.life > 0);
        this.zombies = this.zombies.filter(z => !z.toDelete);
        this.props = this.props.filter(p => !p.toDelete);
        this.xpOrbs = this.xpOrbs.filter(o => !o.toDelete);
        this.healthPickups = this.healthPickups.filter(h => !h.toDelete);
        this.particles = this.particles.filter(p => p.life > 0);
        this.floatingTexts = this.floatingTexts.filter(t => t.life > 0);

        this.hudAccum += dt;
        if (this.hudAccum >= 0.1) {
            this.hudAccum = 0;
            this.updateHUD();
        }
    }

    updateHUD() {
        const req = this.player.getLevelRequirement();
        const xpPct = (this.player.xp / req) * 100;
        
        document.getElementById('armorLevelText').innerText = `Armor: ${this.player.armorLevel}`;
        const runInfo = document.getElementById('runInfoDisplay');
        if (runInfo) runInfo.innerText = `${this.mapCfg.name} · ${this.diffCfg.name}`;
        document.getElementById('xpBar').style.width = Math.min(100, xpPct) + '%';
        document.getElementById('levelText').innerText = this.player.level;
        
        document.getElementById('timeDisplay').innerText = this.formatTime(this.currentTime);
        
        const timeSec = Math.floor(this.currentTime / 1000);
        const score = this.kills * 10 + timeSec + this.player.level * 20;
        this.lastScore = score;
        document.getElementById('scoreDisplay').innerText = `Score: ${score}`;
        document.getElementById('goScore').innerText = score;
        document.getElementById('killDisplay').innerText = this.kills;
        document.getElementById('goldDisplay').innerText = this.gold;
    }

    draw() {
        if (!this.player) return; // Guard against early calls
        
        this.ctx.save();
        // Clear background
        this.ctx.fillStyle = (this.mapCfg && this.mapCfg.bgColor) || "#1a1a1a";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const camX = this.camera.pos.x;
        const camY = this.camera.pos.y;

        if (this.terrainPattern) {
            this.terrainPattern.setTransform(new DOMMatrix([1, 0, 0, 1, -camX, -camY]));
            this.ctx.fillStyle = this.terrainPattern;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Floor tint overlay (map theme)
        if (this.mapCfg && this.mapCfg.floorTint) {
            this.ctx.fillStyle = this.mapCfg.floorTint;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw terrain decorations
        const deco = (this.mapCfg && this.mapCfg.decoColor) || { rock: '#555', flower: '#8a8' };
        this.decorations.forEach(d => {
            const dx = d.x - this.camera.pos.x;
            const dy = d.y - this.camera.pos.y;
            if(dx > -50 && dx < this.canvas.width + 50 && dy > -50 && dy < this.canvas.height + 50) {
                this.ctx.fillStyle = d.type === 'rock' ? deco.rock : deco.flower;
                this.ctx.fillRect(dx, dy, 8, 8);
            }
        });

        // Draw blood stains
        this.ctx.fillStyle = "rgba(139, 0, 0, 0.4)";
        this.bloodStains.forEach(s => {
            const sx = s.pos.x - camX;
            const sy = s.pos.y - camY;
            if (sx > -50 && sx < this.canvas.width + 50 && sy > -50 && sy < this.canvas.height + 50) {
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        

        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const inView = (e, m) => {
            const dx = e.pos.x - camX;
            const dy = e.pos.y - camY;
            return dx > -m && dx < cw + m && dy > -m && dy < ch + m;
        };

        for (let i = 0; i < this.xpOrbs.length; i++) { const o = this.xpOrbs[i]; if (inView(o, 40)) o.draw(this.ctx, this.camera); }
        for (let i = 0; i < this.healthPickups.length; i++) { const h = this.healthPickups[i]; if (inView(h, 40)) h.draw(this.ctx, this.camera); }
        for (let i = 0; i < this.candelabras.length; i++) { const c = this.candelabras[i]; if (inView(c, 120)) c.draw(this.ctx, this.camera); }
        for (let i = 0; i < this.shrines.length; i++) { const s = this.shrines[i]; if (inView(s, 120)) s.draw(this.ctx, this.camera); }
        for (let i = 0; i < this.props.length; i++) { const p = this.props[i]; if (inView(p, 80)) p.draw(this.ctx, this.camera); }

        this.zombies.sort((a, b) => a.pos.y - b.pos.y);
        for (let i = 0; i < this.zombies.length; i++) { const z = this.zombies[i]; if (inView(z, 200)) z.draw(this.ctx, this.camera); }

        this.player.draw(this.ctx, this.camera);
        for (let i = 0; i < this.attacks.length; i++) this.attacks[i].draw(this.ctx, this.camera);
        for (let i = 0; i < this.particles.length; i++) { const p = this.particles[i]; if (inView(p, 20)) p.draw(this.ctx, this.camera); }
        for (let i = 0; i < this.floatingTexts.length; i++) { const t = this.floatingTexts[i]; if (inView(t, 60)) t.draw(this.ctx, this.camera); }
        
        this.ctx.restore();

        if (this.loading) {
            this.ctx.fillStyle = "rgba(0,0,0,0.7)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "48px VT323";
            this.ctx.textAlign = "center";
            this.ctx.fillText("LOADING ASSETS...", this.canvas.width/2, this.canvas.height/2);
        }
    }

    loop(timestamp) {
        const dt = (timestamp - this.lastTime) / 1000;

        if (dt < this.frameMinDt) {
            requestAnimationFrame((t) => this.loop(t));
            return;
        }
        this.lastTime = timestamp;

        try {
            if (this.state === 'playing') {
                this.update(Math.min(dt, 0.05));
            }
            this.draw();
        } catch (e) {
            console.error('Game loop error:', e);
        }
        requestAnimationFrame((t) => this.loop(t));
    }
}

const gameInstance = new Game();
