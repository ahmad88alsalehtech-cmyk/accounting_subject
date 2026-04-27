/**
 * =============================================================
 * ACCOUNTING CYCLE — Interactive Educational App
 * script.js — Application Logic
 * Direction: RTL | Language: Arabic
 * =============================================================
 */

/* ============================================================
   STATE MANAGEMENT
============================================================ */
const AppState = {
  currentScreen: 1,
  totalScreens: 5,
  visitedStages: new Set(),
  simulation: {
    debitItem: null,
    creditItem: null,
    solved: false,
    draggedItemId: null,
    selectedForClick: null,
  },
  assessment: {
    selectedOption: null,
    answered: false,
    correct: false,
  },
};

/* ============================================================
   DATA — STAGE DETAILS
============================================================ */
const stagesData = [
  {
    id: 1,
    title: 'تحديد وتحليل العمليات',
    icon: '<i class="fa-solid fa-file-invoice"></i>',
    description: 'تبدأ الدورة المحاسبية بتحديد العمليات المالية التي يجب تسجيلها، مدعومةً بمستندات مثل الفواتير والإيصالات وكشوف الحسابات البنكية.',
    detail: '<strong>مثال:</strong> إذا اشترت شركة معدات جديدة، تُحلَّل فاتورة الشراء لتحديد التكلفة والمصروفات المرتبطة بها، ويُحتفَظ بها دليلاً على العملية.',
  },
  {
    id: 2,
    title: 'التسجيل في دفتر اليومية',
    icon: '<i class="fa-solid fa-book-open"></i>',
    description: 'بعد جمع المستندات المالية وتحليلها وتحديد الحسابات المدينة والدائنة، تُسجَّل العمليات في دفتر اليومية.',
    detail: '<strong>القاعدة:</strong> تحديد المدين (من حـ/) والدائن (إلى حـ/) لكل عملية مالية بحيث يتساوى مجموع المدين مع مجموع الدائن.',
  },
  {
    id: 3,
    title: 'الترحيل إلى دفتر الأستاذ',
    icon: '<i class="fa-solid fa-folder-open"></i>',
    description: 'تصنيف العمليات المالية وتبويبها في دفتر الأستاذ للحصول على معلومات أكثر دقة عن وضع المؤسسة.',
    detail: '<strong>الهدف:</strong> يُجمِع دفتر الأستاذ كل العمليات المتعلقة بحساب معين في مكان واحد، مما يُسهِّل متابعة رصيد كل حساب.',
  },
  {
    id: 4,
    title: 'إعداد ميزان المراجعة',
    icon: '<i class="fa-solid fa-scale-balanced"></i>',
    description: 'إعداد ميزان المراجعة للتحقق من توازن الحسابات. إذا كان مجموع الأرصدة المدينة يساوي مجموع الأرصدة الدائنة، فإن الحسابات تكون متوازنة.',
    detail: '<strong>الشرط:</strong> مجموع المدين = مجموع الدائن. في حال عدم التوازن، يعني ذلك وجود أخطاء يجب مراجعتها وتصحيحها.',
  },
  {
    id: 5,
    title: 'إعداد القوائم المالية',
    icon: '<i class="fa-solid fa-chart-bar"></i>',
    description: 'تُعَدُّ القوائم المالية المخرج النهائي للنظام المحاسبي، وهي ملخص لأثر العمليات المالية خلال السنة المالية.',
    detail: '<strong>تشمل:</strong> قائمة الدخل، وقائمة حقوق الملكية، وقائمة المركز المالي (الميزانية العمومية). وهي أهم أداة لتوثيق الأداء المالي.',
  },
  {
    id: 6,
    title: 'إقفال الحسابات',
    icon: '<i class="fa-solid fa-lock"></i>',
    description: 'الخطوة الأخيرة: إقفال الحسابات المؤقتة وتحويل أرصدتها إلى حسابات دائمة بعد إعداد القوائم المالية.',
    detail: '<strong>التوقيت:</strong> تُنفَّذ في نهاية السنة المالية أو في نهاية الفترة المحاسبية، تمهيداً لبدء دورة محاسبية جديدة.',
  },
];

