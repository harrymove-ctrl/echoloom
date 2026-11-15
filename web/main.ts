import {
  PALETTES,
  brand,
  clock,
  paint,
  play,
  type Icon,
  type Palette,
} from "./stickers/fun";
import {
  crewBot,
  kiroSpecPad,
  loomVault,
  safetyLock,
  signalRadar,
  voiceTuner,
} from "./stickers/echoloomIcons";
import {
  INVARIANTS,
  MODALITIES,
  PALETTE_LABELS,
  SIGNAL_CLUSTERS,
  STICKER_SHOWCASE,
  STRESS_FIXTURE,
  type ArenaVariant,
  type ModalityId,
  type PaletteChoiceId,
  type SignalCluster,
  type StickerId,
} from "./data/studioData";

const ICON_BY_ID: Record<StickerId, Icon> = {
  loomVault,
  signalRadar,
  kiroSpecPad,
  safetyLock,
  voiceTuner,
  crewBot,
};

type FilterState = "idle" | "filtered" | "empty";
type ApprovalState = "dryRun" | "blockedEmptyApprover" | "approvedLive";

interface MountedSticker {
  canvas: HTMLCanvasElement;
  icon: Icon;
  player: ReturnType<typeof play>;
}

interface AppState {
  paletteId: PaletteChoiceId;
  speed: number;
  paused: boolean;
  modalityId: ModalityId;
  arena: ArenaVariant;
  searchQuery: string;
  filterState: FilterState;
  activeClusterId: string;
  approvalState: ApprovalState;
  approverHandle: string;
  stressMode: boolean;
  debugOpen: boolean;
  fuzzVerified: boolean;
  confirmLockUntil: number;
}

const state: AppState = {
  paletteId: "riso",
  speed: 1,
  paused: false,
  modalityId: "discord",
  arena: "split",
  searchQuery: "",
  filterState: "idle",
  activeClusterId: "handoff",
  approvalState: "dryRun",
  approverHandle: "",
  stressMode: false,
  debugOpen: false,
  fuzzVerified: false,
  confirmLockUntil: 0,
};

const mountedStickers: MountedSticker[] = [];
const copyCounts = new Map<HTMLElement, number>();
const copyTimers = new Map<HTMLElement, number>();
let currentPalette: Palette = resolvePalette("riso");
let fuzzAnimFrame = 0;

function resolvePalette(id: PaletteChoiceId): Palette {
  if (id === "cobalt") {
    return brand("#3565f5", "#0f172a");
  }
  return PALETTES[id];
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) {
    node.className = className;
  }
  if (text !== undefined) {
    node.textContent = text;
  }
  return node;
}

function byId<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

function formatMiddleTruncate(value: string, head = 8, tail = 4): string {
  if (value.length <= head + tail + 3) {
    return value;
  }
  return `${value.slice(0, head)}\u2026${value.slice(-tail)}`;
}

function getAllClusters(): SignalCluster[] {
  return state.stressMode ? [STRESS_FIXTURE, ...SIGNAL_CLUSTERS] : SIGNAL_CLUSTERS;
}

