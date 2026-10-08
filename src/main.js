/**
 * KALENDAR MALAYSIA PRO - MAIN JAVASCRIPT LOGIC
 * Powered by pure Vanilla JS & Local JSON datasets
 */

// Application State
const state = {
  year: 2026,
  month: 10, // Default to October 2026 to match user's screenshot
  selectedRegion: 'ALL',
  locale: 'ms', // 'ms', 'en', 'zh_cn'
  currentTab: 'calendar',
  calendarViewMode: 'kuda', // 'kuda' (traditional table) or 'grid' (modern)
  showHorseRacing: true,
  schoolGroup: 'KA', // 'KA' or 'KB'
  calendarData: null,
  festData: null,
  longWeekendData: null,
  schoolDataKA: null,
  schoolDataKB: null,
  paySchedule: null,
  pensionSchedule: null,
  zodiacData: null,
  regions: [],
  userEvents: JSON.parse(localStorage.getItem('my_cal_events') || '[]'),
  selectedDayDetails: null
};

// Month Names localized
const MONTH_NAMES = {
  ms: ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  zh_cn: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
};

const DAY_NAMES = {
  ms: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  zh_cn: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('month')) {
    state.month = Math.min(12, Math.max(1, parseInt(urlParams.get('month'), 10)));
  }
  if (urlParams.has('year')) {
    state.year = parseInt(urlParams.get('year'), 10);
  }
  setupTheme();
  if (urlParams.has('theme')) {
    setTheme(urlParams.get('theme'));
  }
  setupEventListeners();
  await loadGlobalData();
  await loadYearData(state.year);
  renderAll();
});

// Load static global data (regions, pay schedule, pension)
async function loadGlobalData() {
  try {
    const [regRes, payRes, penRes] = await Promise.all([
      fetch('/data/regions.json'),
      fetch('/data/payschedule.json'),
      fetch('/data/pensionschedule.json')
    ]);
    state.regions = await regRes.json();
    state.paySchedule = await payRes.json();
    state.pensionSchedule = await penRes.json();
  } catch (err) {
    console.error('Error loading global data:', err);
  }
}