/* Arabic numerals helper */
const arabicNums = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
const toArabicNum = (n) => String(n).split('').map(d => arabicNums[+d]).join('');

/* ============================================================
   DOM REFERENCES
============================================================ */
const DOM = {
  screens:        () => document.querySelectorAll('.screen'),
  screen:         (n) => document.getElementById('screen-' + n),
  progressFill:   () => document.getElementById('progressFill'),
  progressSteps:  () => document.querySelectorAll('.progress-step'),

  btnStart:       () => document.getElementById('btn-start'),

  cycleNodes:     () => document.querySelectorAll('.cycle-node'),
  infoPanelPlaceholder: () => document.getElementById('infoPanelPlaceholder'),
  infoPanelContent:     () => document.getElementById('infoPanelContent'),
  infoStageNum:   () => document.getElementById('infoStageNum'),
  infoStageIcon:  () => document.getElementById('infoStageIcon'),
  infoStageTitle: () => document.getElementById('infoStageTitle'),
  infoStageDesc:  () => document.getElementById('infoStageDesc'),
  infoStageDetail:() => document.getElementById('infoStageDetail'),
  visitedCount:   () => document.getElementById('visitedCount'),
  importanceToggle:() => document.getElementById('importanceToggle'),
  importanceBody: () => document.getElementById('importanceBody'),
  btnToScreen3:   () => document.getElementById('btn-to-screen3'),

  dragEquipment:  () => document.getElementById('drag-equipment'),
  dragCash:       () => document.getElementById('drag-cash'),
  dropDebit:      () => document.getElementById('drop-debit'),
  dropCredit:     () => document.getElementById('drop-credit'),
  debitZoneBody:  () => document.getElementById('debit-zone-body'),
  creditZoneBody: () => document.getElementById('credit-zone-body'),
  btnHint:        () => document.getElementById('btn-hint'),
  hintBox:        () => document.getElementById('hintBox'),
  btnResetSim:    () => document.getElementById('btn-reset-sim'),
  btnCheckSim:    () => document.getElementById('btn-check-sim'),
  simFeedback:    () => document.getElementById('simFeedback'),
  simNextWrap:    () => document.getElementById('simNextWrap'),
  btnToScreen4:   () => document.getElementById('btn-to-screen4'),

  assessmentOptions:  () => document.getElementById('assessmentOptions'),
  btnCheckAssessment: () => document.getElementById('btn-check-assessment'),
  assessmentFeedback: () => document.getElementById('assessmentFeedback'),
  assessmentNextWrap: () => document.getElementById('assessmentNextWrap'),
  btnToScreen5:       () => document.getElementById('btn-to-screen5'),

  btnRestart: () => document.getElementById('btn-restart'),
  btnExit:    () => document.getElementById('btn-exit'),

  exitOverlay:  () => document.getElementById('exitOverlay'),
  btnExitClose: () => document.getElementById('btn-exit-close'),
};

/* ============================================================
   NAVIGATION
============================================================ */
function goToScreen(targetScreen) {
  if (targetScreen < 1 || targetScreen > AppState.totalScreens) return;

  const screen2Audio = document.getElementById('screen2-audio');
  if (screen2Audio && targetScreen !== 2) {
    screen2Audio.pause();
    screen2Audio.currentTime = 0;
  }

  DOM.screens().forEach(s => s.classList.remove('screen-active'));
  const target = DOM.screen(targetScreen);
  if (target) {
    target.classList.add('screen-active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  AppState.currentScreen = targetScreen;
  updateProgress();

  if (targetScreen === 2) {
    setTimeout(positionCycleNodes, 50);
  }
}

function updateProgress() {
  const n = AppState.currentScreen;
  const total = AppState.totalScreens;
  const pct = ((n - 1) / (total - 1)) * 100;
  const fill = DOM.progressFill();
  if (fill) fill.style.width = pct + '%';

  DOM.progressSteps().forEach(step => {
    const stepNum = parseInt(step.dataset.step);
    step.classList.remove('active', 'done');
    if (stepNum === n) step.classList.add('active');
    else if (stepNum < n) step.classList.add('done');
  });
}

/* ============================================================
   SCREEN 1 — WELCOME
============================================================ */
function initScreen1() {
  DOM.btnStart()?.addEventListener('click', () => goToScreen(2));
}

/* ============================================================
   SCREEN 2 — CYCLE DIAGRAM
============================================================ */
function initScreen2() {
  DOM.cycleNodes().forEach(node => {
    node.addEventListener('click', () => activateStage(parseInt(node.dataset.stage)));
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateStage(parseInt(node.dataset.stage));
      }
    });
  });

  // JS-based positioning for cross-browser support (avoids CSS sin()/cos())
  positionCycleNodes();
  window.addEventListener('resize', positionCycleNodes);

  DOM.importanceToggle()?.addEventListener('click', () => {
    const body = DOM.importanceBody();
    const btn  = DOM.importanceToggle();
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (body) body.hidden = expanded;
  });

  DOM.btnToScreen3()?.addEventListener('click', () => goToScreen(3));
}

