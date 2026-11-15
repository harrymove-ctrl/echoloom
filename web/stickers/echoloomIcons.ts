// Custom fun-isometric slab stickers for EchoLoom
// Built on fun.ts and motions.ts presets with strict palette slot fills and 500x500 safe bounds
import { VIEWS, arc, ellipse, line, onFace, pill, poly, rect, rosette, spark } from './fun'
import { bob, clasp, erase, glint, hop, jolt, look, shackle, slide, sparkle, toss, tossLag, tossLag2, twinkle, wobble } from './motions'
import type { Icon, Layer, Motion, Shape, Vec } from './fun'

const LINE = 5
const { tilt: FACE, extrude: EXT } = VIEWS.right

const glow = (
  parent: string,
  p: Vec,
  r: number,
  m: Motion | ReadonlyArray<Motion>,
  extra: { ip?: number; op?: number } = {},
): Layer => ({
  parent,
  a: p,
  p,
  m,
  ...extra,
  shapes: [{ d: spark(p[0], p[1], r), fill: 'white' }],
})

// 1. Local SQLite FTS5 Vault Cassette (hop root + lagging index cards + upright peak sparkles)
export const loomVault: Icon = {
  name: 'loomVault',
  frames: 180,
  still: 90,
  line: LINE,
  extrude: EXT,
  layers: [
    { id: 'vaultRoot', p: [252, 278], m: hop, shapes: [] },
    {
      id: 'vaultTilt',
      parent: 'vaultRoot',
      tilt: FACE,
      shapes: [
        {
          d: poly(
            [
              [-118, -90],
              [-48, -90],
              [-28, -68],
              [118, -68],
              [118, 86],
              [-118, 86],
            ],
            [16, 8, 8, 16, 16, 16],
          ),
          fill: 'deep',
          depth: 1,
        },
      ],
    },
    {
      parent: 'vaultTilt',
      a: [-96, 46],
      p: [-96, 46],
      m: tossLag2,
      shapes: [
        { d: rect(-94, -120, 186, 168, 12), fill: 'white', depth: 0.3 },
        { d: line([-70, -98], [26, -98]) },
        { d: line([-70, -76], [-4, -76]) },
      ],
    },
    {
      parent: 'vaultTilt',
      a: [-102, 48],
      p: [-102, 48],
      m: tossLag,
      shapes: [{ d: rect(-104, -92, 204, 146, 12), fill: 'ok', depth: 0.35 }],
    },
    {
      parent: 'vaultTilt',
      shapes: [
        { d: rect(-118, -36, 236, 122, 18), fill: 'main', depth: 1 },
        { d: pill(-64, 8, 108, 28), fill: 'white', depth: 0.3 },
        { d: ellipse(76, 22, 16), fill: 'gold', depth: 0.3 },
      ],
    },
    glow('vaultRoot', [126, -112], 24, twinkle(0, true), { op: 30 }),
    glow('vaultRoot', [126, -112], 24, twinkle(54), { ip: 54 }),
    glow('vaultRoot', [-142, 18], 16, twinkle(6, true), { op: 36 }),
    glow('vaultRoot', [-142, 18], 16, twinkle(62), { ip: 62 }),
  ],
}

// 2. Community Signal Radar Board (jolt root + sliding channel pill + verified rosette)
const RADAR_BADGE = onFace(FACE, [90, 74])

export const signalRadar: Icon = {
  name: 'signalRadar',
  frames: 180,
  still: 85,
  line: LINE,
  extrude: EXT,
  layers: [
    { id: 'radar', p: [248, 268], m: jolt([-7, 11]), shapes: [] },
    {
      id: 'board',
      parent: 'radar',
      tilt: FACE,
      shapes: [
        { d: rect(-112, -96, 224, 192, 24), fill: 'white', depth: 1 },
        { d: poly([[-112, -96], [112, -96], [112, -40], [-112, -40]], [24, 24, 0, 0]), fill: 'deep' },
        { d: rect(-88, -22, 176, 38, 10), fill: 'tint' },
        { d: rect(-88, 28, 176, 38, 10), fill: 'tint' },
        { d: pill(-74, -8, 102, 12), fill: 'ink', line: false },
        { d: pill(-74, 42, 76, 12), fill: 'ink', line: false },
      ],
    },
    {
      parent: 'board',
      m: slide([0, -24], 18, 66, 44),
      shapes: [
        { d: rect(-88, -80, 176, 42, 12), fill: 'main', depth: 0.45 },
        { d: pill(-68, -65, 84, 12), fill: 'white', line: false },
      ],
    },
    {
      parent: 'radar',
      a: RADAR_BADGE,
      p: RADAR_BADGE,
      m: [twinkle(16), twinkle(102, true)],
      shapes: [
        { d: rosette(RADAR_BADGE[0], RADAR_BADGE[1], 32, 8, 0.62), fill: 'ok', depth: 0.65 },
        { d: line([RADAR_BADGE[0] - 14, RADAR_BADGE[1]], [RADAR_BADGE[0] - 4, RADAR_BADGE[1] + 10], [RADAR_BADGE[0] + 16, RADAR_BADGE[1] - 11]), line: 6 },
      ],
    },
    glow('radar', [114, -108], 22, glint(8, 96)),
    glow('radar', [-122, -62], 16, glint(40, 88)),
  ],
}