// Load data specific to selected year
async function loadYearData(year) {
  const shortYear = String(year).slice(-2);
  try {
    const [calRes, festRes, lwRes, shKaRes, shKbRes, zodRes] = await Promise.all([
      fetch(`/data/${shortYear}_cal.json`).then(r => r.ok ? r.json() : null),
      fetch(`/data/${shortYear}_fest.json`).then(r => r.ok ? r.json() : null),
      fetch(`/data/${shortYear}_longweekend.json`).then(r => r.ok ? r.json() : null),
      fetch(`/data/${shortYear}_sh_KA.json`).then(r => r.ok ? r.json() : null),
      fetch(`/data/${shortYear}_sh_KB.json`).then(r => r.ok ? r.json() : null),
      fetch(`/data/${shortYear}_zodiac.json`).then(r => r.ok ? r.json() : null)
    ]);

    state.calendarData = calRes;
    state.festData = festRes;
    state.longWeekendData = lwRes;
    state.schoolDataKA = shKaRes;
    state.schoolDataKB = shKbRes;
    state.zodiacData = zodRes;
  } catch (err) {
    console.error(`Error loading data for year ${year}:`, err);
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Theme Switching
  document.getElementById('themeDark').addEventListener('click', () => setTheme('dark'));
  document.getElementById('themeLight').addEventListener('click', () => setTheme('light'));
  document.getElementById('themeKuda').addEventListener('click', () => setTheme('kuda'));

  // Region Filter
  document.getElementById('stateFilter').addEventListener('change', (e) => {
    state.selectedRegion = e.target.value;
    renderCalendar();
    renderLongWeekends();
  });

  // Language Selector
  document.getElementById('langSelect').addEventListener('change', (e) => {
    state.locale = e.target.value;
    renderAll();
  });

  // Main Tabs Switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      state.currentTab = tabId;
      document.getElementById(`${tabId}View`).classList.add('active');

      if (tabId === 'salary') renderSalaryAndPension();
      if (tabId === 'longweekend') renderLongWeekends();
      if (tabId === 'school') renderSchoolHolidays();
      if (tabId === 'notes') renderUserEvents();
    });
  });

  // Calendar Navigation functions
  window.goToPrevMonth = function() {
    if (state.month === 1) {
      if (state.year > 2024) {
        changeYear(state.year - 1, 12);
      }
    } else {
      state.month--;
      renderCalendar();
    }
  };

  window.goToNextMonth = function() {
    if (state.month === 12) {
      if (state.year < 2027) {
        changeYear(state.year + 1, 1);
      }
    } else {
      state.month++;
      renderCalendar();
    }
  };

  document.getElementById('prevMonthBtn').addEventListener('click', window.goToPrevMonth);
  document.getElementById('nextMonthBtn').addEventListener('click', window.goToNextMonth);

  // Touch swipe support for switching months on mobile & tablet
  const monthHeading = document.querySelector('.current-month-heading');
  let touchStartX = 0;
  let touchStartY = 0;

  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Horizontal swipe threshold: at least 45px and dominant over vertical
    if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX < 0) {
        window.goToNextMonth();
      } else {
        window.goToPrevMonth();
      }
    }
    touchStartX = 0;
    touchStartY = 0;
  };

  if (monthHeading) {
    monthHeading.addEventListener('touchstart', handleTouchStart, { passive: true });
    monthHeading.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  // Touch swipe on calendar container in both Kuda & Grid view
  const calendarArea = document.getElementById('calendarContentArea');
  const calendarWrapper = document.getElementById('calendarWrapper');
  const attachSwipe = (el) => {
    if (!el) return;
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
  };
  attachSwipe(calendarArea);
  attachSwipe(calendarWrapper);

  // Keyboard Arrow Navigation across calendar cells
  const handleCalendarGridKeydown = (e) => {
    const active = document.activeElement;
    if (!active || (!active.classList.contains('cell-day') && !active.classList.contains('grid-cell') && active.tagName !== 'TD')) return;
    const container = document.getElementById('calendarContentArea');
    if (!container) return;
    const cells = Array.from(container.querySelectorAll('td[tabindex="0"], .grid-cell[tabindex="0"]'));
    const currentIndex = cells.indexOf(active);
    if (currentIndex === -1) return;

    let targetIndex = -1;
    if (e.key === 'ArrowLeft') targetIndex = currentIndex - 1;
    else if (e.key === 'ArrowRight') targetIndex = currentIndex + 1;
    else if (e.key === 'ArrowUp') targetIndex = currentIndex - 7;
    else if (e.key === 'ArrowDown') targetIndex = currentIndex + 7;
    else if (e.key === 'Home') targetIndex = 0;
    else if (e.key === 'End') targetIndex = cells.length - 1;

    if (targetIndex >= 0 && targetIndex < cells.length) {
      e.preventDefault();
      cells[targetIndex].focus();
    }
  };

  if (calendarWrapper) calendarWrapper.addEventListener('keydown', handleCalendarGridKeydown);
  if (calendarArea) calendarArea.addEventListener('keydown', handleCalendarGridKeydown);

  // Keyboard Navigation (Left/Right arrows for months, Esc for modal)
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('dayModal');
    const isModalOpen = modal && modal.style.display !== 'none';

    if (e.key === 'Escape' && isModalOpen) {
      closeModal();
      return;
    }

    const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
    if (!isModalOpen && !isTyping) {
      if (e.key === 'ArrowLeft') {
        window.goToPrevMonth();
      } else if (e.key === 'ArrowRight') {
        window.goToNextMonth();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        const todayBtn = document.getElementById('todayBtn');
        if (todayBtn) todayBtn.click();
      } else if (e.key === 'p' || e.key === 'P') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          window.print();
        }
      }
    }
  });

  // Print button listener
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  document.getElementById('todayBtn').addEventListener('click', () => {
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    if (curYear >= 2024 && curYear <= 2027) {
      changeYear(curYear, curMonth);
    } else {
      changeYear(2026, 1);
    }
  });

  // Year Pills
  document.querySelectorAll('.year-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const selectedYear = parseInt(pill.dataset.year);
      changeYear(selectedYear, state.month);
    });
  });

  // View Mode Switcher (Kalendar Kuda vs Grid Moden)
  const viewKudaBtn = document.getElementById('viewKudaBtn');
  const viewGridBtn = document.getElementById('viewGridBtn');
  if (viewKudaBtn && viewGridBtn) {
    viewKudaBtn.addEventListener('click', () => {
      state.calendarViewMode = 'kuda';
      viewKudaBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      updateFilterIndicator();
      renderCalendar();
    });
    viewGridBtn.addEventListener('click', () => {
      state.calendarViewMode = 'grid';
      viewGridBtn.classList.add('active');
      viewKudaBtn.classList.remove('active');
      updateFilterIndicator();
      renderCalendar();
    });
  }

  // Horse Racing Graphic Toggle
  const toggleHorseRace = document.getElementById('toggleHorseRace');
  if (toggleHorseRace) {
    toggleHorseRace.addEventListener('change', (e) => {
      state.showHorseRacing = e.target.checked;
      updateFilterIndicator();
      renderCalendar();
    });
  }

  // Search Holiday Input
  const searchInput = document.getElementById('holidaySearchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim().toLowerCase();
    clearBtn.style.display = val ? 'block' : 'none';
    updateFilterIndicator();
    filterCalendarSearch(val);
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    updateFilterIndicator();
    renderCalendar();
  });

  // Mobile Collapsible Toolbar Drawer Toggle (Autohide to prevent mobile clutter)
  const toggleFilterBtn = document.getElementById('toggleFilterBtn');
  const toolbarCollapsible = document.getElementById('toolbarCollapsible');
  const toggleFilterArrow = document.getElementById('toggleFilterArrow');

  if (toggleFilterBtn && toolbarCollapsible) {
    toggleFilterBtn.addEventListener('click', () => {
      const isOpen = toolbarCollapsible.classList.toggle('is-open');
      toggleFilterBtn.classList.toggle('active', isOpen);
      toggleFilterBtn.setAttribute('aria-expanded', String(isOpen));
      if (toggleFilterArrow) {
        toggleFilterArrow.textContent = isOpen ? '▴' : '▾';
      }
    });
  }

  // School Group Buttons
  document.getElementById('btnGroupA').addEventListener('click', (e) => {
    state.schoolGroup = 'KA';
    document.getElementById('btnGroupA').classList.add('active');
    document.getElementById('btnGroupB').classList.remove('active');
    renderSchoolHolidays();
  });

  document.getElementById('btnGroupB').addEventListener('click', (e) => {
    state.schoolGroup = 'KB';
    document.getElementById('btnGroupB').classList.add('active');
    document.getElementById('btnGroupA').classList.remove('active');
    renderSchoolHolidays();
  });

  // Add Note Form
  document.getElementById('addNoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('noteDate').value;
    const title = document.getElementById('noteTitle').value.trim();
    const category = document.getElementById('noteCategory').value;

    if (!date || !title) return;

    state.userEvents.push({
      id: Date.now(),
      date,
      title,
      category
    });

    localStorage.setItem('my_cal_events', JSON.stringify(state.userEvents));
    document.getElementById('noteTitle').value = '';
    renderUserEvents();
    renderCalendar();
  });

  // Modal Handlers
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('modalDoneBtn').addEventListener('click', closeModal);
  document.getElementById('dayModal').addEventListener('click', (e) => {
    if (e.target.id === 'dayModal') closeModal();
  });

  // Mobile touch drag-down to dismiss bottom sheet modal
  const modalCard = document.querySelector('.modal-card');
  let modalTouchStartY = 0;
  if (modalCard) {
    modalCard.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        modalTouchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    modalCard.addEventListener('touchend', (e) => {
      if (!modalTouchStartY) return;
      const modalTouchEndY = e.changedTouches[0].clientY;
      const diffY = modalTouchEndY - modalTouchStartY;
      const modalBody = document.querySelector('.modal-body');
      if (diffY > 80 && (!modalBody || modalBody.scrollTop <= 5)) {
        closeModal();
      }
      modalTouchStartY = 0;
    }, { passive: true });
  }

  // Quick note from modal
  document.getElementById('modalQuickAddBtn').addEventListener('click', () => {
    const input = document.getElementById('modalQuickNoteInput');
    const val = input.value.trim();
    if (!val || !state.selectedDayDetails) return;

    const { year, month, day } = state.selectedDayDetails;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    state.userEvents.push({
      id: Date.now(),
      date: dateStr,
      title: val,
      category: 'personal'
    });
    localStorage.setItem('my_cal_events', JSON.stringify(state.userEvents));
    input.value = '';
    renderModalUserEvents(dateStr);
    renderCalendar();
  });

  // Export iCal from modal
  document.getElementById('modalExportIcalBtn').addEventListener('click', () => {
    if (!state.selectedDayDetails) return;
    exportDayAsIcal(state.selectedDayDetails);
  });
}

// Change active Year
async function changeYear(year, targetMonth = 1) {
  state.year = year;
  state.month = targetMonth;

  document.querySelectorAll('.year-pill').forEach(p => {
    p.classList.toggle('active', parseInt(p.dataset.year) === year);
  });

  await loadYearData(year);
  renderAll();
}

// Theme handling
function setupTheme() {
  const saved = localStorage.getItem('cal_theme') || 'dark';
  setTheme(saved);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cal_theme', theme);

  document.getElementById('themeDark').classList.toggle('active', theme === 'dark');
  document.getElementById('themeLight').classList.toggle('active', theme === 'light');
  document.getElementById('themeKuda').classList.toggle('active', theme === 'kuda');
}

// Master Render Function
function renderAll() {
  renderMonthPills();
  renderCalendar();
  renderLongWeekends();
  renderSchoolHolidays();
  renderSalaryAndPension();
  renderUserEvents();
}