/**
 * Positions the 6 cycle-node buttons in a circle using pure JS math.
 * Reads data-angle from each node. Fully cross-browser.
 */
function positionCycleNodes() {
  const diagram = document.getElementById('cycleDiagram');
  if (!diagram) return;

  const nodes = diagram.querySelectorAll('.cycle-node');
  const W = diagram.offsetWidth  || 420;
  const H = diagram.offsetHeight || 420;

  // Orbit radius is 37% of diagram width, node size 23.5%
  const orbitR   = W * 0.37;
  const nodeSize = Math.max(68, Math.round(W * 0.235));
  const half     = nodeSize / 2;

  nodes.forEach(node => {
    const angleDeg = parseFloat(node.dataset.angle) || 0;
    // -90 so that 0deg = top (12 o'clock position)
    const rad = (angleDeg - 90) * (Math.PI / 180);
    const cx = W / 2 + orbitR * Math.cos(rad);
    const cy = H / 2 + orbitR * Math.sin(rad);
    node.style.width  = nodeSize + 'px';
    node.style.height = nodeSize + 'px';
    node.style.left   = (cx - half) + 'px';
    node.style.top    = (cy - half) + 'px';
  });
}

function activateStage(stageId) {
  const data = stagesData.find(s => s.id === stageId);
  if (!data) return;

  DOM.cycleNodes().forEach(node => {
    const id = parseInt(node.dataset.stage);
    node.classList.remove('active');
    if (id === stageId) {
      node.classList.add('active', 'visited');
    } else if (AppState.visitedStages.has(id)) {
      node.classList.add('visited');
    }
  });

  AppState.visitedStages.add(stageId);
  const vc = DOM.visitedCount();
  if (vc) vc.textContent = toArabicNum(AppState.visitedStages.size);

  const placeholder = DOM.infoPanelPlaceholder();
  const content     = DOM.infoPanelContent();
  if (placeholder) placeholder.hidden = true;
  if (content) {
    content.hidden = false;
    content.style.animation = 'none';
    void content.offsetWidth;
    content.style.animation = '';

    DOM.infoStageNum().textContent   = 'المرحلة ' + toArabicNum(stageId);
    DOM.infoStageIcon().innerHTML    = data.icon;
    DOM.infoStageTitle().textContent = data.title;
    DOM.infoStageDesc().textContent  = data.description;
    DOM.infoStageDetail().innerHTML  = data.detail;
  }
}

/* ============================================================
   SCREEN 3 — DRAG & DROP SIMULATION
============================================================ */
function initScreen3() {
  setupDragAndDrop();
  setupClickBasedPlacement();

  DOM.btnHint()?.addEventListener('click', toggleHint);
  DOM.btnResetSim()?.addEventListener('click', resetSimulation);
  DOM.btnCheckSim()?.addEventListener('click', checkSimulation);
  DOM.btnToScreen4()?.addEventListener('click', () => goToScreen(4));
}

function setupDragAndDrop() {
  const items = [DOM.dragEquipment(), DOM.dragCash()].filter(Boolean);
  const zones = [DOM.dropDebit(), DOM.dropCredit()].filter(Boolean);

  items.forEach(item => {
    item.addEventListener('dragstart', onDragStart);
    item.addEventListener('dragend',   onDragEnd);
    // Touch support
    item.addEventListener('touchstart', onTouchStart, { passive: true });
    item.addEventListener('touchmove',  onTouchMove,  { passive: false });
    item.addEventListener('touchend',   onTouchEnd);
  });

  zones.forEach(zone => {
    zone.addEventListener('dragover',  onDragOver);
    zone.addEventListener('dragleave', onDragLeave);
    zone.addEventListener('drop',      onDrop);
  });
}