function getFilteredClusters(): SignalCluster[] {
  const pool = getAllClusters();
  const q = state.searchQuery.trim().toLowerCase();
  if (!q) {
    state.filterState = "idle";
    return pool;
  }
  const matches = pool.filter((item) => {
    const haystack = [
      item.title,
      item.badge,
      item.channelMeta,
      item.authorHandle,
      item.specPath,
      item.questionBody,
      item.invariantTag,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
  state.filterState = matches.length === 0 ? "empty" : "filtered";
  return matches;
}

function getActiveCluster(): SignalCluster {
  const all = getAllClusters();
  const found = all.find((item) => item.id === state.activeClusterId);
  return found ?? all[0];
}

function mountCanvasSticker(
  canvas: HTMLCanvasElement,
  icon: Icon,
  offset = 0
): MountedSticker {
  const existing = mountedStickers.find((entry) => entry.canvas === canvas);
  if (existing) {
    return existing;
  }
  const player = play(canvas, icon, {
    palette: currentPalette,
    loop: true,
    offset,
  });
  if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
    paint(canvas, icon, icon.still ?? 0, 1, currentPalette);
  }
  const handle: MountedSticker = { canvas, icon, player };
  mountedStickers.push(handle);
  return handle;
}

function mountExistingStickers(): void {
  const canvases = document.querySelectorAll<HTMLCanvasElement>("canvas[data-sticker]");
  canvases.forEach((canvas, index) => {
    const key = canvas.dataset.sticker as StickerId | undefined;
    if (!key) return;
    const icon = ICON_BY_ID[key];
    if (!icon) return;
    mountCanvasSticker(canvas, icon, (index * 3) % 18);
  });
}

function syncAllStickersPalette(palette: Palette): void {
  currentPalette = palette;
  for (const entry of mountedStickers) {
    entry.player.set({ palette });
    if (entry.canvas.clientWidth > 0 && entry.canvas.clientHeight > 0) {
      paint(entry.canvas, entry.icon, entry.icon.still ?? 0, 1, palette);
    }
  }
}

function replayAllStickers(): void {
  for (const entry of mountedStickers) {
    entry.player.replay();
  }
}

async function copyTextWithSpring(
  button: HTMLElement,
  textToCopy: string
): Promise<void> {
  if (!textToCopy.trim()) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    }
  } catch {
    const area = document.createElement("textarea");
    area.value = textToCopy;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch {
      // Clipboard blocked in strict contexts, visual feedback still confirms user intent.
    }
    area.remove();
  }

  const hits = (copyCounts.get(button) ?? 0) + 1;
  copyCounts.set(button, hits);
  button.dataset.done = hits % 2 === 1 ? "a" : "b";

  const prevTimer = copyTimers.get(button);
  if (prevTimer !== undefined) {
    window.clearTimeout(prevTimer);
  }
  const timer = window.setTimeout(() => {
    delete button.dataset.done;
    copyTimers.delete(button);
  }, 1800);
  copyTimers.set(button, timer);
}

function bindCopyButtons(): void {
  const buttons = document.querySelectorAll<HTMLElement>("[data-copy-target]");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.copyTarget;
      if (!targetId) return;
      const source = byId<HTMLElement>(targetId);
      if (!source) return;
      void copyTextWithSpring(button, source.textContent ?? "");
    });
  });

  const digestPill = byId<HTMLButtonElement>("digestPill");
  digestPill?.addEventListener("click", () => {
    const cluster = getActiveCluster();
    void copyTextWithSpring(digestPill, cluster.digestHash);
    digestPill.title = `Copied full hash: ${cluster.digestHash}`;
  });
}

function renderPaletteControls(): void {
  const container = byId<HTMLElement>("paletteButtons");
  if (!container) return;
  container.replaceChildren();

  for (const item of PALETTE_LABELS) {
    const btn = el(
      "button",
      `palette-btn${state.paletteId === item.id ? " is-active" : ""}`
    );
    btn.type = "button";
    btn.dataset.paletteId = item.id;
    btn.setAttribute("aria-pressed", state.paletteId === item.id ? "true" : "false");

    const dots = el("span", "swatch-dots");
    const dotA = el("span", "swatch-dot");
    dotA.style.background = item.dotA;
    const dotB = el("span", "swatch-dot");
    dotB.style.background = item.dotB;
    dots.append(dotA, dotB);

    const label = el("span", undefined, item.label);
    btn.append(dots, label);

    btn.addEventListener("click", () => {
      state.paletteId = item.id;
      syncAllStickersPalette(resolvePalette(item.id));
      renderPaletteControls();
      renderDebugHud();
    });

    container.appendChild(btn);
  }
}