// Render Month Quick Jump Pills
function renderMonthPills() {
  const container = document.getElementById('monthPillsContainer');
  container.innerHTML = '';

  const names = MONTH_NAMES[state.locale] || MONTH_NAMES.ms;
  for (let m = 1; m <= 12; m++) {
    const pill = document.createElement('button');
    pill.className = `month-pill ${m === state.month ? 'active' : ''}`;
    pill.textContent = names[m - 1];
    pill.addEventListener('click', () => {
      state.month = m;
      renderCalendar();
    });
    container.appendChild(pill);
  }
}

// Active Filter & Option Indicator Badge
function updateFilterIndicator() {
  const filterActiveDot = document.getElementById('filterActiveDot');
  const searchInput = document.getElementById('holidaySearchInput');
  if (!filterActiveDot) return;
  const isYearModified = state.year !== 2026;
  const isSearchActive = searchInput && searchInput.value.trim().length > 0;
  const isViewModified = state.calendarViewMode !== 'kuda';
  const isHorseModified = !state.showHorseRacing;
  const hasActiveFilters = isYearModified || isSearchActive || isViewModified || isHorseModified;
  filterActiveDot.style.display = hasActiveFilters ? 'inline-block' : 'none';
}

// Master Calendar Render Router
function renderCalendar() {
  updateFilterIndicator();

  // Update header text
  const monthName = (MONTH_NAMES[state.locale] || MONTH_NAMES.ms)[state.month - 1];
  document.getElementById('currentMonthYear').textContent = `${monthName} ${state.year}`;

  // Update active month pill & auto-scroll into view for touch devices
  document.querySelectorAll('.month-pill').forEach((pill, idx) => {
    const isActive = (idx + 1 === state.month);
    pill.classList.toggle('active', isActive);
    if (isActive && window.innerWidth < 900) {
      pill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  });

  // Find month data in calendarData
  const monthData = state.calendarData?.calMonths?.find(m => m.month === state.month && m.year === state.year);
  if (monthData) {
    document.getElementById('currentHijriTitle').textContent = monthData.hijriLabelTitle || monthData.hijriLabelDescription || '';
  }

  const container = document.getElementById('calendarContentArea');
  if (!container) return;
  container.innerHTML = '';

  if (state.calendarViewMode === 'kuda') {
    renderKudaCalendar(container, monthData);
  } else {
    renderGridCalendar(container, monthData);
  }

  renderZodiacBar();
}

// --------------------------------------------------------------------------
// 1. TRADITIONAL KALENDAR KUDA VIEW (Original Calendar2U Table Layout)
// --------------------------------------------------------------------------
function renderKudaCalendar(container, monthData) {
  const tableContainer = document.createElement('div');
  tableContainer.className = 'kuda-table-container';

  const table = document.createElement('table');
  table.className = 'kuda-table';

  // Authentic Kalendar Kuda Top Header Banner
  const banner = document.createElement('div');
  banner.className = 'kuda-banner-header';
  const zhLabel = monthData?.chineseLunarLabel || '';
  const mTitle = `${MONTH_NAMES.en[state.month - 1].toUpperCase()} ${state.year}`;
  const hijriDesc = monthData?.hijriLabelDescription || monthData?.hijriLabelTitle || '';
  const tamilDesc = monthData?.tamilLabelTitle || '';

  banner.innerHTML = `
    <div class="kuda-banner-zh">${zhLabel}</div>
    <div class="kuda-banner-title">${mTitle}</div>
    <div class="kuda-banner-hijri">${hijriDesc}${tamilDesc ? `<span class="kuda-banner-tamil">${tamilDesc}</span>` : ''}</div>
  `;
  tableContainer.appendChild(banner);

  // Calculate all weeks in the month (Sunday-to-Saturday columns matching authentic Kalendar Kuda)
  const weeks = [];
  const daysInMonth = new Date(state.year, state.month, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(state.year, state.month - 1, d);
    // Find Sunday of this week:
    const dayOfWeek = curDate.getDay(); // 0 is Sun, 1 is Mon... 6 is Sat
    const sunDate = new Date(state.year, state.month - 1, d - dayOfWeek);
    const sunKey = `${sunDate.getFullYear()}-${sunDate.getMonth()}-${sunDate.getDate()}`;

    let weekObj = weeks.find(w => w.key === sunKey);
    if (!weekObj) {
      const weekNum = getKudaWeekNumber(sunDate);
      weekObj = {
        key: sunKey,
        sunDate: sunDate,
        weekNum: weekNum,
        days: {} // rowIdx (0=Sun, 1=Mon, ..., 6=Sat) -> Date obj
      };
      // Populate all 7 days for this week from Sunday (row 0) to Saturday (row 6):
      for (let offset = 0; offset < 7; offset++) {
        const dayDate = new Date(sunDate.getFullYear(), sunDate.getMonth(), sunDate.getDate() + offset);
        weekObj.days[offset] = dayDate;
      }
      weeks.push(weekObj);
    }
  }

  // 1. Table Header Row (OCTOBER, WEEK 40, WEEK 41, ...)
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');

  const thCorner = document.createElement('th');
  thCorner.className = 'kuda-th-corner';
  thCorner.textContent = MONTH_NAMES.en[state.month - 1].toUpperCase();
  trHead.appendChild(thCorner);

  weeks.forEach(w => {
    const thWeek = document.createElement('th');
    thWeek.className = 'kuda-th-week';
    thWeek.textContent = `WEEK ${w.weekNum}`;
    trHead.appendChild(thWeek);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  // 2. Table Body (7 Rows: Row 0=Sun, 1=Mon, ..., 6=Sat)
  const tbody = document.createElement('tbody');

  const weekdayInfo = [
    { key: 'sun', hdrClass: 'sun-hdr', main: 'SUN', zh: '星期日', ms: 'Ahad', ta: 'ஞாயிறு', dow: 1 },
    { key: 'mon', hdrClass: 'mon-hdr', main: 'MON', zh: '星期一', ms: 'Isnin', ta: 'திங்கள்', dow: 2 },
    { key: 'tue', hdrClass: 'tue-hdr', main: 'TUE', zh: '星期二', ms: 'Selasa', ta: 'செவ்வாய்', dow: 3 },
    { key: 'wed', hdrClass: 'wed-hdr', main: 'WED', zh: '星期三', ms: 'Rabu', ta: 'புதன்', dow: 4 },
    { key: 'thu', hdrClass: 'thu-hdr', main: 'THU', zh: '星期四', ms: 'Khamis', ta: 'வியாழன்', dow: 5 },
    { key: 'fri', hdrClass: 'fri-hdr', main: 'FRI', zh: '星期五', ms: 'Jumaat', ta: 'வெள்ளி', dow: 6 },
    { key: 'sat', hdrClass: 'sat-hdr', main: 'SAT', zh: '星期六', ms: 'Sabtu', ta: 'சனி', dow: 7 }
  ];

  for (let rowIdx = 0; rowIdx < 7; rowIdx++) {
    const tr = document.createElement('tr');
    const info = weekdayInfo[rowIdx];

    // Left Weekday Header Pill
    const tdPill = document.createElement('td');
    tdPill.className = 'kuda-td-weekday';
    tdPill.innerHTML = `
      <div class="kuda-weekday-pill ${info.hdrClass}">
        <span class="chinese-sub">${info.zh}</span>
        <span class="main-day">${info.main}</span>
        <div class="sub-days">
          <span>${info.ms}</span>
          <span>${info.ta}</span>
        </div>
      </div>
    `;
    tr.appendChild(tdPill);

    // Day Cells for each week column
    weeks.forEach(w => {
      const dayDate = w.days[rowIdx];
      const isOtherMonth = (dayDate.getMonth() + 1 !== state.month) || (dayDate.getFullYear() !== state.year);
      const dayNum = dayDate.getDate();

      const now = new Date();
      const isToday = now.getFullYear() === dayDate.getFullYear() &&
                      now.getMonth() === dayDate.getMonth() &&
                      now.getDate() === dayDate.getDate();

      // Find cell detail
      let cellDetail = null;
      if (!isOtherMonth) {
        cellDetail = monthData?.calCells?.find(c => c.day === dayNum && c.month === state.month);
      } else {
        const adjMonthData = state.calendarData?.calMonths?.find(m => m.month === (dayDate.getMonth() + 1) && m.year === dayDate.getFullYear());
        cellDetail = adjMonthData?.calCells?.find(c => c.day === dayNum);
      }

      const tdCell = createKudaDayCell(dayDate, isOtherMonth, rowIdx, isToday, cellDetail);
      tr.appendChild(tdCell);
    });

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);
  container.appendChild(tableContainer);

  // Fade out scroll hint when user scrolls table horizontally
  tableContainer.addEventListener('scroll', () => {
    const hint = document.getElementById('kudaScrollHint');
    if (hint && tableContainer.scrollLeft > 25) {
      hint.style.opacity = '0';
      hint.style.pointerEvents = 'none';
      hint.style.transition = 'opacity 0.3s ease';
    }
  }, { passive: true });
}

// Single Cell in Kalendar Kuda Table
function createKudaDayCell(dayDate, isOtherMonth, rowIdx, isToday, cellDetail) {
  const td = document.createElement('td');
  td.className = 'kuda-day-cell';
  if (isOtherMonth) {
    td.classList.add('other-month', 'blank-cell');
    if (rowIdx === 6) {
      td.innerHTML = `
        <div class="cell-kuda-brand">
          <img src="/logo.png" class="kuda-brand-logo" alt="Kalendar" />
          <span class="kuda-brand-text">MALAYSIA</span>
        </div>
      `;
    }
    return td;
  }
  if (isToday) td.classList.add('is-today');
  if (rowIdx === 0) td.classList.add('is-sun');
  if (rowIdx === 5) td.classList.add('is-fri');
  if (rowIdx === 6) td.classList.add('is-sat');

  const dayNum = dayDate.getDate();
  const dateKey = `${dayDate.getFullYear()}${String(dayDate.getMonth() + 1).padStart(2, '0')}${String(dayNum).padStart(2, '0')}`;
  const isPayDay = checkIsPayday(dateKey);
  const isSchoolHoliday = (cellDetail?.isSchoolHoliday === true) || checkIsSchoolHoliday(dateKey, state.schoolGroup);

  // Yellow petak for School Holiday
  if (isSchoolHoliday && !isOtherMonth) {
    td.classList.add('is-school-holiday');
  }

  // 1. Hijri Date (Top-Right Cyan)
  if (cellDetail?.hijriDate?.displayText) {
    const hijriEl = document.createElement('div');
    hijriEl.className = 'cell-hijri';
    hijriEl.textContent = cellDetail.hijriDate.displayText;
    td.appendChild(hijriEl);
  }

  // 2. Vertical Chinese Lunar Date (Left Column Red)
  if (cellDetail?.chineseLunarDate?.displayText) {
    const lunarEl = document.createElement('div');
    lunarEl.className = 'cell-lunar-vertical';
    lunarEl.textContent = cellDetail.chineseLunarDate.displayText;
    td.appendChild(lunarEl);
  }

  // 3. Tamil Date (Bottom-Left Cyan)
  if (cellDetail?.tamilDate?.displayText) {
    const tamilEl = document.createElement('div');
    tamilEl.className = 'cell-tamil';
    tamilEl.textContent = cellDetail.tamilDate.displayText;
    td.appendChild(tamilEl);
  }

  // 4. Payday Badge (Floating Top-Left)
  if (isPayDay) {
    const payBadge = document.createElement('div');
    payBadge.className = 'cell-payday-badge';
    payBadge.innerHTML = `<img src="/festivals/payday_thumb.png" class="cell-payday-icon-img" alt="Gaji" /><span>Gaji</span>`;
    td.appendChild(payBadge);
  }

  // Event / Calendar Blue Marker icon at top (as seen on authentic Kalendar Kuda)
  const activeFests = cellDetail?.festDays?.filter(f => isHolidayApplicable(f, state.selectedRegion)) || [];
  if ((activeFests.length > 0 || isSchoolHoliday || isPayDay) && !isOtherMonth) {
    const markerEl = document.createElement('div');
    markerEl.className = 'cell-event-marker';
    markerEl.title = isSchoolHoliday ? 'Cuti Sekolah' : 'Cuti / Acara';
    markerEl.innerHTML = `<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>`;
    td.appendChild(markerEl);
  }

  // 5. Center Media: Horse Racing Graphic, Festival Illustration, or Payday Graphic
  const centerMedia = document.createElement('div');
  centerMedia.className = 'cell-center-media';
  let hasCenterContent = false;

  // Check applicable festival/holiday with beautiful transparent illustration
  if (activeFests.length > 0) {
    const primaryFest = activeFests[0];
    const festBadge = document.createElement('div');
    festBadge.className = 'cell-fest-badge';
    const festTitle = getLocalizedFestTitle(primaryFest);

    // Render transparent cropped festival image if available
    if (primaryFest.imageName) {
      const festImg = document.createElement('img');
      festImg.src = `/festivals/${primaryFest.imageName}.png`;
      festImg.className = 'cell-fest-img';
      festImg.alt = festTitle;
      festImg.loading = 'lazy';
      festBadge.appendChild(festImg);
    }

    const festTitleSpan = document.createElement('span');
    festTitleSpan.className = 'cell-fest-title';
    festTitleSpan.title = festTitle;
    festTitleSpan.textContent = festTitle;
    festBadge.appendChild(festTitleSpan);

    centerMedia.appendChild(festBadge);
    hasCenterContent = true;
  }

  // If Payday and no festival on non-race days, showcase prominent Payday illustration
  if (isPayDay && !hasCenterContent && rowIdx !== 0 && rowIdx !== 6) {
    const payMedia = document.createElement('div');
    payMedia.className = 'cell-fest-badge cell-payday-feature';
    payMedia.innerHTML = `
      <img src="/festivals/payday_thumb.png" class="cell-fest-img payday-center-img" alt="Gaji" />
      <span class="cell-fest-title payday-center-text">Gaji Awam</span>
    `;
    centerMedia.appendChild(payMedia);
    hasCenterContent = true;
  }

  // Horse Racing Jockey Icon on Saturdays (rowIdx 6) and Sundays (rowIdx 0)
  if (state.showHorseRacing && (rowIdx === 0 || rowIdx === 6) && !hasCenterContent) {
    const horseImg = document.createElement('img');
    horseImg.src = '/horse_racing@2x.png';
    horseImg.className = 'kuda-horse-img';
    horseImg.alt = 'Lumba Kuda';
    centerMedia.appendChild(horseImg);
    hasCenterContent = true;
  }

  if (hasCenterContent) {
    td.appendChild(centerMedia);
  }

  // 6. Day Number (Bottom-Right Bold, enlarged for easy reading)
  const numEl = document.createElement('div');
  numEl.className = 'cell-day-num';
  numEl.textContent = dayNum;
  td.appendChild(numEl);

  // Accessibility & Keyboard Navigation (WCAG AA/AAA)
  td.setAttribute('tabindex', '0');
  td.setAttribute('role', 'gridcell');
  if (cellDetail) {
    const holidayStr = cellDetail.isHoliday ? `, Cuti: ${cellDetail.holidayName}` : '';
    const payStr = isPayDay ? ', Hari Gaji Penjawat Awam' : '';
    td.setAttribute('aria-label', `${cellDetail.day} ${MONTH_NAMES[state.locale] ? MONTH_NAMES[state.locale][state.month - 1] : ''} ${state.year}${holidayStr}${payStr}`);
  }

  // Click & Keyboard handler to open details
  td.addEventListener('click', () => {
    if (cellDetail) {
      openDayModal(cellDetail, isPayDay);
    }
  });

  td.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (cellDetail) openDayModal(cellDetail, isPayDay);
    }
  });

  return td;
}

