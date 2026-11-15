(function initEchoLoomLanding() {
  const SCENARIOS = {
    handoff: {
      latency: "6.4 ms",
      cli: JSON.stringify(
        {
          ok: true,
          schema_version: "1",
          data: {
            command: "echoloom signals --cluster session-handoff --json",
            queryLatencyMs: 6.4,
            sourceTier: "desktop_wiretap",
            dmRowsQuarantined: true,
            anonymizedSignal: {
              topic: "cross-agent-session-handoff",
              painPoint: "Developers researching on cloud VMs lose session tool state when switching back to local IDE.",
              recommendedArtifact: ".kiro/specs/handoff-ledger.md"
            }
          }
        },
        null,
        2
      ),
      spec: [
        "# Compiled Specification: .kiro/specs/handoff-ledger.md",
        "",
        "1. Spec Owner: topic-synthesizer -> safety-governor",
        "2. Contract REQ-LEDGER-01: Persist anonymized research digests in local 0600 SQLite WAL store.",
        "3. Contract REQ-LEDGER-02: Expose deterministic stdio MCP resource echoloom://signals/latest.",
        "4. Invariant INV-02: Zero @me DM messages may surface across search, signal clusters, or MCP tools.",
        "5. Atomic Task ISS-18: Emit markdown + JSON spec bundle before closing worktree session."
      ].join("\n"),
      voiceDryRun: [
        "voiceGate Result: PASS (score 0.94, forbidden dashes: 0, zero-width chars: 0, source overlap: 0/12 words)",
        "",
        "[DRY RUN PREVIEW: Discord write API not called]",
        "Target Channel: #community-guides (Owned Bot Token via macOS Keychain)",
        "confirmLive: false (Human approval required before broadcast)",
        "",
        "Title: Keeping Spec Context Intact When Switching Coding Agents",
        "1. Store thread findings locally in SQLite FTS5 instead of pasting raw chat logs.",
        "2. Commit requirements.md and tasks.md directly in /.kiro/specs/ so any agent session resumes cleanly.",
        "3. Verify zero personal user handles enter exported briefs."
      ].join("\n"),
      voiceLive: [
        "voiceGate Result: PASS (score 0.94, forbidden dashes: 0, zero-width chars: 0, source overlap: 0/12 words)",
        "",
        "[LIVE APPROVED DISPATCH PACKET]",
        "live: true | confirmLive: true | approvedBy: \"harrymove-ctrl\"",
        "claimLock: released | failureLedger: 0 errors",
        "",
        "Ready to publish via scoped official Bot token to #community-guides with full audit trail recorded in outbound_ledger."
      ].join("\n")
    },
    blast: {
      latency: "5.8 ms",
      cli: JSON.stringify(
        {
          ok: true,
          schema_version: "1",
          data: {
            command: "echoloom signals --cluster repair-blast-radius --json",
            queryLatencyMs: 5.8,
            sourceTier: "browser_snapshot",
            dmRowsQuarantined: true,
            benchmarkObservation: {
              sampleSize: 60,
              unboundedMaxChangedLines: 81,
              guardrailedMaxChangedLines: 5,
              guardrailedPassRate: "90.0%"
            }
          }
        },
        null,
        2
      ),
      spec: [
        "# Compiled Specification: .kiro/specs/repair-blast-guard.md",
        "",
        "1. Spec Owner: safety-governor -> voice-composer",
        "2. Contract REQ-SAFE-04: Enforce explicit dry run preview diffs on every automated outbound write.",
        "3. Hook Gate (.kiro/hooks/hooks.json): Re-run PBT invariants whenever governor or URL allowlist files change.",
        "4. Invariant INV-04: Discord write transport executes only when live, confirmLive, and approvedBy are valid.",
        "5. Atomic Task ISS-23: Cap retry loops and log structured refusals inside failure_ledger."
      ].join("\n"),
      voiceDryRun: [
        "voiceGate Result: PASS (score 0.96, forbidden dashes: 0, zero-width chars: 0, source overlap: 0/12 words)",
        "",
        "[DRY RUN PREVIEW: Discord write API not called]",
        "Target Channel: #engineering-notes (Owned Bot Token via macOS Keychain)",
        "confirmLive: false (Human approval required before broadcast)",
        "",
        "Title: Why Blast Radius Caps Beat Unbounded Retry Loops",
        "1. Guardrailed edits bounded to 5 lines matched higher accuracy than open ended 81 line rewrites.",
        "2. Enforce dry run diffs as the mandatory default across both CLI flags and stdio MCP tool schemas.",
        "3. Run 1,000+ Property Based Testing permutations against every flag and redirect edge case."
      ].join("\n"),
      voiceLive: [
        "voiceGate Result: PASS (score 0.96, forbidden dashes: 0, zero-width chars: 0, source overlap: 0/12 words)",
        "",
        "[LIVE APPROVED DISPATCH PACKET]",
        "live: true | confirmLive: true | approvedBy: \"harrymove-ctrl\"",
        "claimLock: released | rateLimitCooldown: ready",
        "",
        "Dispatch authorized under explicit human signoff with SHA-256 payload digest stored in outbound_ledger."
      ].join("\n")
    },
    mcp: {
      latency: "4.9 ms",
      cli: JSON.stringify(
        {
          ok: true,
          schema_version: "1",
          data: {
            command: "echoloom stats --mcp-ready --json",
            queryLatencyMs: 4.9,
            sourceTier: "bot_api",
            ssrfAllowlistHosts: [
              "cdn.discordapp.com",
              "media.discordapp.net"
            ],
            mcpToolsExposed: [
              "echoloom_search",
              "echoloom_signals",
              "echoloom_draft_check",
              "echoloom_publish_preview"
            ]
          }
        },
        null,
        2
      ),
      spec: [
        "# Compiled Specification: .kiro/specs/stdio-mcp-proxy.md",
        "",
        "1. Spec Owner: signal-collector -> safety-governor",
        "2. Contract REQ-MCP-01: Serve hot reloadable stdio JSON-RPC tools directly from project local config.",
        "3. Contract REQ-SSRF-01: Enforce https port 443 Discord CDN allowlist across <= 3 redirect hops.",
        "4. Invariant INV-01: Arbitrary non CDN URLs and loopback IPs never pass allowAttachmentFetch(u).",
        "5. Atomic Task ISS-22: Expose echoloom-mcp server entry cleanly for Kiro IDE, Kiro CLI, and Kiro Crew."
      ].join("\n"),
      voiceDryRun: [
        "voiceGate Result: PASS (score 0.95, forbidden dashes: 0, zero-width chars: 0, source overlap: 0/12 words)",
        "",
        "[DRY RUN PREVIEW: Discord write API not called]",
        "Target Channel: #mcp-workflows (Owned Bot Token via macOS Keychain)",
        "confirmLive: false (Human approval required before broadcast)",
        "",
        "Title: Keeping Project Local MCP Tools Visible Without Restart Loops",
        "1. Bind project local stdio binaries directly inside workspace config with zero global token side effects.",
        "2. Separate read only archive queries from human gated write tools at the schema boundary.",
        "3. Validate every attachment URL against strict HTTPS Discord CDN allowlists before downloading."
      ].join("\n"),
      voiceLive: [
        "voiceGate Result: PASS (score 0.95, forbidden dashes: 0, zero-width chars: 0, source overlap: 0/12 words)",
        "",
        "[LIVE APPROVED DISPATCH PACKET]",
        "live: true | confirmLive: true | approvedBy: \"harrymove-ctrl\"",
        "claimLock: released | pbtSuiteStatus: 5/5 verified",
        "",
        "Approved post queued through echoloom-mcp publish tool with dry run gate satisfied."
      ].join("\n")
    }
  };

  let activeScenario = "handoff";
  let activeTab = "cli";
  let isLiveMode = false;

  const scenarioButtons = document.querySelectorAll(".scenario-btn");
  const tabButtons = document.querySelectorAll(".tab-btn");
  const confirmLiveBtn = document.getElementById("confirmLiveBtn");
  const confirmLiveLabel = document.getElementById("confirmLiveLabel");
  const inspectorMetrics = document.getElementById("inspectorMetrics");
  const workbenchCode = document.getElementById("workbenchCode");
  const copyCloneBtn = document.getElementById("copyCloneBtn");
  const cloneCommand = document.getElementById("cloneCommand");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");

  function renderWorkbench() {
    const item = SCENARIOS[activeScenario];
    if (!item || !workbenchCode) return;

    if (activeTab === "cli") {
      workbenchCode.textContent = item.cli;
    } else if (activeTab === "spec") {
      workbenchCode.textContent = item.spec;
    } else {
      workbenchCode.textContent = isLiveMode ? item.voiceLive : item.voiceDryRun;
    }

    if (inspectorMetrics) {
      const gateText = isLiveMode ? "LIVE APPROVED" : "DRY RUN SAFE";
      inspectorMetrics.innerHTML =
        `<span class="metric-item">FTS5 Query: <strong>${item.latency}</strong></span>` +
        `<span class="metric-item">DM Leaks: <strong>0</strong></span>` +
        `<span class="metric-item">User Tokens: <strong>0</strong></span>` +
        `<span class="metric-item">Governor: <strong>${gateText}</strong></span>`;
    }

    if (confirmLiveBtn && confirmLiveLabel) {
      confirmLiveBtn.setAttribute("aria-pressed", String(isLiveMode));
      confirmLiveBtn.classList.toggle("is-live", isLiveMode);
      confirmLiveLabel.textContent = isLiveMode ? "Mode: confirmLive Approved" : "Mode: Dry Run Preview";
    }
  }

  scenarioButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeScenario = btn.dataset.scenario || "handoff";
      scenarioButtons.forEach((other) => {
        const selected = other === btn;
        other.classList.toggle("is-active", selected);
        other.setAttribute("aria-pressed", String(selected));
      });
      renderWorkbench();
    });
  });

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeTab = btn.dataset.tab || "cli";
      tabButtons.forEach((other) => {
        const selected = other === btn;
        other.classList.toggle("is-active", selected);
        other.setAttribute("aria-selected", String(selected));
      });
      renderWorkbench();
    });
  });

  if (confirmLiveBtn) {
    confirmLiveBtn.addEventListener("click", () => {
      isLiveMode = !isLiveMode;
      if (activeTab !== "voice") {
        activeTab = "voice";
        tabButtons.forEach((other) => {
          const selected = other.dataset.tab === "voice";
          other.classList.toggle("is-active", selected);
          other.setAttribute("aria-selected", String(selected));
        });
      }
      renderWorkbench();
    });
  }

  if (copyCloneBtn && cloneCommand) {
    copyCloneBtn.addEventListener("click", async () => {
      const text = cloneCommand.textContent ? cloneCommand.textContent.trim() : "";
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        copyCloneBtn.textContent = "Copied";
        window.setTimeout(() => {
          copyCloneBtn.textContent = "Copy command";
        }, 1800);
      } catch {
        const range = document.createRange();
        range.selectNodeContents(cloneCommand);
        const sel = window.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(range);
        }
        copyCloneBtn.textContent = "Selected";
      }
    });
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
      mobileMenuBtn.setAttribute("aria-expanded", String(!expanded));
      mobileDrawer.hidden = expanded;
    });

    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileDrawer.hidden = true;
      });
    });
  }

  renderWorkbench();
})();