function renderStickerShowcase(): void {
  const grid = byId<HTMLElement>("stickerShowcaseGrid");
  if (!grid) return;
  grid.replaceChildren();

  STICKER_SHOWCASE.forEach((item, index) => {
    const card = el("button", "sticker-tile");
    card.type = "button";
    card.setAttribute("aria-label", `Replay ${item.title} isometric sticker`);

    const stageBox = el("div", "sticker-stage-box");
    const canvas = el("canvas", "sticker-canvas");
    canvas.dataset.sticker = item.id;
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", item.title);
    stageBox.appendChild(canvas);

    const heading = el("h3", undefined, item.title);
    const metaRow = el("div", "sticker-meta-row");
    const motion = el("span", "motion-tag", item.motionLabel);
    const modulePath = el("code", "module-path-tag", item.modulePath);
    metaRow.append(motion, modulePath);
    const desc = el("p", undefined, item.role);

    card.append(stageBox, heading, metaRow, desc);
    grid.appendChild(card);

    const icon = ICON_BY_ID[item.id];
    const mounted = mountCanvasSticker(canvas, icon, index * 3);
    card.addEventListener("click", () => {
      mounted.player.replay();
    });
  });
}

function renderModalities(): void {
  const pillsWrap = byId<HTMLElement>("modalityPills");
  const noteEl = byId<HTMLElement>("modalityNote");
  if (!pillsWrap || !noteEl) return;

  pillsWrap.replaceChildren();
  let activeModality = MODALITIES[0];

  for (const mod of MODALITIES) {
    const isActive = mod.id === state.modalityId;
    if (isActive) {
      activeModality = mod;
    }
    const btn = el(
      "button",
      `modality-pill${isActive ? " is-active" : ""}`,
      mod.label
    );
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", isActive ? "true" : "false");
    btn.dataset.modality = mod.id;

    btn.addEventListener("click", () => {
      state.modalityId = mod.id;
      if (!state.stressMode) {
        state.activeClusterId = mod.defaultCluster;
        state.approvalState = "dryRun";
      }
      renderModalities();
      renderWorkbench();
      renderDebugHud();
    });

    pillsWrap.appendChild(btn);
  }

  noteEl.textContent = activeModality.summary;
}