function onDragStart(e) {
  AppState.simulation.draggedItemId = e.currentTarget.dataset.item;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', e.currentTarget.dataset.item);
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  AppState.simulation.draggedItemId = null;
}

function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('drag-over');
  const itemId   = e.dataTransfer.getData('text/plain');
  const zoneName = zone.dataset.zone;
  placeItemInZone(itemId, zoneName);
}

/* Touch drag support */
let touchDragItem = null;
let touchClone    = null;

function onTouchStart(e) {
  touchDragItem = e.currentTarget;
  AppState.simulation.draggedItemId = touchDragItem.dataset.item;

  // Create a visual clone that follows the finger
  touchClone = touchDragItem.cloneNode(true);
  touchClone.style.cssText = 'position:fixed;pointer-events:none;opacity:0.8;z-index:999;transform:scale(1.05);transition:none;';
  document.body.appendChild(touchClone);
}

function onTouchMove(e) {
  e.preventDefault();
  if (!touchClone) return;
  const touch = e.touches[0];
  touchClone.style.left = (touch.clientX - touchClone.offsetWidth / 2) + 'px';
  touchClone.style.top  = (touch.clientY - touchClone.offsetHeight / 2) + 'px';

  // Highlight drop zone under finger
  touchClone.style.display = 'none';
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  touchClone.style.display = '';
  document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));
  const zone = el?.closest('.drop-zone');
  if (zone) zone.classList.add('drag-over');
}

function onTouchEnd(e) {
  if (touchClone) { touchClone.remove(); touchClone = null; }
  document.querySelectorAll('.drop-zone').forEach(z => z.classList.remove('drag-over'));

  if (!touchDragItem) return;
  const touch = e.changedTouches[0];
  touchDragItem.style.display = 'none';
  const el = document.elementFromPoint(touch.clientX, touch.clientY);
  touchDragItem.style.display = '';

  const zone = el?.closest('.drop-zone');
  if (zone) placeItemInZone(AppState.simulation.draggedItemId, zone.dataset.zone);

  touchDragItem = null;
  AppState.simulation.draggedItemId = null;
}

/* Click-based fallback */
function setupClickBasedPlacement() {
  const items = [DOM.dragEquipment(), DOM.dragCash()].filter(Boolean);
  const zones = [DOM.dropDebit(), DOM.dropCredit()].filter(Boolean);

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (item.classList.contains('placed')) return;
      if (AppState.simulation.selectedForClick === item.dataset.item) {
        AppState.simulation.selectedForClick = null;
        item.classList.remove('selected-for-drop');
      } else {
        items.forEach(i => i.classList.remove('selected-for-drop'));
        AppState.simulation.selectedForClick = item.dataset.item;
        item.classList.add('selected-for-drop');
      }
    });
  });

  zones.forEach(zone => {
    zone.addEventListener('click', () => {
      if (!AppState.simulation.selectedForClick) return;
      const itemId   = AppState.simulation.selectedForClick;
      const zoneName = zone.dataset.zone;
      items.forEach(i => i.classList.remove('selected-for-drop'));
      AppState.simulation.selectedForClick = null;
      placeItemInZone(itemId, zoneName);
    });
  });
}

/* Core placement logic */
function placeItemInZone(itemId, zoneName) {
  if (AppState.simulation.solved || !itemId || !zoneName) return;

  const sim = AppState.simulation;
  const itemData = {
    equipment: { name: 'معدات',    icon: 'fa-tools',        sub: 'أصل ثابت' },
    cash:      { name: 'الصندوق', icon: 'fa-cash-register', sub: 'أصل متداول' },
  };

  const item = itemData[itemId];
  if (!item) return;

  // Remove from any previous zone
  if (sim.debitItem  === itemId) { sim.debitItem  = null; renderZoneBody('debit',  null); }
  if (sim.creditItem === itemId) { sim.creditItem = null; renderZoneBody('credit', null); }

  if (zoneName === 'debit') {
    if (sim.debitItem)  returnItemToDragArea(sim.debitItem);
    sim.debitItem = itemId;
    renderZoneBody('debit', item);
  } else if (zoneName === 'credit') {
    if (sim.creditItem) returnItemToDragArea(sim.creditItem);
    sim.creditItem = itemId;
    renderZoneBody('credit', item);
  }

  const el = document.getElementById('drag-' + itemId);
  if (el) el.classList.add('placed');

  const fb = DOM.simFeedback();
  if (fb) fb.hidden = true;
}

