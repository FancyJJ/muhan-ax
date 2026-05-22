/**
 * 맵 왼쪽 패널(햄버거, Figma 9-4242) — 왼쪽에서 슬라이드
 * 분석 요약 3종(Figma 47-224 / 47-361 / 47-507) — 오른쪽에서 슬라이드; 레이아웃 130-2307
 */
(function () {
  "use strict";

  const mapButton = document.getElementById("mapHamburgerBtn");
  const mapPanel = document.getElementById("mapOverlayPanel");
  const mapCloseButton = document.getElementById("overlayCloseBtn");
  const pointTrigger = document.getElementById("mapPointTrigger");
  const pointPanel = document.getElementById("mapPointPanel");
  const pointCloseButton = document.getElementById("mapPointCloseBtn");
  const impactPanel = document.getElementById("impactPanel");
  const impactCloseButton = document.getElementById("impactPanelCloseBtn");
  const flowPanel = document.getElementById("flowPanel");
  const flowCloseButton = document.getElementById("flowPanelCloseBtn");
  const capturePanel = document.getElementById("capturePanel");
  const captureCloseButton = document.getElementById("capturePanelCloseBtn");
  const mapBackground = document.querySelector(".map-background");
  const mapStage = document.querySelector(".map-stage");
  const summaryLayer = document.getElementById("summaryPanelLayer");
  const summaryScrim = document.getElementById("summaryPanelScrim");

  const summaryPanels = {
    c: document.getElementById("summaryPanelC"),
    d: document.getElementById("summaryPanelD"),
    e: document.getElementById("summaryPanelE"),
  };

  if (!mapButton || !mapPanel || !mapCloseButton || !mapBackground) return;

  /** 맵 슬라이드 패널: 뷰포트 left:0에서 들어오도록 fixed — 세로는 map-stage에 맞춤 */
  const syncMapPanelLayout = () => {
    if (!mapPanel || !mapStage) return;
    const r = mapStage.getBoundingClientRect();
    const h = Math.max(0, r.height);
    const top = Math.max(0, r.top);
    mapPanel.style.setProperty("--map-panel-top", `${top}px`);
    mapPanel.style.setProperty("--map-panel-h", `${h}px`);
    if (pointPanel) {
      pointPanel.style.setProperty("--map-panel-top", `${top}px`);
      pointPanel.style.setProperty("--map-panel-h", `${h}px`);
    }
    if (impactPanel) {
      impactPanel.style.setProperty("--map-panel-top", `${top}px`);
      impactPanel.style.setProperty("--map-panel-h", `${h}px`);
    }
    if (flowPanel) {
      flowPanel.style.setProperty("--map-panel-top", `${top}px`);
      flowPanel.style.setProperty("--map-panel-h", `${h}px`);
    }
    if (capturePanel) {
      capturePanel.style.setProperty("--map-panel-top", `${top}px`);
    }
  };

  syncMapPanelLayout();
  window.addEventListener("resize", syncMapPanelLayout, { passive: true });
  window.addEventListener(
    "scroll",
    () => {
      requestAnimationFrame(syncMapPanelLayout);
    },
    { passive: true, capture: true }
  );
  if (typeof ResizeObserver !== "undefined" && mapStage) {
    new ResizeObserver(() => syncMapPanelLayout()).observe(mapStage);
  }

  const unlockBodyScroll = () => {
    document.body.style.removeProperty("overflow");
  };

  const lockBodyScroll = () => {
    document.body.style.setProperty("overflow", "hidden");
  };

  const closeSummaryLayer = () => {
    if (!summaryLayer) return;
    summaryLayer.classList.remove("is-open");
    summaryLayer.setAttribute("aria-hidden", "true");
    unlockBodyScroll();
    Object.values(summaryPanels).forEach((el) => {
      if (!el) return;
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
    });
  };

  const closeImpactPanel = () => {
    if (!impactPanel) return;
    impactPanel.classList.remove("is-open");
    impactPanel.setAttribute("aria-hidden", "true");
  };

  const closeFlowPanel = () => {
    if (!flowPanel) return;
    flowPanel.classList.remove("is-open");
    flowPanel.setAttribute("aria-hidden", "true");
  };

  const closeCapturePanel = () => {
    if (!capturePanel) return;
    capturePanel.classList.remove("is-open");
    capturePanel.setAttribute("aria-hidden", "true");
  };

  const prefersCloseMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /**
   * 닫기 X 클릭 시 아이콘(또는 버튼) 한 바퀴 회전 후 closeFn 실행.
   * @param {HTMLElement | null} button
   * @param {() => void} closeFn
   */
  const runPanelCloseWithSpin = (button, closeFn) => {
    if (!button || typeof closeFn !== "function") return;
    if (prefersCloseMotion) {
      closeFn();
      return;
    }
    if (button.classList.contains("is-panel-close-animating")) return;
    const spinEl = button.querySelector("svg") || button;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallbackId);
      spinEl.classList.remove("panel-close-x--spin");
      button.classList.remove("is-panel-close-animating");
      spinEl.removeEventListener("animationend", onAnimEnd);
      closeFn();
    };
    const onAnimEnd = (e) => {
      if (e.target !== spinEl) return;
      finish();
    };
    button.classList.add("is-panel-close-animating");
    spinEl.classList.remove("panel-close-x--spin");
    void spinEl.offsetWidth;
    spinEl.classList.add("panel-close-x--spin");
    spinEl.addEventListener("animationend", onAnimEnd);
    const fallbackId = window.setTimeout(finish, 500);
  };

  const openCapturePanel = () => {
    if (!capturePanel) return;
    closeSummaryLayer();
    closeMapPanel();
    closePointPanel();
    closeImpactPanel();
    closeFlowPanel();
    capturePanel.classList.add("is-open");
    capturePanel.setAttribute("aria-hidden", "false");
  };

  const openImpactPanel = () => {
    if (!impactPanel) return;
    closeSummaryLayer();
    closeMapPanel();
    closePointPanel();
    closeFlowPanel();
    closeCapturePanel();
    impactPanel.classList.add("is-open");
    impactPanel.setAttribute("aria-hidden", "false");
  };

  const openFlowPanel = () => {
    if (!flowPanel) return;
    closeSummaryLayer();
    closeMapPanel();
    closePointPanel();
    closeImpactPanel();
    closeCapturePanel();
    flowPanel.classList.add("is-open");
    flowPanel.setAttribute("aria-hidden", "false");
  };

  const openSummaryPanel = (key) => {
    const k = String(key).toLowerCase();
    const panel = summaryPanels[k];
    if (!panel || !summaryLayer) return;

    closeMapPanel();
    closePointPanel();
    closeImpactPanel();
    closeFlowPanel();
    closeCapturePanel();

    Object.entries(summaryPanels).forEach(([id, el]) => {
      if (!el) return;
      const on = id === k;
      el.classList.toggle("is-open", on);
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });

    summaryLayer.classList.add("is-open");
    summaryLayer.setAttribute("aria-hidden", "false");
    lockBodyScroll();

    const focusBtn = panel.querySelector(".js-summary-panel-close");
    if (focusBtn) {
      requestAnimationFrame(() => focusBtn.focus());
    }
  };

  const closeMapPanel = () => {
    mapPanel.classList.remove("is-open");
    mapPanel.setAttribute("aria-hidden", "true");
    mapButton.classList.remove("is-open");
    mapButton.setAttribute("aria-expanded", "false");
  };

  const closePointPanel = () => {
    if (!pointPanel) return;
    pointPanel.classList.remove("is-open");
    pointPanel.setAttribute("aria-hidden", "true");
    if (pointTrigger) {
      pointTrigger.classList.remove("is-selected");
      pointTrigger.setAttribute("aria-pressed", "false");
    }
  };

  const openMapPanel = () => {
    closeSummaryLayer();
    closePointPanel();
    closeImpactPanel();
    closeFlowPanel();
    closeCapturePanel();
    mapPanel.classList.add("is-open");
    mapPanel.setAttribute("aria-hidden", "false");
    mapButton.classList.add("is-open");
    mapButton.setAttribute("aria-expanded", "true");
  };

  const openPointPanel = () => {
    if (!pointPanel) return;
    closeSummaryLayer();
    closeMapPanel();
    closeImpactPanel();
    closeFlowPanel();
    closeCapturePanel();
    pointPanel.classList.add("is-open");
    pointPanel.setAttribute("aria-hidden", "false");
    if (pointTrigger) {
      pointTrigger.classList.add("is-selected");
      pointTrigger.setAttribute("aria-pressed", "true");
    }
  };

  /* ——— 맵(햄버거) ——— */
  mapButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (mapPanel.classList.contains("is-open")) {
      closeMapPanel();
      return;
    }
    openMapPanel();
  });

  mapCloseButton.addEventListener("click", (event) => {
    event.stopPropagation();
    runPanelCloseWithSpin(mapCloseButton, closeMapPanel);
  });
  mapCloseButton.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.stopPropagation();
    runPanelCloseWithSpin(mapCloseButton, closeMapPanel);
  });

  mapBackground.addEventListener("click", (event) => {
    if (
      mapPanel.classList.contains("is-open") &&
      !mapPanel.contains(event.target) &&
      !mapButton.contains(event.target)
    ) {
      closeMapPanel();
    }

    if (
      pointPanel &&
      pointPanel.classList.contains("is-open") &&
      !pointPanel.contains(event.target) &&
      !pointTrigger?.contains(event.target)
    ) {
      closePointPanel();
    }

    if (
      impactPanel &&
      impactPanel.classList.contains("is-open") &&
      !impactPanel.contains(event.target) &&
      !event.target.closest('article[data-summary-panel="c"]')
    ) {
      closeImpactPanel();
    }

    if (
      flowPanel &&
      flowPanel.classList.contains("is-open") &&
      !flowPanel.contains(event.target) &&
      !event.target.closest('article[data-summary-panel="d"]')
    ) {
      closeFlowPanel();
    }

    if (
      capturePanel &&
      capturePanel.classList.contains("is-open") &&
      !capturePanel.contains(event.target) &&
      !event.target.closest('article[data-summary-panel="e"]')
    ) {
      closeCapturePanel();
    }
  });

  if (pointTrigger && pointPanel) {
    pointTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (pointPanel.classList.contains("is-open")) {
        closePointPanel();
        return;
      }
      openPointPanel();
    });

    pointTrigger.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (pointPanel.classList.contains("is-open")) {
        closePointPanel();
        return;
      }
      openPointPanel();
    });
  }

  if (pointCloseButton) {
    pointCloseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      runPanelCloseWithSpin(pointCloseButton, closePointPanel);
    });
    pointCloseButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      runPanelCloseWithSpin(pointCloseButton, closePointPanel);
    });
  }

  /* ——— 오른쪽 분석 슬라이드: 카드(영향/유동/포획) ——— */
  const summaryTriggers = document.querySelectorAll(
    "article[data-summary-panel].ui-card--interactive"
  );

  const handleSummaryTrigger = (el) => {
    const id = el.getAttribute("data-summary-panel");
    if (!id) return;
    if (id === "c") {
      openImpactPanel();
      return;
    }
    if (id === "d") {
      openFlowPanel();
      return;
    }
    if (id === "e") {
      openCapturePanel();
      return;
    }
    openSummaryPanel(id);
  };

  summaryTriggers.forEach((el) => {
    el.addEventListener("click", () => {
      handleSummaryTrigger(el);
    });
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSummaryTrigger(el);
      }
    });
  });

  if (summaryLayer) {
    summaryLayer.addEventListener("click", (event) => {
      const closeBtn = event.target.closest(".js-summary-panel-close");
      if (closeBtn) {
        event.preventDefault();
        runPanelCloseWithSpin(closeBtn, closeSummaryLayer);
      }
    });
    summaryLayer.addEventListener("keydown", (event) => {
      const closeBtn = event.target.closest(".js-summary-panel-close");
      if (!closeBtn || !summaryLayer.contains(closeBtn)) return;
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      runPanelCloseWithSpin(closeBtn, closeSummaryLayer);
    });
  }

  if (summaryScrim) {
    summaryScrim.addEventListener("click", () => {
      closeSummaryLayer();
    });
  }

  if (impactCloseButton) {
    impactCloseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      runPanelCloseWithSpin(impactCloseButton, closeImpactPanel);
    });
    impactCloseButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      runPanelCloseWithSpin(impactCloseButton, closeImpactPanel);
    });
  }

  if (flowCloseButton) {
    flowCloseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      runPanelCloseWithSpin(flowCloseButton, closeFlowPanel);
    });
    flowCloseButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      runPanelCloseWithSpin(flowCloseButton, closeFlowPanel);
    });
  }

  if (captureCloseButton) {
    captureCloseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      runPanelCloseWithSpin(captureCloseButton, closeCapturePanel);
    });
    captureCloseButton.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      event.stopPropagation();
      runPanelCloseWithSpin(captureCloseButton, closeCapturePanel);
    });
  }

  /* Figma 296:800 — 레이어 행(아코디언) */
  const summaryOpenMapPanelBtn = document.getElementById("summaryToolOpenMapPanel");
  if (summaryOpenMapPanelBtn) {
    summaryOpenMapPanelBtn.addEventListener("click", () => {
      openMapPanel();
    });
  }

  document.querySelectorAll(".map-stat-item").forEach((btn) => {
    const panelId = btn.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      const next = !isOpen;
      btn.setAttribute("aria-expanded", String(next));
      btn.setAttribute("aria-pressed", String(next));
      btn.classList.toggle("is-collapsed", !next);
      if (panel) {
        panel.hidden = !next;
        panel.setAttribute("aria-hidden", next ? "false" : "true");
      }
    });
  });

  /* 현재 left-panel 마크업용 아코디언 */
  const toggleLeftAccordion = (btn, forceExpanded) => {
    const panelId = btn.getAttribute("aria-controls");
    const panel = panelId ? document.getElementById(panelId) : null;
    const current = btn.getAttribute("aria-expanded") !== "false";
    const next = typeof forceExpanded === "boolean" ? forceExpanded : !current;

    btn.setAttribute("aria-expanded", String(next));
    btn.classList.toggle("is-collapsed", !next);
    if (panel) {
      panel.hidden = !next;
      panel.setAttribute("aria-hidden", next ? "false" : "true");
      panel.style.display = next ? "" : "none";
    }
  };

  document.querySelectorAll(".js-left-accordion-trigger").forEach((btn) => {
    toggleLeftAccordion(btn, btn.getAttribute("aria-expanded") !== "false");

    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleLeftAccordion(btn);
    });
  });

  document.querySelectorAll(".js-left-accordion-trigger .component-12, .js-left-accordion-trigger .component-13").forEach((arrow) => {
    arrow.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const btn = arrow.closest(".js-left-accordion-trigger");
      if (btn) toggleLeftAccordion(btn);
    });
  });

  /* 현재 left-panel 마크업용 체크 토글 */
  const setLayerRowState = (row, checked) => {
    row.setAttribute("aria-pressed", String(checked));

    const box = row.querySelector(".primitive-button2");
    if (box) {
      box.classList.toggle("primitive-button2--checked", checked);
    }

    const label = row.querySelector(".div2, .div3");
    if (label) {
      label.classList.toggle("div2", checked);
      label.classList.toggle("div3", !checked);
    }
  };

  document.querySelectorAll(".js-layer-check-row").forEach((row) => {
    row.addEventListener("click", (event) => {
      event.stopPropagation();
      const next = row.getAttribute("aria-pressed") !== "true";
      setLayerRowState(row, next);
    });

    row.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const next = row.getAttribute("aria-pressed") !== "true";
      setLayerRowState(row, next);
    });
  });

  /* left-panel 레이어/검색 탭 전환 */
  const leftTabButtons = document.querySelectorAll(".js-left-tab-btn");
  const leftViewPanels = document.querySelectorAll(".js-left-view-panel");

  const setLeftPanelView = (view) => {
    leftTabButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-left-view") === view;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-selected", String(isActive));
    });

    leftViewPanels.forEach((panel) => {
      const isActive = panel.getAttribute("data-left-view-panel") === view;
      panel.hidden = !isActive;
    });
  };

  if (leftTabButtons.length > 0) {
    leftTabButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const view = btn.getAttribute("data-left-view");
        if (view) setLeftPanelView(view);
      });
    });
  }

  /* 검색 패널: 주소유형 라디오 선택 */
  const addressRadios = document.querySelectorAll(".js-address-radio");
  const setAddressType = (type) => {
    addressRadios.forEach((btn) => {
      const isActive = btn.getAttribute("data-address-type") === type;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  };

  if (addressRadios.length > 0) {
    addressRadios.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const type = btn.getAttribute("data-address-type");
        if (type) setAddressType(type);
      });
    });
  }

  /* impact 패널: 공식 선택 라디오 */
  const impactFormulaButtons = document.querySelectorAll(".js-impact-formula");
  const setImpactFormula = (formula) => {
    impactFormulaButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-impact-formula") === formula;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  };

  if (impactFormulaButtons.length > 0) {
    impactFormulaButtons.forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.stopPropagation();
        const formula = btn.getAttribute("data-impact-formula");
        if (formula) setImpactFormula(formula);
      });
    });
  }

  /* flow 패널: 라디오 그룹(정/역방향, 3/5/10년 등) — 패널에 위임해 겹침·캡처 이슈 방지 */
  const setFlowRadioVisualState = (button, isActive) => {
    button.classList.toggle("radio-buton", isActive);
    button.classList.toggle("radio-buton2", !isActive);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    const marker = button.querySelector(".radio-button-item, .radio-button-item2");
    if (!marker) return;

    marker.classList.toggle("radio-button-item", isActive);
    marker.classList.toggle("radio-button-item2", !isActive);

    if (isActive) {
      let element = marker.querySelector(".element");
      if (!element) {
        element = document.createElement("div");
        element.className = "element";
        marker.appendChild(element);
      }

      let dot = element.querySelector(".rectangle-88");
      if (!dot) {
        dot = document.createElement("div");
        dot.className = "rectangle-88";
        element.appendChild(dot);
      }
    } else {
      const element = marker.querySelector(".element");
      if (element) element.remove();
    }
  };

  const initSlidePanelRadioGroups = (panelRoot) => {
    if (!panelRoot) return;
    panelRoot.querySelectorAll(".radio-group, .radio-group2").forEach((group) => {
      const buttons = Array.from(group.querySelectorAll(".radio-buton, .radio-buton2"));
      if (buttons.length === 0) return;
      const activeButton = buttons.find((btn) => btn.classList.contains("radio-buton")) || buttons[0];
      buttons.forEach((btn) => setFlowRadioVisualState(btn, btn === activeButton));
    });
  };

  const attachSlidePanelRadios = (panelRoot) => {
    if (!panelRoot) return;
    initSlidePanelRadioGroups(panelRoot);

    panelRoot.addEventListener("click", (event) => {
      const btn = event.target.closest(".radio-buton, .radio-buton2");
      if (!btn || !panelRoot.contains(btn)) return;
      const group = btn.closest(".radio-group, .radio-group2");
      if (!group) return;
      const buttons = Array.from(group.querySelectorAll(".radio-buton, .radio-buton2"));
      if (!buttons.includes(btn)) return;
      event.stopPropagation();
      buttons.forEach((candidate) => setFlowRadioVisualState(candidate, candidate === btn));
    });

    panelRoot.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const btn = event.target.closest?.(".radio-buton, .radio-buton2");
      if (!btn || !panelRoot.contains(btn)) return;
      const group = btn.closest(".radio-group, .radio-group2");
      if (!group) return;
      const buttons = Array.from(group.querySelectorAll(".radio-buton, .radio-buton2"));
      if (!buttons.includes(btn)) return;
      event.preventDefault();
      event.stopPropagation();
      buttons.forEach((candidate) => setFlowRadioVisualState(candidate, candidate === btn));
    });
  };

  attachSlidePanelRadios(flowPanel);
  attachSlidePanelRadios(capturePanel);

  /* 검색 패널: 검색 결과 페이지네이션 */
  const resultItems = Array.from(document.querySelectorAll("#leftAddressResultList > button"));
  const currentPageEl = document.getElementById("searchCurrentPage");
  const totalPageEl = document.getElementById("searchTotalPage");
  const prevPageBtn = document.querySelector(".js-search-page-prev");
  const nextPageBtn = document.querySelector(".js-search-page-next");

  if (resultItems.length > 0 && currentPageEl && totalPageEl && prevPageBtn && nextPageBtn) {
    const perPage = 4;
    const totalPage = Math.max(1, Math.ceil(resultItems.length / perPage));
    let currentPage = 1;

    const renderSearchPage = () => {
      const start = (currentPage - 1) * perPage;
      const end = start + perPage;

      resultItems.forEach((item, idx) => {
        item.hidden = !(idx >= start && idx < end);
      });

      currentPageEl.textContent = String(currentPage);
      totalPageEl.textContent = String(totalPage);
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= totalPage;
    };

    prevPageBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (currentPage <= 1) return;
      currentPage -= 1;
      renderSearchPage();
    });

    nextPageBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      if (currentPage >= totalPage) return;
      currentPage += 1;
      renderSearchPage();
    });

    renderSearchPage();
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (summaryLayer && summaryLayer.classList.contains("is-open")) {
      closeSummaryLayer();
      return;
    }
    if (impactPanel && impactPanel.classList.contains("is-open")) {
      closeImpactPanel();
      return;
    }
    if (flowPanel && flowPanel.classList.contains("is-open")) {
      closeFlowPanel();
      return;
    }
    if (pointPanel && pointPanel.classList.contains("is-open")) {
      closePointPanel();
      return;
    }
    if (mapPanel.classList.contains("is-open")) {
      closeMapPanel();
    }
  });
})();