// 3. Kiro Spec Pad (/.kiro/specs pad with trimmed lines and gold badge)
const PAD_STAMP = onFace(FACE, [78, 86])

export const kiroSpecPad: Icon = {
  name: 'kiroSpecPad',
  frames: 180,
  still: 0,
  line: LINE,
  extrude: EXT,
  layers: [
    { id: 'specRoot', p: [250, 266], m: { ...swaySpec() }, shapes: [] },
    {
      parent: 'specRoot',
      tilt: FACE,
      shapes: [
        { d: rect(-108, -118, 216, 238, 24), fill: 'deep', depth: 1 },
        { d: rect(-88, -94, 176, 192, 12), fill: 'white', depth: 0.25 },
        { d: pill(-44, -134, 88, 34), fill: 'grey', depth: 0.55 },
        { d: pill(-18, -122, 36, 10), fill: 'ink', line: false },
        ...[0, 1, 2, 3].map(
          (i): Shape => ({
            d: line([-62, -56 + i * 36], [i === 3 ? 14 : 62, -56 + i * 36]),
            trim: erase(22 - i * 4, 88 + i * 4),
          }),
        ),
      ],
    },
    {
      parent: 'specRoot',
      a: PAD_STAMP,
      p: PAD_STAMP,
      m: [twinkle(18), twinkle(106, true)],
      shapes: [
        { d: ellipse(PAD_STAMP[0], PAD_STAMP[1], 32), fill: 'gold', depth: 0.6 },
        { d: spark(PAD_STAMP[0], PAD_STAMP[1], 14, 0.32), fill: 'white', line: 3 },
      ],
    },
    glow('specRoot', [-134, -108], 20, twinkle(0, true), { op: 30 }),
    glow('specRoot', [-134, -108], 20, twinkle(68), { ip: 68 }),
  ],
}

function swaySpec(): Motion {
  return {
    r: [
      [0, 0, [0.57, 0, 0.35, 1]],
      [24, -8, [0.88, 0, 0.75, 1]],
      [48, 7, [0.09, 0, 0, 1]],
      [92, 0],
    ],
    p: [
      [0, [0, 0], [0.57, 0, 0.35, 1]],
      [24, [-4, -10], [0.88, 0, 0.75, 1]],
      [48, [3, 8], [0.09, 0, 0, 1]],
      [92, [0, 0]],
    ],
  }
}

// 4. ConfirmLive & @me Quarantine Lock (130-frame clasp + shackle mechanism)
const LOCK_SHACKLE = 'M-68 -36L-68 -108A68 68 0 0 1 68 -108L68 -36L38 -36L38 -108A38 38 0 0 0 -38 -108L-38 -36Z'
const LOCK_KEYHOLE = ellipse(0, -2, 15) + poly([[-7, 7], [7, 7], [11, 36], [-11, 36]], 3)

export const safetyLock: Icon = {
  name: 'safetyLock',
  frames: 130,
  still: 95,
  line: LINE,
  extrude: EXT,
  layers: [
    { id: 'lockRoot', p: [254, 294], m: clasp, shapes: [] },
    {
      parent: 'lockBody',
      a: [-53, -54],
      p: [-53, -54],
      m: shackle,
      shapes: [{ d: LOCK_SHACKLE, fill: 'grey', depth: 0.7 }],
    },
    {
      id: 'lockBody',
      parent: 'lockRoot',
      tilt: FACE,
      shapes: [
        { d: rect(-104, -72, 208, 160, 24), fill: 'ok', depth: 1 },
        { d: pill(-42, -56, 84, 16), fill: 'gold', depth: 0.35 },
        { d: ellipse(0, 14, 34, 44), fill: 'white', depth: 0.28 },
        { d: LOCK_KEYHOLE, fill: 'ink', line: false },
      ],
    },
    glow('lockRoot', [-126, -64], 24, twinkle(0, true), { op: 30 }),
    glow('lockRoot', [-126, -64], 24, twinkle(75), { ip: 75 }),
    glow('lockRoot', [118, -86], 18, twinkle(10, true), { op: 36 }),
    glow('lockRoot', [118, -86], 18, twinkle(82), { ip: 82 }),
  ],
}