// --------------------------------------------------------------------------
// 2. MODERN GRID VIEW
// --------------------------------------------------------------------------
function renderGridCalendar(container, monthData) {
  // Weekday Headers
  const weekdaysGrid = document.createElement('div');
  weekdaysGrid.className = 'weekdays-grid';
  const dayNames = DAY_NAMES[state.locale] || DAY_NAMES.ms;
  dayNames.forEach((dName, idx) => {
    const el = document.createElement('div');
    el.className = 'weekday';
    if (idx === 0) el.classList.add('sun');
    if (idx === 5) el.classList.add('fri');
    if (idx === 6) el.classList.add('sat');
    el.textContent = dName;
    weekdaysGrid.appendChild(el);
  });
  container.appendChild(weekdaysGrid);

  // Days Grid
  const daysGrid = document.createElement('div');
  daysGrid.className = 'days-grid';
  daysGrid.id = 'calendarDaysGrid';

  const firstDayOfWeek = new Date(state.year, state.month - 1, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(state.year, state.month, 0).getDate();
  const prevMonthDays = new Date(state.year, state.month - 1, 0).getDate();

  // 1. Preceding days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthDays - i;
    const cell = createDayCell(dayNum, true);
    daysGrid.appendChild(cell);
  }

  // Today marker
  const now = new Date();
  const isCurrentYear = now.getFullYear() === state.year;
  const isCurrentMonth = now.getMonth() + 1 === state.month;
  const todayDay = now.getDate();

  // 2. Current Month Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = (firstDayOfWeek + d - 1) % 7;
    const isToday = isCurrentYear && isCurrentMonth && d === todayDay;
    const cellDetail = monthData?.calCells?.find(c => c.day === d && c.month === state.month);

    const cell = createDayCell(d, false, dayOfWeek, isToday, cellDetail);
    daysGrid.appendChild(cell);
  }

  // 3. Following days
  const totalRendered = firstDayOfWeek + daysInMonth;
  const remainingBoxes = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
  for (let i = 1; i <= remainingBoxes; i++) {
    const cell = createDayCell(i, true);
    daysGrid.appendChild(cell);
  }

  container.appendChild(daysGrid);
}