function renderZoneBody(zoneName, itemData) {
  const body = zoneName === 'debit' ? DOM.debitZoneBody() : DOM.creditZoneBody();
  if (!body) return;

  if (!itemData) {
    body.innerHTML = '<div class="zone-placeholder"><i class="fa-solid fa-plus-circle"></i><span>أفلت هنا</span></div>';
    return;
  }

  body.innerHTML =
    '<div class="dropped-item">' +
      '<i class="fa-solid ' + itemData.icon + '"></i>' +
      '<span>' + itemData.name + '</span>' +
      '<button class="remove-btn" data-zone="' + zoneName + '" aria-label="إزالة">' +
        '<i class="fa-solid fa-xmark"></i>' +
      '</button>' +
    '</div>';

  body.querySelector('.remove-btn')?.addEventListener('click', (e) => {
    const zone      = e.currentTarget.dataset.zone;
    const removedId = zone === 'debit' ? AppState.simulation.debitItem : AppState.simulation.creditItem;
    if (zone === 'debit')  AppState.simulation.debitItem  = null;
    if (zone === 'credit') AppState.simulation.creditItem = null;
    renderZoneBody(zone, null);
    returnItemToDragArea(removedId);
  });
}

function returnItemToDragArea(itemId) {
  const el = document.getElementById('drag-' + itemId);
  if (el) el.classList.remove('placed', 'selected-for-drop');
}

function toggleHint() {
  const hintBox = DOM.hintBox();
  const btn     = DOM.btnHint();
  if (!hintBox || !btn) return;
  hintBox.hidden = !hintBox.hidden;
  btn.setAttribute('aria-expanded', String(!hintBox.hidden));
}

function resetSimulation() {
  const sim = AppState.simulation;
  sim.debitItem  = null;
  sim.creditItem = null;
  sim.solved     = false;
  sim.selectedForClick = null;

  renderZoneBody('debit',  null);
  renderZoneBody('credit', null);

  ['drag-equipment', 'drag-cash'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('placed', 'dragging', 'selected-for-drop');
  });

  [DOM.dropDebit(), DOM.dropCredit()].forEach(z => {
    z?.classList.remove('correct', 'incorrect', 'drag-over');
  });

  const fb = DOM.simFeedback();
  if (fb) fb.hidden = true;

  const nextWrap = DOM.simNextWrap();
  if (nextWrap) nextWrap.hidden = true;

  DOM.btnCheckSim()?.removeAttribute('disabled');
}

function checkSimulation() {
  const sim = AppState.simulation;

  if (!sim.debitItem || !sim.creditItem) {
    showSimFeedback('error', 'لم تكتمل الإجابة', 'يُرجى وضع كلا العنصرين (المعدات والصندوق) في الخانتين قبل التحقق.', null);
    return;
  }

  const isCorrect = sim.debitItem === 'equipment' && sim.creditItem === 'cash';

  if (isCorrect) {
    sim.solved = true;
    DOM.dropDebit()?.classList.add('correct');
    DOM.dropCredit()?.classList.add('correct');
    showSimFeedback(
      'success',
      'إجابة صحيحة تماماً! ✓',
      'المعدات أصل ثابت زاد، لذا يُسجَّل في الجانب المدين. والصندوق أصل متداول نقص، لذا يُسجَّل في الجانب الدائن.',
      'الأصل إذا زاد يبقى مدين، وإذا نقص يصبح دائن'
    );
    DOM.btnCheckSim()?.setAttribute('disabled', 'true');
    const nextWrap = DOM.simNextWrap();
    if (nextWrap) nextWrap.hidden = false;
    playSuccessSound();
  } else {
    DOM.dropDebit()?.classList.add('incorrect');
    DOM.dropCredit()?.classList.add('incorrect');
    setTimeout(() => {
      DOM.dropDebit()?.classList.remove('incorrect');
      DOM.dropCredit()?.classList.remove('incorrect');
    }, 1500);
    showSimFeedback(
      'error',
      'إجابة غير صحيحة',
      'راجع التحليل: المعدات أصل ثابت زاد (مدين)، والصندوق أصل متداول نقص (دائن). تذكّر القاعدة في نافذة التلميح!',
      null
    );
  }
}