function renderArenaButtons(): void {
  const studio = byId<HTMLElement>("studioScreen");
  if (studio) {
    studio.dataset.variant = state.arena;
  }
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    "#arenaButtons button[data-arena]"
  );
  buttons.forEach((btn) => {
    const variant = btn.dataset.arena as ArenaVariant | undefined;
    const active = variant === state.arena;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function buildTerminalEnvelope(cluster: SignalCluster): string {
  const isApproved = state.approvalState === "approvedLive";
  const payload = {
    tool: "echoloom_dispatch_reply",
    command: cluster.cliCommand,
    specPath: cluster.specPath,
    digest: cluster.digestHash,
    dmPolicy: "QUARANTINED (@me = 0 rows)",
    voiceScore: cluster.voiceScore,
    overlapWords: cluster.overlapWords,
    live: isApproved,
    confirmLive: isApproved,
    approvedBy: isApproved ? state.approverHandle.trim() : null,
    status: isApproved ? "DISPATCH_PERMITTED" : "DRY_RUN_READY",
  };
  return JSON.stringify(payload, null, 2);
}

function renderGovernorStatus(cluster: SignalCluster): void {
  const feedback = byId<HTMLElement>("governorFeedback");
  const terminal = byId<HTMLElement>("terminalPreview");
  const input = byId<HTMLInputElement>("approverInput");

  if (terminal) {
    terminal.textContent = buildTerminalEnvelope(cluster);
  }
  if (!feedback) return;

  feedback.classList.remove("is-live", "is-error");

  if (state.approvalState === "blockedEmptyApprover") {
    feedback.classList.add("is-error");
    feedback.textContent =
      "Blocked: enter an approver handle (for example @harrymove-ctrl) before switching confirmLive to true.";
    input?.setAttribute("aria-invalid", "true");
    return;
  }

  input?.removeAttribute("aria-invalid");

  if (state.approvalState === "approvedLive") {
    feedback.classList.add("is-live");
    feedback.textContent = `Live transport unlocked by ${state.approverHandle.trim()} with confirmLive: true (${cluster.voiceScore}).`;
    return;
  }

  feedback.textContent =
    "Dry Run locked: outbound send requires confirmLive: true and a non empty approver handle.";
}

function renderWorkbench(): void {
  const threadList = byId<HTMLElement>("threadList");
  const threadEmpty = byId<HTMLElement>("threadEmpty");
  const matches = getFilteredClusters();

  if (threadList) {
    threadList.replaceChildren();
    for (const item of matches) {
      const btn = el(
        "button",
        `thread-item${item.id === state.activeClusterId ? " is-selected" : ""}`
      );
      btn.type = "button";
      btn.setAttribute("role", "option");
      btn.setAttribute(
        "aria-selected",
        item.id === state.activeClusterId ? "true" : "false"
      );
      btn.dataset.clusterId = item.id;

      const topRow = el("div", "thread-item-top");
      topRow.append(
        el("span", "thread-badge", item.badge),
        el("span", "thread-time", item.timestamp)
      );
      const titleEl = el("div", "thread-title", item.title);
      btn.append(topRow, titleEl);

      btn.addEventListener("click", () => {
        state.activeClusterId = item.id;
        state.approvalState = "dryRun";
        renderWorkbench();
        renderDebugHud();
      });

      threadList.appendChild(btn);
    }
  }

  if (threadEmpty) {
    threadEmpty.hidden = matches.length > 0;
  }

  if (matches.length > 0 && !matches.some((m) => m.id === state.activeClusterId)) {
    state.activeClusterId = matches[0].id;
  }

  const active = getActiveCluster();

  const setField = (id: string, text: string, title?: string): void => {
    const node = byId<HTMLElement>(id);
    if (!node) return;
    node.textContent = text;
    if (title !== undefined) {
      node.title = title;
    }
  };

  setField("latencyChip", `Local query ${active.latencyMs}ms`);
  setField("dmIsolateChip", "@me DM isolation: 0 rows");
  setField(
    "digestPill",
    `Hash ${formatMiddleTruncate(active.digestHash)}`,
    `Full commit digest: ${active.digestHash} (click to copy)`
  );
  setField("activeBadge", active.badge);
  setField("activeTitle", active.title);
  setField("activeTier", active.sourceTier);
  setField("activeAuthor", active.authorHandle);
  setField("activeMeta", `${active.channelMeta} \u00b7 ${active.timestamp}`);
  setField("activeQuestionBody", active.questionBody);
  setField("activeSpecPath", active.specPath, active.specPath);
  setField("activeInvariant", active.invariantTag);
  setField("activeSpecSummary", active.specSummary);
  setField("voiceChip", `VoiceGate ${active.voiceScore}`);
  setField(
    "voiceOverlapLabel",
    `Max overlap: ${active.overlapWords} words \u00b7 0 dashes`
  );
  setField("draftBody", active.draftReply);

  const reqList = byId<HTMLOListElement>("activeReqList");
  if (reqList) {
    reqList.replaceChildren();
    for (const req of active.requirements) {
      reqList.appendChild(el("li", undefined, req));
    }
  }

  renderGovernorStatus(active);
}

function renderInvariantCards(progressRatio = 1): void {
  const wrap = byId<HTMLElement>("invariantCards");
  if (!wrap) return;
  wrap.replaceChildren();

  for (const inv of INVARIANTS) {
    const card = el("article", "inv-card");
    const top = el("div", "inv-card-top");
    const countVal = Math.round(inv.iterations * progressRatio);
    const countLabel = state.fuzzVerified
      ? "1,000x PASS"
      : `${countVal.toLocaleString("en-US")} / 1,000`;
    top.append(
      el("span", "inv-id", inv.id),
      el("span", "inv-count", countLabel)
    );

    const title = el("h3", undefined, inv.title);
    const contract = el("p", undefined, inv.contract);
    const sample = el("code", "inv-sample", inv.blockedSample);

    card.append(top, title, contract, sample);
    wrap.appendChild(card);
  }
}

function triggerFuzzRun(): void {
  if (fuzzAnimFrame) {
    window.cancelAnimationFrame(fuzzAnimFrame);
  }
  const btn = byId<HTMLButtonElement>("runFuzzBtn");
  const start = performance.now();
  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : 420;

  state.fuzzVerified = false;

  const step = (now: number): void => {
    const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
    if (t >= 1) {
      state.fuzzVerified = true;
      renderInvariantCards(1);
      if (btn) {
        btn.textContent = "5,000 / 5,000 Checks Passed \u00b7 Replay";
      }
      renderDebugHud();
      fuzzAnimFrame = 0;
      return;
    }
    renderInvariantCards(t);
    fuzzAnimFrame = window.requestAnimationFrame(step);
  };

  fuzzAnimFrame = window.requestAnimationFrame(step);
}

function updateHitboxAnnotations(): void {
  const targets = document.querySelectorAll<HTMLElement>(
    "button, .nav-cta, .spec-btn"
  );
  targets.forEach((node) => {
    if (!state.debugOpen) {
      node.removeAttribute("data-hitbox");
      return;
    }
    const rect = node.getBoundingClientRect();
    node.setAttribute(
      "data-hitbox",
      `${Math.round(rect.width)}x${Math.round(rect.height)}`
    );
  });
}

function renderDebugHud(): void {
  const hud = byId<HTMLElement>("debugHud");
  const metrics = byId<HTMLElement>("debugMetrics");
  const stressBtn = byId<HTMLButtonElement>("stressLongBtn");

  document.documentElement.dataset.debugUi = state.debugOpen ? "true" : "false";
  if (hud) {
    hud.hidden = !state.debugOpen;
  }
  if (stressBtn) {
    stressBtn.setAttribute("aria-pressed", state.stressMode ? "true" : "false");
  }

  updateHitboxAnnotations();

  if (!metrics || !state.debugOpen) return;
  metrics.replaceChildren();

  const visibleCanvases = mountedStickers.filter(
    (item) => item.canvas.offsetParent !== null
  ).length;
  const overflowPx = Math.max(
    0,
    Math.round(
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    )
  );

  const rows: Array<[string, string]> = [
    ["arena", state.arena],
    ["modality", state.modalityId],
    ["filterState", state.filterState],
    ["approvalState", state.approvalState],
    ["stressMode", String(state.stressMode)],
    ["palette", state.paletteId],
    ["visibleCanvases", String(visibleCanvases)],
    ["overflowPx", `${overflowPx}px`],
  ];

  for (const [k, v] of rows) {
    const row = el("div");
    row.textContent = `${k}: ${v}`;
    metrics.appendChild(row);
  }
}

function bindControls(): void {
  const mobileMenuBtn = byId<HTMLButtonElement>("mobileMenuBtn");
  const mobileDrawer = byId<HTMLElement>("mobileDrawer");
  mobileMenuBtn?.addEventListener("click", () => {
    if (!mobileDrawer) return;
    const isHidden = mobileDrawer.hidden;
    mobileDrawer.hidden = !isHidden;
    mobileMenuBtn.setAttribute("aria-expanded", isHidden ? "true" : "false");
  });

  mobileDrawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileDrawer.hidden = true;
      mobileMenuBtn?.setAttribute("aria-expanded", "false");
    });
  });

  const heroBtn = byId<HTMLButtonElement>("heroStickerBtn");
  heroBtn?.addEventListener("click", () => {
    const heroCanvas = heroBtn.querySelector<HTMLCanvasElement>(
      "canvas[data-sticker]"
    );
    const match = mountedStickers.find((m) => m.canvas === heroCanvas);
    match?.player.replay();
  });

  document
    .querySelectorAll<HTMLButtonElement>("#speedButtons button[data-speed]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextSpeed = Number(btn.dataset.speed ?? "1");
        if (!Number.isFinite(nextSpeed) || nextSpeed <= 0) return;
        state.speed = nextSpeed;
        clock.speed = nextSpeed;
        document
          .querySelectorAll<HTMLButtonElement>("#speedButtons button[data-speed]")
          .forEach((b) => {
            const active = b === btn;
            b.classList.toggle("is-active", active);
            b.setAttribute("aria-pressed", active ? "true" : "false");
          });
      });
    });

  const pauseBtn = byId<HTMLButtonElement>("pauseClockBtn");
  pauseBtn?.addEventListener("click", () => {
    state.paused = !state.paused;
    clock.paused = state.paused;
    pauseBtn.setAttribute("aria-pressed", state.paused ? "true" : "false");
    pauseBtn.textContent = state.paused ? "Resume Clock" : "Pause Clock";
  });

  byId<HTMLButtonElement>("replayAllBtn")?.addEventListener("click", () => {
    replayAllStickers();
  });

  document
    .querySelectorAll<HTMLButtonElement>("#arenaButtons button[data-arena]")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextArena = btn.dataset.arena as ArenaVariant | undefined;
        if (!nextArena) return;
        state.arena = nextArena;
        renderArenaButtons();
        renderDebugHud();
      });
    });

  const searchInput = byId<HTMLInputElement>("threadSearch");
  searchInput?.addEventListener("input", () => {
    state.searchQuery = searchInput.value;
    renderWorkbench();
    renderDebugHud();
  });

  byId<HTMLButtonElement>("clearFilterBtn")?.addEventListener("click", () => {
    state.searchQuery = "";
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    renderWorkbench();
    renderDebugHud();
  });

  const approverInput = byId<HTMLInputElement>("approverInput");
  approverInput?.addEventListener("input", () => {
    state.approverHandle = approverInput.value;
    if (state.approvalState === "blockedEmptyApprover" && approverInput.value.trim()) {
      state.approvalState = "dryRun";
      renderGovernorStatus(getActiveCluster());
      renderDebugHud();
    }
  });

  byId<HTMLButtonElement>("quickFillApproverBtn")?.addEventListener(
    "click",
    () => {
      const handle = "@harrymove-ctrl";
      state.approverHandle = handle;
      if (approverInput) {
        approverInput.value = handle;
      }
      if (state.approvalState === "blockedEmptyApprover") {
        state.approvalState = "dryRun";
      }
      renderGovernorStatus(getActiveCluster());
      renderDebugHud();
    }
  );

  byId<HTMLButtonElement>("approveLiveBtn")?.addEventListener("click", () => {
    const now = performance.now();
    if (now < state.confirmLockUntil) {
      return;
    }
    state.confirmLockUntil = now + 250;

    const currentVal = (approverInput?.value ?? state.approverHandle).trim();
    state.approverHandle = currentVal;

    if (!currentVal) {
      state.approvalState = "blockedEmptyApprover";
      approverInput?.focus();
    } else {
      state.approvalState = "approvedLive";
    }

    renderGovernorStatus(getActiveCluster());
    renderDebugHud();
  });

  byId<HTMLButtonElement>("resetDryBtn")?.addEventListener("click", () => {
    state.approvalState = "dryRun";
    renderGovernorStatus(getActiveCluster());
    renderDebugHud();
  });

  byId<HTMLButtonElement>("runFuzzBtn")?.addEventListener("click", () => {
    triggerFuzzRun();
  });

  byId<HTMLButtonElement>("footerDebugToggle")?.addEventListener("click", () => {
    state.debugOpen = !state.debugOpen;
    renderDebugHud();
  });

  byId<HTMLButtonElement>("debugCloseBtn")?.addEventListener("click", () => {
    state.debugOpen = false;
    renderDebugHud();
  });

  byId<HTMLButtonElement>("stressLongBtn")?.addEventListener("click", () => {
    state.stressMode = !state.stressMode;
    state.activeClusterId = state.stressMode ? STRESS_FIXTURE.id : "handoff";
    state.approvalState = "dryRun";
    renderWorkbench();
    renderDebugHud();
  });

  window.addEventListener("resize", () => {
    for (const entry of mountedStickers) {
      if (entry.canvas.clientWidth > 0 && entry.canvas.clientHeight > 0) {
        paint(entry.canvas, entry.icon, entry.icon.still ?? 0, 1, currentPalette);
      }
    }
    if (state.debugOpen) {
      renderDebugHud();
    }
  });
}

function bootstrap(): void {
  const params = new URLSearchParams(window.location.search);
  state.debugOpen = params.get("debug") === "1";

  mountExistingStickers();
  renderPaletteControls();
  renderStickerShowcase();
  renderModalities();
  renderArenaButtons();
  renderWorkbench();
  renderInvariantCards(1);
  bindCopyButtons();
  bindControls();
  renderDebugHud();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}