// Single Day Cell for Modern Grid View
function createDayCell(dayNum, isOtherMonth, dayOfWeek = 0, isToday = false, cellDetail = null) {
  const cell = document.createElement('div');
  cell.className = 'day-cell';
  if (isOtherMonth) cell.classList.add('other-month');
  if (isToday) cell.classList.add('is-today');

  if (dayOfWeek === 0) cell.classList.add('is-sun');
  if (dayOfWeek === 5) cell.classList.add('is-fri');
  if (dayOfWeek === 6) cell.classList.add('is-sat');

  const dateKey = `${state.year}${String(state.month).padStart(2, '0')}${String(dayNum).padStart(2, '0')}`;
  const isSchoolHoliday = (cellDetail?.isSchoolHoliday === true) || checkIsSchoolHoliday(dateKey, state.schoolGroup);
  if (isSchoolHoliday && !isOtherMonth) {
    cell.classList.add('is-school-holiday');
  }

  // Header: Number + Subdates
  const header = document.createElement('div');
  header.className = 'day-header';

  const numSpan = document.createElement('span');
  numSpan.className = 'day-number';
  numSpan.textContent = dayNum;
  header.appendChild(numSpan);

  if (!isOtherMonth && cellDetail) {
    const subdates = document.createElement('div');
    subdates.className = 'day-subdates';

    if (cellDetail.hijriDate?.displayText) {
      const hSpan = document.createElement('span');
      hSpan.className = 'subdate-hijri';
      hSpan.textContent = cellDetail.hijriDate.displayText;
      subdates.appendChild(hSpan);
    }

    if (cellDetail.chineseLunarDate?.day) {
      const lSpan = document.createElement('span');
      lSpan.className = 'subdate-lunar';
      lSpan.textContent = cellDetail.chineseLunarDate.day;
      subdates.appendChild(lSpan);
    }
    header.appendChild(subdates);
  }
  cell.appendChild(header);

  // Horse Racing Jockey Icon for Saturdays & Sundays in modern grid
  if (state.showHorseRacing && !isOtherMonth && (dayOfWeek === 0 || dayOfWeek === 6)) {
    const horseImg = document.createElement('img');
    horseImg.src = '/horse_racing@2x.png';
    horseImg.className = 'grid-horse-img';
    horseImg.alt = 'Lumba Kuda';
    cell.appendChild(horseImg);
  }

  // Indicators: Holidays, Payday, School, User events
  if (!isOtherMonth && cellDetail) {
    const indicators = document.createElement('div');
    indicators.className = 'day-indicators';

    // 1. Holidays (Filtered by selected state)
    if (cellDetail.festDays && cellDetail.festDays.length > 0) {
      cellDetail.festDays.forEach(fest => {
        if (isHolidayApplicable(fest, state.selectedRegion)) {
          const badge = document.createElement('span');
          badge.className = `badge-tag ${fest.isNationalHoliday ? 'holiday-national' : 'holiday-state'}`;
          if (fest.imageName) {
            badge.innerHTML = `<img src="/festivals/${fest.imageName}.png" class="badge-mini-img" alt="" /> <span>${getLocalizedFestTitle(fest)}</span>`;
          } else {
            badge.textContent = getLocalizedFestTitle(fest);
          }
          indicators.appendChild(badge);
        }
      });
    }

    // 2. Payday check
    const isPayDay = checkIsPayday(dateKey);
    if (isPayDay) {
      const payBadge = document.createElement('span');
      payBadge.className = 'badge-tag payday-tag';
      payBadge.innerHTML = `<img src="/festivals/payday_thumb.png" class="badge-mini-img" alt="" /> <span>Gaji Awam</span>`;
      indicators.appendChild(payBadge);
    }

    // 3. School Holiday check
    if (isSchoolHoliday) {
      const schBadge = document.createElement('span');
      schBadge.className = 'badge-tag school-tag';
      schBadge.innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg><span>Cuti Sekolah</span>`;
      indicators.appendChild(schBadge);
    }

    // 4. User events for this day
    const dateFormatted = `${state.year}-${String(state.month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const userEvents = state.userEvents.filter(e => e.date === dateFormatted);
    if (userEvents.length > 0) {
      const uBadge = document.createElement('span');
      uBadge.className = 'badge-tag user-event';
      uBadge.innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span>${userEvents[0].title}</span>`;
      indicators.appendChild(uBadge);
    }

    cell.appendChild(indicators);

    // Accessibility & Keyboard Navigation (WCAG AA/AAA)
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('role', 'gridcell');
    if (cellDetail) {
      const holidayStr = cellDetail.isHoliday ? `, Cuti: ${cellDetail.holidayName}` : '';
      const payStr = isPayDay ? ', Hari Gaji Penjawat Awam' : '';
      cell.setAttribute('aria-label', `${cellDetail.day} ${MONTH_NAMES[state.locale] ? MONTH_NAMES[state.locale][state.month - 1] : ''} ${state.year}${holidayStr}${payStr}`);
    }

    // Click & Keyboard handler to open details
    cell.addEventListener('click', () => {
      openDayModal(cellDetail, isPayDay);
    });

    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDayModal(cellDetail, isPayDay);
      }
    });
  }

  return cell;
}

// --------------------------------------------------------------------------
// 3. 12 CHINESE ZODIAC ANIMALS FOOTER BAR (MINIMALIST KALENDAR KUDA STRIP)
// --------------------------------------------------------------------------
function renderZodiacBar() {
  const container = document.getElementById('zodiacScrollContainer');
  const label = document.getElementById('zodiacYearLabel');
  if (!container) return;

  container.innerHTML = '';

  const monthZodiacObj = state.zodiacData?.find(z => z.month === state.month && z.year === state.year) || state.zodiacData?.[0];
  const list = monthZodiacObj?.chineseZodiacs || [];

  if (list.length === 0) {
    const sec = document.getElementById('zodiacSection');
    if (sec) sec.style.display = 'none';
    return;
  }
  const sec = document.getElementById('zodiacSection');
  if (sec) sec.style.display = 'block';

  // Find active zodiac
  const activeZodiac = list.find(z => z.isThisYearZodiac) || list.find(z => z.zodiacName === 'Horse');
  if (label && activeZodiac) {
    label.textContent = `Tahun ${activeZodiac.zodiacName} ${activeZodiac.zodiacChineseName} ${state.year}`;
  }

  list.forEach(z => {
    const card = document.createElement('div');
    const isActiveYear = z.isThisYearZodiac || (state.year === 2026 && z.zodiacName === 'Horse');
    card.className = `zodiac-card zodiac-compact-card ${isActiveYear ? 'is-active-year' : ''}`;

    const iconName = z.zodiacName.toLowerCase();

    card.innerHTML = `
      <img src="/icons/ic_zodiac_${iconName}.png" class="zodiac-mini-icon" alt="${z.zodiacName}" />
      <div class="zodiac-mini-title">
        <span class="zmt-name">${z.zodiacName}</span>
        <span class="zmt-zh">${z.zodiacChineseName}</span>
      </div>
      <div class="zodiac-table-header">
        <span>年 岁</span>
        <span>年 岁</span>
      </div>
      <div class="zodiac-table-body">
        <div class="zmt-row">
          <span class="zmt-cell-yr">${z.year1}</span><span class="zmt-cell-age">${z.age1}</span>
          <span class="zmt-cell-yr">${z.year4}</span><span class="zmt-cell-age">${z.age4}</span>
        </div>
        <div class="zmt-row">
          <span class="zmt-cell-yr">${z.year2}</span><span class="zmt-cell-age">${z.age2}</span>
          <span class="zmt-cell-yr">${z.year5}</span><span class="zmt-cell-age">${z.age5}</span>
        </div>
        <div class="zmt-row">
          <span class="zmt-cell-yr">${z.year3}</span><span class="zmt-cell-age">${z.age3}</span>
          <span class="zmt-cell-yr">${z.year6}</span><span class="zmt-cell-age">${z.age6}</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Auto-scroll active zodiac into view on mobile (< 900px)
  const activeCard = container.querySelector('.is-active-year');
  if (activeCard && window.innerWidth < 900) {
    setTimeout(() => {
      activeCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, 100);
  }
}

// Calculate standard ISO Week Number
function getISOWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
}

// Calculate Kalendar Kuda Sunday-based Week Number
function getKudaWeekNumber(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - yearStart) / (24 * 60 * 60 * 1000));
  return Math.floor((days + yearStart.getDay()) / 7) + 1;
}

// Helper: Check if holiday applies to chosen state
function isHolidayApplicable(fest, regionKey) {
  if (regionKey === 'ALL') return true;
  if (fest.isNationalHoliday) return true;
  if (!fest.regionKeys) return false;
  const list = fest.regionKeys.split(',').map(s => s.trim());
  return list.includes(regionKey);
}

// Helper: Localized Holiday Title
function getLocalizedFestTitle(fest) {
  if (!fest.festLabels) return fest.title || '';
  const label = fest.festLabels.find(l => l.localeName === state.locale) || fest.festLabels.find(l => l.localeName === 'ms') || fest.festLabels[0];
  return label ? label.title : '';
}

// Helper: Check Payday
function checkIsPayday(dateKey) {
  if (!state.paySchedule?.data) return false;
  const yearData = state.paySchedule.data[String(state.year)];
  if (!yearData) return false;
  return yearData.some(item => item.date === dateKey);
}

// Helper: Check School Holiday range
function checkIsSchoolHoliday(dateKey, group) {
  const data = group === 'KA' ? state.schoolDataKA : state.schoolDataKB;
  if (!data?.list) return false;
  return data.list.some(range => dateKey >= range.startDate && dateKey <= range.endDate);
}

// Filter Calendar Search
function filterCalendarSearch(keyword) {
  if (!keyword) {
    renderCalendar();
    return;
  }
  document.querySelectorAll('.kuda-day-cell:not(.other-month), .day-cell:not(.other-month)').forEach(cell => {
    const text = cell.innerText.toLowerCase();
    if (text.includes(keyword)) {
      cell.style.boxShadow = 'inset 0 0 0 3px #ef4444';
      cell.style.opacity = '1';
    } else {
      cell.style.boxShadow = 'none';
      cell.style.opacity = '0.3';
    }
  });
}

// ==========================================================================
// MODAL: DAY DETAILS & EVENT MANAGER
// ==========================================================================

function openDayModal(cellDetail, isPayDay = false) {
  state.selectedDayDetails = cellDetail;
  const modal = document.getElementById('dayModal');

  // Set Date Number & Header
  document.getElementById('modalDateNumber').textContent = String(cellDetail.day).padStart(2, '0');

  const dayOfWeekName = (DAY_NAMES[state.locale] || DAY_NAMES.ms)[cellDetail.dayOfWeek % 7];
  const monthName = (MONTH_NAMES[state.locale] || MONTH_NAMES.ms)[cellDetail.month - 1];
  document.getElementById('modalFullDate').textContent = `${dayOfWeekName}, ${cellDetail.day} ${monthName} ${cellDetail.year}`;

  // Hijri, Lunar, Tamil tags
  const hijri = cellDetail.hijriDate ? `${cellDetail.hijriDate.day} ${cellDetail.hijriDate.month} ${cellDetail.hijriDate.year}` : '-';
  document.getElementById('modalHijriDate').innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg><span>${hijri}</span>`;

  const lunar = cellDetail.chineseLunarDate ? `${cellDetail.chineseLunarDate.displayText} (${cellDetail.chineseLunarDate.complexYearWithAnimal || ''})` : '-';
  document.getElementById('modalLunarDate').innerHTML = `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v3"/><path d="M9 5h6"/><path d="M7 8a5 7 0 0 0 10 0v6a5 7 0 0 0-10 0Z"/><path d="M9 19h6"/><path d="M12 19v3"/></svg><span>${lunar}</span>`;

  const tamil = cellDetail.tamilDate?.displayText ? `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c-1.5 2-2 3.5-2 5a2 2 0 1 0 4 0c0-1.5-.5-3-2-5Z"/><path d="M4 14c0 3.3 3.6 6 8 6s8-2.7 8-6H4Z"/></svg><span>${cellDetail.tamilDate.displayText}</span>` : '';
  const tamilEl = document.getElementById('modalTamilDate');
  if (tamil) {
    tamilEl.innerHTML = tamil;
    tamilEl.style.display = 'inline-block';
  } else {
    tamilEl.style.display = 'none';
  }

  // Holidays List
  const holList = document.getElementById('modalHolidaysList');
  holList.innerHTML = '';
  if (cellDetail.festDays && cellDetail.festDays.length > 0) {
    cellDetail.festDays.forEach(fest => {
      const item = document.createElement('div');
      item.className = `holiday-item ${fest.isNationalHoliday ? 'national-holiday' : 'state-holiday'}`;

      const title = document.createElement('div');
      title.className = 'holiday-item-title';
      title.textContent = getLocalizedFestTitle(fest);
      item.appendChild(title);

      const states = document.createElement('div');
      states.className = 'holiday-item-states';
      states.textContent = fest.isNationalHoliday ? 'Semua Negeri (Cuti Kebangsaan)' : `Negeri terlibat: ${fest.regionKeys || 'Tertentu'}`;
      item.appendChild(states);

      holList.appendChild(item);
    });
  } else {
    holList.innerHTML = '<p style="color:var(--text-secondary);font-size:0.88rem;">Tiada cuti umum atau perayaan rasmi pada hari ini.</p>';
  }

  // Payday Section
  const paySection = document.getElementById('modalPaydaySection');
  if (isPayDay) {
    paySection.style.display = 'flex';
  } else {
    paySection.style.display = 'none';
  }

  // User Events
  const dateStr = `${cellDetail.year}-${String(cellDetail.month).padStart(2, '0')}-${String(cellDetail.day).padStart(2, '0')}`;
  renderModalUserEvents(dateStr);

  modal.style.display = 'flex';
}

function renderModalUserEvents(dateStr) {
  const container = document.getElementById('modalUserEventsList');
  container.innerHTML = '';

  const events = state.userEvents.filter(e => e.date === dateStr);
  if (events.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">Tiada acara peribadi ditambah untuk hari ini.</p>';
    return;
  }

  events.forEach(ev => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;background:var(--bg-card);padding:8px 12px;border-radius:8px;margin-bottom:6px;';
    row.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:6px;"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-2l-2-2V5a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v8l-2 2z"/></svg><strong>${ev.title}</strong></span>
      <button class="btn-delete-event" data-id="${ev.id}" title="Padam Acara">&times;</button>
    `;
    row.querySelector('.btn-delete-event').addEventListener('click', () => {
      deleteUserEvent(ev.id);
      renderModalUserEvents(dateStr);
      renderCalendar();
    });
    container.appendChild(row);
  });
}

function closeModal() {
  document.getElementById('dayModal').style.display = 'none';
  state.selectedDayDetails = null;
}

// Delete user event
function deleteUserEvent(id) {
  state.userEvents = state.userEvents.filter(e => e.id !== id);
  localStorage.setItem('my_cal_events', JSON.stringify(state.userEvents));
  renderUserEvents();
}

// Export single day event as iCalendar file (.ics)
function exportDayAsIcal(dayData) {
  const { year, month, day } = dayData;
  const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;

  const holidayTitle = dayData.festDays?.[0] ? getLocalizedFestTitle(dayData.festDays[0]) : 'Peringatan Kalendar Malaysia';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kalendar Malaysia PRO//MY',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@kalendarmalaysia.local`,
    `DTSTAMP:${dateStr}T000000Z`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${dateStr}`,
    `SUMMARY:${holidayTitle}`,
    `DESCRIPTION:Dikuasakan oleh Kalendar Malaysia PRO Web App`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Acara_${dateStr}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================================================
// TAB 2: LONG WEEKENDS PLANNER
// ==========================================================================

function renderLongWeekends() {
  document.getElementById('lwYearTitle').textContent = state.year;
  const container = document.getElementById('longWeekendList');
  container.innerHTML = '';

  const list = state.longWeekendData?.list || [];
  if (list.length === 0) {
    container.innerHTML = '<p class="section-desc">Tiada data cuti panjang untuk tahun ini.</p>';
    return;
  }

  list.forEach(lw => {
    // Check if applicable to state
    if (state.selectedRegion !== 'ALL' && lw.regionKeys) {
      const keys = lw.regionKeys.split(',').map(s => s.trim());
      if (!keys.includes(state.selectedRegion)) return;
    }

    const card = document.createElement('div');
    card.className = 'lw-card';

    const festTitle = lw.festLabels ? (lw.festLabels.find(l => l.localeName === state.locale)?.title || lw.festLabels[0]?.title) : lw.title;

    card.innerHTML = `
      <div>
        <div class="lw-header">
          <h3 class="lw-title">${festTitle || 'Cuti Panjang'}</h3>
          <span class="lw-duration-badge">${lw.days || 3} Hari</span>
        </div>
        <div class="lw-dates" style="display:inline-flex;align-items:center;gap:6px;"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>${formatDateStr(lw.startDate)} <svg class="ui-icon" style="width:12px;height:12px;margin:0 2px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg> ${formatDateStr(lw.endDate)}</span></div>
        <div class="lw-states">Negeri: ${lw.regionKeys || 'Seluruh Malaysia'}</div>
      </div>
      <div class="lw-tip">
        <span style="display:inline-flex;align-items:center;gap:6px;vertical-align:-2px;"><svg class="ui-icon" style="color:var(--accent-gold);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></svg><strong>Tip Cuti:</strong></span> ${lw.tip || 'Sesuai untuk percutian domestik atau pulang ke kampung bersama keluarga.'}
      </div>
    `;

    container.appendChild(card);
  });
}

function formatDateStr(str) {
  if (!str || str.length < 8) return str;
  const y = str.slice(0, 4);
  const m = str.slice(4, 6);
  const d = str.slice(6, 8);
  return `${d}/${m}/${y}`;
}

// ==========================================================================
// TAB 3: SCHOOL HOLIDAYS (TAKWIN KPM)
// ==========================================================================

function renderSchoolHolidays() {
  document.getElementById('schoolYearTitle').textContent = state.year;
  const container = document.getElementById('schoolHolidaysList');
  container.innerHTML = '';

  const data = state.schoolGroup === 'KA' ? state.schoolDataKA : state.schoolDataKB;
  const list = data?.list || [];

  if (list.length === 0) {
    container.innerHTML = '<p class="section-desc">Tiada data takwim cuti sekolah bagi tahun ini.</p>';
    return;
  }

  list.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'school-card';

    // Calculate days duration
    const start = parseDate(item.startDate);
    const end = parseDate(item.endDate);
    const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    card.innerHTML = `
      <div class="school-card-header">
        <span class="school-term-name">Sesi / Penggal #${idx + 1}</span>
        <span class="school-duration">${diffDays} Hari</span>
      </div>
      <div class="school-daterange">${formatDateStr(item.startDate)} hingga ${formatDateStr(item.endDate)}</div>
      <div style="font-size:0.82rem;color:var(--text-secondary);">
        ${state.schoolGroup === 'KA' ? `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg> <span>Kumpulan A (Johor, Kedah, Kelantan, Terengganu)</span>` : `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg> <span>Kumpulan B (Selangor, KL, Penang dll.)</span>`}
      </div>
    `;

    container.appendChild(card);
  });
}

function parseDate(str) {
  const y = parseInt(str.slice(0, 4));
  const m = parseInt(str.slice(4, 6)) - 1;
  const d = parseInt(str.slice(6, 8));
  return new Date(y, m, d);
}

// ==========================================================================
// TAB 4: SALARY & PENSION SCHEDULE
// ==========================================================================

function renderSalaryAndPension() {
  const payData = state.paySchedule?.data?.[String(state.year)] || [];
  const penData = state.pensionSchedule?.data?.[String(state.year)] || [];

  // Pay table
  const payTbody = document.querySelector('#payTable tbody');
  payTbody.innerHTML = '';
  payData.forEach(item => {
    const tr = document.createElement('tr');
    const month = item.title?.find(t => t.localeName === state.locale)?.title || item.title?.[0]?.title || '';
    const desc = item.description?.find(d => d.localeName === state.locale)?.title || item.description?.[0]?.title || '-';

    const dateObj = parseDate(item.date);
    const dayName = (DAY_NAMES[state.locale] || DAY_NAMES.ms)[dateObj.getDay()];

    tr.innerHTML = `
      <td><strong>${month}</strong></td>
      <td class="date-col">${formatDateStr(item.date)}</td>
      <td>${dayName}</td>
      <td>${desc}</td>
    `;
    payTbody.appendChild(tr);
  });

  // Pension table
  const penTbody = document.querySelector('#pensionTable tbody');
  penTbody.innerHTML = '';
  penData.forEach(item => {
    const tr = document.createElement('tr');
    const month = item.title?.find(t => t.localeName === state.locale)?.title || item.title?.[0]?.title || '';
    const desc = item.description?.find(d => d.localeName === state.locale)?.title || item.description?.[0]?.title || '-';

    const dateObj = parseDate(item.date);
    const dayName = (DAY_NAMES[state.locale] || DAY_NAMES.ms)[dateObj.getDay()];

    tr.innerHTML = `
      <td><strong>${month}</strong></td>
      <td class="date-col">${formatDateStr(item.date)}</td>
      <td>${dayName}</td>
      <td>${desc}</td>
    `;
    penTbody.appendChild(tr);
  });

  // Next Payday Countdown Banner
  renderNextPaydayCountdown(payData);
}

function renderNextPaydayCountdown(payData) {
  const banner = document.getElementById('nextPaydayCard');
  const now = new Date();
  const todayKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  const nextPay = payData.find(item => item.date >= todayKey);
  if (!nextPay) {
    banner.innerHTML = `
      <div class="next-payday-info">
        <h3><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><circle cx="12" cy="15" r="2"/></svg> Jadual Gaji ${state.year}</h3>
        <p>Sila semak jadual bulanan di bawah.</p>
      </div>
    `;
    return;
  }

  const targetDate = parseDate(nextPay.date);
  const diffDays = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
  const monthTitle = nextPay.title?.find(t => t.localeName === state.locale)?.title || nextPay.title?.[0]?.title || '';

  banner.innerHTML = `
    <div class="next-payday-info">
      <h3><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><circle cx="12" cy="15" r="2"/></svg> Pembayaran Gaji Seterusnya (${monthTitle})</h3>
      <p>Tarikh: <strong>${formatDateStr(nextPay.date)}</strong></p>
    </div>
    <div class="countdown-box">
      <span class="countdown-number">${diffDays >= 0 ? diffDays : 0}</span>
      <span class="countdown-label">Hari Lagi</span>
    </div>
  `;
}

// ==========================================================================
// TAB 5: MY NOTES & EVENTS
// ==========================================================================

function renderUserEvents() {
  const container = document.getElementById('userEventsList');
  container.innerHTML = '';

  if (state.userEvents.length === 0) {
    container.innerHTML = '<p class="section-desc">Tiada acara atau peringatan disimpan lagi. Masukkan acara pertama anda di atas!</p>';
    return;
  }

  // Sort by date
  const sorted = [...state.userEvents].sort((a, b) => a.date.localeCompare(b.date));

  sorted.forEach(ev => {
    const card = document.createElement('div');
    card.className = 'event-card';

    card.innerHTML = `
      <div class="event-info">
        <h4>${ev.title}</h4>
        <p style="display:inline-flex;align-items:center;gap:5px;"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> <span>Tarikh: ${ev.date} • Kategori: ${ev.category}</span></p>
      </div>
      <button class="btn-delete-event" data-id="${ev.id}" title="Padam Acara"><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg></button>
    `;

    card.querySelector('.btn-delete-event').addEventListener('click', () => {
      deleteUserEvent(ev.id);
      renderCalendar();
    });

    container.appendChild(card);
  });
}