function showSimFeedback(type, title, body, principle) {
  const fb = DOM.simFeedback();
  if (!fb) return;
  fb.className = 'sim-feedback ' + type;
  fb.hidden = false;
  const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const principleHTML = principle ? '<div class="principle-box">💡 ' + principle + '</div>' : '';
  fb.innerHTML =
    '<i class="fa-solid ' + icon + '"></i>' +
    '<div class="feedback-text">' +
      '<strong>' + title + '</strong>' +
      '<p>' + body + '</p>' +
      principleHTML +
    '</div>';
}

/* ============================================================
   SCREEN 4 — ASSESSMENT
============================================================ */
function initScreen4() {
  const options = DOM.assessmentOptions()?.querySelectorAll('.option-card');

  options?.forEach(opt => {
    opt.setAttribute('tabindex', '0');
    opt.addEventListener('click', () => {
      if (AppState.assessment.answered) return;
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      AppState.assessment.selectedOption = opt.querySelector('input')?.value ?? null;
    });

    opt.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !AppState.assessment.answered) {
        e.preventDefault();
        opt.click();
      }
    });
  });

  DOM.btnCheckAssessment()?.addEventListener('click', checkAssessment);
  DOM.btnToScreen5()?.addEventListener('click', () => goToScreen(5));
}

function checkAssessment() {
  if (!AppState.assessment.selectedOption) {
    const fb = DOM.assessmentFeedback();
    if (fb) {
      fb.hidden = false;
      fb.className = 'assessment-feedback incorrect';
      fb.innerHTML = '<strong>يُرجى اختيار إجابة أولاً</strong>';
      setTimeout(() => { fb.hidden = true; }, 2000);
    }
    return;
  }

  if (AppState.assessment.answered) return;
  AppState.assessment.answered = true;

  const isCorrect = AppState.assessment.selectedOption === 'statements';
  AppState.assessment.correct = isCorrect;

  const options = DOM.assessmentOptions()?.querySelectorAll('.option-card');
  options?.forEach(opt => {
    const val = opt.querySelector('input')?.value;
    opt.style.pointerEvents = 'none';
    if (val === 'statements') {
      opt.classList.add('correct-answer');
    } else if (val === AppState.assessment.selectedOption && !isCorrect) {
      opt.classList.add('wrong-answer');
    }
  });

  DOM.btnCheckAssessment()?.setAttribute('disabled', 'true');

  const fb = DOM.assessmentFeedback();
  if (fb) {
    fb.hidden = false;
    if (isCorrect) {
      fb.className = 'assessment-feedback correct';
      fb.innerHTML =
        '<div class="result-badge-display"><i class="fa-solid fa-star"></i> أحسنت!</div>' +
        '<strong>إجابة صحيحة تماماً! ✓</strong>' +
        '<p>القوائم المالية هي المخرج النهائي للنظام المحاسبي لأنها تُلخِّص نتائج جميع العمليات المالية خلال المدة المالية، وتشمل قائمة الدخل وقائمة حقوق الملكية وقائمة المركز المالي.</p>';
      playSuccessSound();
    } else {
      fb.className = 'assessment-feedback incorrect';
      fb.innerHTML =
        '<strong>إجابة غير صحيحة</strong>' +
        '<p>الإجابة الصحيحة هي <strong>القوائم المالية</strong>. وهي المخرج النهائي للنظام المحاسبي الذي يُلخِّص نتائج العمليات المالية للمؤسسة.</p>';
    }
  }

  const nextWrap = DOM.assessmentNextWrap();
  if (nextWrap) nextWrap.hidden = false;
}