// 5. VoiceGate Anti-Slop Mixer Slab (bobbing board + 3 staggered fader caps + ok pip)
export const voiceTuner: Icon = {
  name: 'voiceTuner',
  frames: 180,
  still: 90,
  line: LINE,
  extrude: EXT,
  layers: [
    { id: 'tuner', p: [250, 266], m: { ...bob, loop: 180 }, shapes: [] },
    {
      id: 'mixerDeck',
      parent: 'tuner',
      tilt: FACE,
      shapes: [
        { d: rect(-118, -88, 236, 176, 26), fill: 'white', depth: 1 },
        { d: rect(-96, -66, 192, 132, 14), fill: 'tint' },
        { d: pill(-74, -40, 148, 16), fill: 'grey' },
        { d: pill(-74, 0, 148, 16), fill: 'grey' },
        { d: pill(-74, 40, 148, 16), fill: 'grey' },
      ],
    },
    {
      parent: 'mixerDeck',
      m: slide([92, 0], 14, 52, 46),
      shapes: [{ d: ellipse(-46, -32, 22), fill: 'main', depth: 0.65 }],
    },
    {
      parent: 'mixerDeck',
      m: slide([-82, 0], 26, 52, 46),
      shapes: [{ d: ellipse(42, 8, 22), fill: 'ok', depth: 0.65 }],
    },
    {
      parent: 'mixerDeck',
      m: slide([72, 0], 38, 52, 46),
      shapes: [{ d: ellipse(-36, 48, 22), fill: 'gold', depth: 0.65 }],
    },
    glow('tuner', [124, -104], 24, sparkle(20)),
    glow('tuner', [-124, 82], 16, sparkle(94)),
  ],
}

// 6. Kiro Crew 4-Agent Console (wobble housing + masked eyes with look pupils + antenna)
const CREW_CHASSIS = rect(-110, -82, 220, 158, 28)
const CREW_TILT: Vec = [-16, 30]
const CREW_PIVOT = onFace(CREW_TILT, [0, 76])

export const crewBot: Icon = {
  name: 'crewBot',
  frames: 180,
  still: 90,
  line: LINE,
  extrude: EXT,
  layers: [
    { id: 'crewRoot', a: CREW_PIVOT, p: [250 + CREW_PIVOT[0], 224 + CREW_PIVOT[1]], m: wobble, shapes: [] },
    {
      id: 'crewFace',
      parent: 'crewRoot',
      tilt: CREW_TILT,
      shapes: [
        { d: pill(-8, -134, 16, 54), fill: 'grey', depth: 0.5 },
        { d: ellipse(0, -138, 18), fill: 'gold', depth: 0.6 },
        { d: CREW_CHASSIS, fill: 'main', depth: 1 },
        { d: rect(-88, -58, 176, 98, 20), fill: 'tint' },
        { d: arc(0, 6, 24, 25, 155) },
        { d: ellipse(-54, 56, 9), fill: 'ok', depth: 0.25 },
        { d: ellipse(-18, 56, 9), fill: 'gold', depth: 0.25 },
        { d: ellipse(18, 56, 9), fill: 'hot', depth: 0.25 },
        { d: ellipse(54, 56, 9), fill: 'white', depth: 0.25 },
      ],
    },
    { id: 'crewEyeL', parent: 'crewFace', shapes: [{ d: ellipse(-40, -16, 22, 26), fill: 'white' }] },
    { id: 'crewEyeR', parent: 'crewFace', shapes: [{ d: ellipse(40, -16, 22, 26), fill: 'white' }] },
    { parent: 'crewFace', clip: 'crewEyeL', m: { ...look, k: 1.4 }, shapes: [{ d: ellipse(-35, -11, 13), fill: 'ink', line: false }] },
    { parent: 'crewFace', clip: 'crewEyeR', m: { ...look, k: 1.4 }, shapes: [{ d: ellipse(45, -11, 13), fill: 'ink', line: false }] },
    glow('crewRoot', [132, -104], 22, sparkle(18)),
    glow('crewRoot', [-136, -54], 16, sparkle(92)),
  ],
}

export const ECHOLOOM_ICONS: ReadonlyArray<Icon> = [
  loomVault,
  signalRadar,
  kiroSpecPad,
  safetyLock,
  voiceTuner,
  crewBot,
]