/* ============================================================
   SCREEN 5 — SUMMARY + EXIT
============================================================ */
function initScreen5() {
  DOM.btnRestart()?.addEventListener('click', restartApp);
  DOM.btnExit()?.addEventListener('click', () => {
    const overlay = DOM.exitOverlay();
    if (overlay) overlay.hidden = false;
  });
  DOM.btnExitClose()?.addEventListener('click', () => {
    const overlay = DOM.exitOverlay();
    if (overlay) overlay.hidden = true;
  });
}

function restartApp() {
  AppState.visitedStages.clear();
  AppState.simulation = { debitItem: null, creditItem: null, solved: false, draggedItemId: null, selectedForClick: null };
  AppState.assessment = { selectedOption: null, answered: false, correct: false };

  resetSimulation();

  const options = DOM.assessmentOptions()?.querySelectorAll('.option-card');
  options?.forEach(opt => {
    opt.classList.remove('selected', 'correct-answer', 'wrong-answer');
    opt.style.pointerEvents = '';
    const input = opt.querySelector('input');
    if (input) input.checked = false;
  });
  DOM.btnCheckAssessment()?.removeAttribute('disabled');
  const aFb = DOM.assessmentFeedback();
  if (aFb) aFb.hidden = true;
  const aNext = DOM.assessmentNextWrap();
  if (aNext) aNext.hidden = true;

  DOM.cycleNodes().forEach(node => node.classList.remove('active', 'visited'));
  const vc = DOM.visitedCount();
  if (vc) vc.textContent = '٠';
  const placeholder = DOM.infoPanelPlaceholder();
  const content     = DOM.infoPanelContent();
  if (placeholder) placeholder.hidden = false;
  if (content)     content.hidden     = true;
  const ib = DOM.importanceBody();
  if (ib) ib.hidden = true;
  DOM.importanceToggle()?.setAttribute('aria-expanded', 'false');

  const hintBox = DOM.hintBox();
  if (hintBox) hintBox.hidden = true;
  DOM.btnHint()?.setAttribute('aria-expanded', 'false');

  goToScreen(1);
}

/* ============================================================
   SOUND — Subtle success chime via Web Audio API
============================================================ */
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
  }
  return audioCtx;
}

function playSuccessSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      osc.start(t);
      osc.stop(t + 0.5);
    });
  } catch (e) { /* silent */ }
}

/* ============================================================
   AUDIO PLAYER — Screen 2
============================================================ */
function initAudioPlayer() {
  const audio      = document.getElementById('screen2-audio');
  const playBtn    = document.getElementById('audioPlayBtn');
  const playIcon   = document.getElementById('audioPlayIcon');
  const trackFill  = document.getElementById('audioTrackFill');
  const trackThumb = document.getElementById('audioTrackThumb');
  const timeEl     = document.getElementById('audioCurrentTime');
  const durEl      = document.getElementById('audioDuration');
  const track      = document.getElementById('audioTrack');
  const wave       = document.getElementById('audioWave');

  if (!audio || !playBtn) return;

  function fmt(secs) {
    if (!isFinite(secs) || isNaN(secs)) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return toArabicNum(m) + ':' + (s < 10 ? '٠' + toArabicNum(s) : toArabicNum(s));
  }

  function setPlaying(on) {
    playIcon.className = 'fa-solid ' + (on ? 'fa-pause' : 'fa-play');
    playBtn.classList.toggle('playing', on);
    wave?.classList.toggle('active', on);
  }

  playBtn.addEventListener('click', () => {
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  });

  audio.addEventListener('play',  () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => { setPlaying(false); audio.currentTime = 0; });

  audio.addEventListener('loadedmetadata', () => {
    durEl.textContent = fmt(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    trackFill.style.width       = pct + '%';
    trackThumb.style.left       = pct + '%';
    timeEl.textContent          = fmt(audio.currentTime);
  });

  track?.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = track.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = pct * audio.duration;
  });
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Ensure exit overlay is hidden on page load
  const overlay = DOM.exitOverlay();
  if (overlay) overlay.hidden = true;

  initScreen1();
  initScreen2();
  initScreen3();
  initScreen4();
  initScreen5();
  initAudioPlayer();

  updateProgress();
  goToScreen(1);
});
