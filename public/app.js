const STORAGE_KEY = "engineer-career-hub:v1";

const STAGES = [
  { id: "saved", name: "Saved" },
  { id: "applied", name: "Applied" },
  { id: "interviewing", name: "Interviewing" },
  { id: "offer", name: "Offer" },
  { id: "archived", name: "Archived" }
];

const FIELD_LABELS = {
  situation: "Situation",
  task: "Task",
  action: "Action",
  result: "Result",
  reflection: "Reflection"
};

const state = {
  view: "applications",
  appQuery: "",
  stageFilter: "all",
  storyQuery: "",
  storyTag: "all",
  selectedAppId: null,
  modal: null,
  errors: {},
  toast: ""
};

let db = loadStore();

if (!db) {
  db = seedData();
  saveStore();
}

normalizeStore();
state.selectedAppId = db.applications[0]?.id || null;

const appRoot = document.getElementById("app");

function seedData() {
  const storyTechnical = makeId();
  const storyTeamwork = makeId();
  const storyFailure = makeId();

  return {
    applications: [
      {
        id: makeId(),
        company: "Nova Robotics",
        role: "Controls Software Intern",
        stage: "interviewing",
        jobUrl: "https://example.com/nova-controls-intern",
        deadline: "2026-05-12",
        location: "Austin, TX",
        notes: "Recruiter screen complete. Next round is a technical conversation with the autonomy team.",
        resumeNotes: "Lead with ROS controls project, embedded C++ lab, and PID tuning results. Keep web app bullets secondary.",
        storyIds: [storyTechnical, storyTeamwork],
        createdAt: "2026-05-01T14:00:00.000Z",
        updatedAt: "2026-05-04T15:30:00.000Z"
      },
      {
        id: makeId(),
        company: "CloudForge",
        role: "Backend Engineering Intern",
        stage: "applied",
        jobUrl: "https://example.com/cloudforge-backend",
        deadline: "2026-05-18",
        location: "Remote",
        notes: "Referral from Maya submitted. Follow up after one week if no response.",
        resumeNotes: "Use distributed systems bullets and the API latency reduction metric.",
        storyIds: [storyTechnical, storyFailure],
        createdAt: "2026-04-28T18:00:00.000Z",
        updatedAt: "2026-05-03T10:15:00.000Z"
      },
      {
        id: makeId(),
        company: "GreenGrid Energy",
        role: "Data Platform Co-op",
        stage: "saved",
        jobUrl: "https://example.com/greengrid-data-coop",
        deadline: "2026-05-27",
        location: "Chicago, IL",
        notes: "Need to tailor project section before applying.",
        resumeNotes: "",
        storyIds: [],
        createdAt: "2026-05-03T11:10:00.000Z",
        updatedAt: "2026-05-03T11:10:00.000Z"
      }
    ],
    stories: [
      {
        id: storyTechnical,
        title: "Cut API Latency During Cloud Migration",
        situation: "The student project team moved a monolith feature into a small Node service and the first version created slow dashboard loads.",
        task: "Own the investigation and make the service reliable enough for the final demo.",
        action: "Added request tracing, found an unnecessary serial database call, batched the lookup, and added a smoke test around the endpoint.",
        result: "Median response time dropped from 900 ms to 240 ms and the final demo ran without timeout failures.",
        reflection: "Strong fit for technical depth, debugging, ownership, and backend roles.",
        tags: ["technical depth", "ownership", "backend"],
        createdAt: "2026-04-26T12:00:00.000Z",
        updatedAt: "2026-05-01T09:00:00.000Z"
      },
      {
        id: storyTeamwork,
        title: "Resolved Design Conflict on Robotics Team",
        situation: "Two subteams disagreed about whether to prioritize a sensor-heavy approach or a simpler control loop before competition week.",
        task: "Help the group choose a path without losing time or trust.",
        action: "Facilitated a short tradeoff review, turned the debate into testable criteria, and scheduled a same-day prototype comparison.",
        result: "The team chose the simpler loop, reduced integration risk, and passed inspection on the first attempt.",
        reflection: "Good behavioral story for teamwork, conflict, communication, and leadership.",
        tags: ["teamwork", "conflict", "leadership"],
        createdAt: "2026-04-29T13:00:00.000Z",
        updatedAt: "2026-05-01T10:00:00.000Z"
      },
      {
        id: storyFailure,
        title: "Recovered After Breaking a Demo Build",
        situation: "A late CSS and routing change broke the demo flow the night before a class presentation.",
        task: "Restore the build and prevent the same mistake during the final submission.",
        action: "Rolled the change into smaller commits, added a manual smoke checklist, and asked a teammate to verify the core flow.",
        result: "The team delivered the presentation on time and later adopted the checklist for each release.",
        reflection: "Useful for failure, learning, process improvement, and reliability questions.",
        tags: ["failure", "learning", "process"],
        createdAt: "2026-04-30T13:00:00.000Z",
        updatedAt: "2026-05-02T11:00:00.000Z"
      }
    ]
  };
}

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStore() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function normalizeStore() {
  db.applications = Array.isArray(db.applications) ? db.applications : [];
  db.stories = Array.isArray(db.stories) ? db.stories : [];

  db.applications = db.applications.map((application) => ({
    id: application.id || makeId(),
    company: application.company || "",
    role: application.role || "",
    stage: STAGES.some((stage) => stage.id === application.stage) ? application.stage : "saved",
    jobUrl: application.jobUrl || "",
    deadline: application.deadline || "",
    location: application.location || "",
    notes: application.notes || "",
    resumeNotes: application.resumeNotes || "",
    storyIds: Array.isArray(application.storyIds) ? application.storyIds : [],
    createdAt: application.createdAt || new Date().toISOString(),
    updatedAt: application.updatedAt || new Date().toISOString()
  }));

  db.stories = db.stories.map((story) => ({
    id: story.id || makeId(),
    title: story.title || "",
    situation: story.situation || "",
    task: story.task || "",
    action: story.action || "",
    result: story.result || "",
    reflection: story.reflection || "",
    tags: Array.isArray(story.tags) ? story.tags : [],
    createdAt: story.createdAt || new Date().toISOString(),
    updatedAt: story.updatedAt || new Date().toISOString()
  }));
}

function makeId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function render() {
  const focus = captureFocus();
  appRoot.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <main class="workspace">
        ${renderTopbar()}
        <section class="view">
          ${renderView()}
        </section>
      </main>
    </div>
    ${renderModal()}
    ${state.toast ? `<div class="toast" role="status">${escapeHtml(state.toast)}</div>` : ""}
  `;
  restoreFocus(focus);
}

function renderSidebar() {
  const counts = getCounts();
  return `
    <aside class="sidebar">
      <div class="brand" aria-label="Engineer Career Hub">
        <div class="brand-line"></div>
        <p class="brand-title">Engineer<br>Career Hub<span class="brand-subtitle">Career OS</span></p>
      </div>
      <nav class="nav" aria-label="Primary">
        ${navButton("applications", "P", "Applications", db.applications.length)}
        ${navButton("stories", "S", "Story Bank", db.stories.length)}
        ${navButton("pack", "I", "Interview Pack", counts.packReady)}
      </nav>
      <div class="sidebar-summary" aria-label="Search summary">
        <div class="sidebar-stat"><span>Active roles</span><strong>${counts.active}</strong></div>
        <div class="sidebar-stat"><span>Interviewing</span><strong>${counts.interviewing}</strong></div>
        <div class="sidebar-stat"><span>Story links</span><strong>${counts.storyLinks}</strong></div>
        <div class="sidebar-stat"><span>Next deadline</span><strong>${escapeHtml(counts.nextDeadlineShort)}</strong></div>
      </div>
      <div class="sidebar-spacer"></div>
      <button class="sidebar-action" type="button" data-action="reset-demo">Reset Demo Data</button>
    </aside>
  `;
}

function navButton(view, icon, label, count) {
  const activeClass = state.view === view ? " is-active" : "";
  return `
    <button class="nav-button${activeClass}" type="button" data-action="set-view" data-view="${view}">
      <span class="nav-icon" aria-hidden="true">${icon}</span>
      <span>${label}</span>
      <span class="nav-count">${count}</span>
    </button>
  `;
}

function renderTopbar() {
  const titleMap = {
    applications: "Applications",
    stories: "Story Bank",
    pack: "Interview Pack"
  };

  const action = state.view === "applications"
    ? `<button class="primary-button" type="button" data-action="add-application"><span aria-hidden="true">+</span>Add Application</button>`
    : state.view === "stories"
      ? `<button class="primary-button" type="button" data-action="add-story"><span aria-hidden="true">+</span>Add Story</button>`
      : `<button class="secondary-button" type="button" data-action="print-pack"><span aria-hidden="true">P</span>Print</button>`;

  return `
    <header class="topbar">
      <div>
        <h1>${titleMap[state.view]}</h1>
        <p class="topbar-meta">${escapeHtml(getTopbarMeta())}</p>
      </div>
      <div class="topbar-actions">${action}</div>
    </header>
  `;
}

function getTopbarMeta() {
  const counts = getCounts();
  if (state.view === "applications") {
    return `${counts.active} active roles, ${counts.interviewing} in interview stage`;
  }
  if (state.view === "stories") {
    return `${db.stories.length} structured stories across ${getAllTags().length} tags`;
  }
  return `${counts.packReady} applications have linked prep`;
}

function renderView() {
  if (state.view === "stories") {
    return renderStoriesView();
  }
  if (state.view === "pack") {
    return renderPackView();
  }
  return renderApplicationsView();
}

function renderApplicationsView() {
  const counts = getCounts();
  const filteredApplications = getFilteredApplications();

  return `
    <div class="toolbar-panel">
      <div class="toolbar">
        <label class="sr-only" for="app-search">Search applications</label>
        <input class="search-control" id="app-search" data-input="app-search" data-focus-id="app-search" type="search" value="${escapeAttr(state.appQuery)}" placeholder="Search company, role, notes, resume">
        <label class="sr-only" for="stage-filter">Filter stage</label>
        <select class="select-control" id="stage-filter" data-change="stage-filter">
          <option value="all"${state.stageFilter === "all" ? " selected" : ""}>All stages</option>
          ${STAGES.map((stage) => `<option value="${stage.id}"${state.stageFilter === stage.id ? " selected" : ""}>${stage.name}</option>`).join("")}
        </select>
      </div>
      <button class="primary-button" type="button" data-action="add-application"><span aria-hidden="true">+</span>Add Application</button>
    </div>
    <div class="metrics-grid" aria-label="Application metrics">
      ${metric("Active roles", counts.active)}
      ${metric("Interviewing", counts.interviewing)}
      ${metric("Pack ready", counts.packReady)}
      ${metric("Next deadline", counts.nextDeadline, "small")}
    </div>
    <div class="application-layout">
      <div class="pipeline-board">
        ${STAGES.map((stage) => renderStageColumn(stage, filteredApplications)).join("")}
      </div>
      ${renderApplicationDetail()}
    </div>
  `;
}

function metric(label, value, size = "") {
  return `
    <div class="metric">
      <span class="metric-label">${escapeHtml(label)}</span>
      <strong class="metric-value ${size}">${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderStageColumn(stage, applications) {
  const stageApplications = applications.filter((application) => application.stage === stage.id);
  return `
    <section class="stage-column stage-${stage.id}" aria-labelledby="${stage.id}-heading">
      <header class="stage-header">
        <h2 id="${stage.id}-heading">${stage.name}</h2>
        <span class="stage-count">${stageApplications.length}</span>
      </header>
      <div class="stage-stack">
        ${stageApplications.length ? stageApplications.map(renderApplicationCard).join("") : `<div class="empty-state"><span>No matches</span></div>`}
      </div>
    </section>
  `;
}

function renderApplicationCard(application) {
  const selectedClass = selectedApplication()?.id === application.id ? " is-selected" : "";
  const linkedStories = application.storyIds.length;
  const resumePill = application.resumeNotes.trim() ? `<span class="pill green">Resume notes</span>` : `<span class="pill">No resume notes</span>`;
  return `
    <button class="application-card${selectedClass}" type="button" data-action="select-application" data-id="${application.id}">
      <span class="card-title">${escapeHtml(application.company)}<span>${escapeHtml(application.role)}</span></span>
      <span class="card-meta">
        ${application.deadline ? `<span class="pill amber">${formatDate(application.deadline)}</span>` : `<span class="pill">No deadline</span>`}
        ${application.location ? `<span class="pill blue">${escapeHtml(application.location)}</span>` : ""}
      </span>
      <span class="card-meta">
        ${resumePill}
        <span class="pill">${linkedStories} ${linkedStories === 1 ? "story" : "stories"}</span>
      </span>
    </button>
  `;
}

function renderApplicationDetail() {
  const application = selectedApplication();

  if (!application) {
    return `
      <aside class="detail-panel">
        <div class="empty-state">
          <strong>No application selected</strong>
          <span>Add an application to start tracking a role.</span>
        </div>
      </aside>
    `;
  }

  const linkedStories = getLinkedStories(application);
  const stageOptions = STAGES.map((stage) => `<option value="${stage.id}"${application.stage === stage.id ? " selected" : ""}>${stage.name}</option>`).join("");

  return `
    <aside class="detail-panel" aria-label="Application detail">
      <div class="detail-header">
        <h2 class="detail-title">${escapeHtml(application.company)}<span>${escapeHtml(application.role)}</span></h2>
        <div class="detail-actions">
          <button class="secondary-button" type="button" data-action="edit-application" data-id="${application.id}"><span aria-hidden="true">E</span>Edit</button>
          <button class="secondary-button" type="button" data-action="open-pack" data-id="${application.id}"><span aria-hidden="true">I</span>Pack</button>
          <button class="danger-button" type="button" data-action="delete-application" data-id="${application.id}"><span aria-hidden="true">D</span>Delete</button>
        </div>
      </div>
      <div class="data-grid">
        <div class="data-item">
          <span class="data-label">Stage</span>
          <select class="select-control" data-change="application-stage" data-id="${application.id}">
            ${stageOptions}
          </select>
        </div>
        <div class="data-item">
          <span class="data-label">Deadline</span>
          <span class="data-value">${application.deadline ? formatDate(application.deadline) : "None"}</span>
        </div>
        <div class="data-item">
          <span class="data-label">Location</span>
          <span class="data-value">${escapeHtml(application.location || "None")}</span>
        </div>
        <div class="data-item">
          <span class="data-label">Posting</span>
          <span class="data-value">${application.jobUrl ? `<a href="${escapeAttr(application.jobUrl)}" target="_blank" rel="noreferrer">Open link</a>` : "None"}</span>
        </div>
      </div>
      <section class="detail-section">
        <h3 class="section-title">Resume Notes</h3>
        <textarea class="textarea-control" data-focus-id="resume-notes" id="resume-notes">${escapeHtml(application.resumeNotes)}</textarea>
        <button class="secondary-button" type="button" data-action="save-resume-notes" data-id="${application.id}"><span aria-hidden="true">S</span>Save Notes</button>
      </section>
      <section class="detail-section">
        <h3 class="section-title">Application Notes</h3>
        <p class="body-copy">${escapeHtml(application.notes || "No notes yet.")}</p>
      </section>
      <section class="detail-section">
        <h3 class="section-title">Linked Stories</h3>
        <div class="mini-story-list">
          ${linkedStories.length ? linkedStories.map(renderMiniStory).join("") : `<div class="empty-state"><span>No stories linked</span></div>`}
        </div>
      </section>
    </aside>
  `;
}

function renderMiniStory(story) {
  const tags = story.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  return `
    <article class="mini-story">
      <strong>${escapeHtml(story.title)}</strong>
      <div class="tag-list">${tags}</div>
    </article>
  `;
}

function renderStoriesView() {
  const stories = getFilteredStories();
  const tags = getAllTags();

  return `
    <div class="toolbar-panel">
      <div class="toolbar">
        <label class="sr-only" for="story-search">Search stories</label>
        <input class="search-control" id="story-search" data-input="story-search" data-focus-id="story-search" type="search" value="${escapeAttr(state.storyQuery)}" placeholder="Search title, STAR fields, tags">
        <label class="sr-only" for="story-tag-filter">Filter tag</label>
        <select class="select-control" id="story-tag-filter" data-change="story-tag-filter">
          <option value="all"${state.storyTag === "all" ? " selected" : ""}>All tags</option>
          ${tags.map((tag) => `<option value="${escapeAttr(tag)}"${state.storyTag === tag ? " selected" : ""}>${escapeHtml(tag)}</option>`).join("")}
        </select>
      </div>
      <button class="primary-button" type="button" data-action="add-story"><span aria-hidden="true">+</span>Add Story</button>
    </div>
    ${stories.length ? `<div class="story-grid">${stories.map(renderStoryCard).join("")}</div>` : `<div class="empty-state"><strong>No stories found</strong><span>Add a STAR story or clear the current filter.</span></div>`}
  `;
}

function renderStoryCard(story) {
  return `
    <article class="story-card">
      <div class="story-card-header">
        <h2>${escapeHtml(story.title)}</h2>
        <div class="card-actions">
          <button class="icon-button" type="button" data-action="edit-story" data-id="${story.id}" aria-label="Edit ${escapeAttr(story.title)}">E</button>
          <button class="icon-button" type="button" data-action="delete-story" data-id="${story.id}" aria-label="Delete ${escapeAttr(story.title)}">D</button>
        </div>
      </div>
      <div class="tag-list">${story.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("") || `<span class="pill">No tags</span>`}</div>
      <dl class="star-grid">
        ${["situation", "task", "action", "result"].map((key) => renderStarRow(key, story[key])).join("")}
      </dl>
    </article>
  `;
}

function renderStarRow(key, value) {
  return `
    <div class="star-row">
      <dt>${FIELD_LABELS[key]}</dt>
      <dd>${escapeHtml(value || "Not added")}</dd>
    </div>
  `;
}

function renderPackView() {
  const application = selectedApplication() || db.applications[0];

  if (!application) {
    return `
      <div class="empty-state">
        <strong>No applications yet</strong>
        <span>Add an application before opening an interview pack.</span>
      </div>
    `;
  }

  state.selectedAppId = application.id;
  const linkedStories = getLinkedStories(application);

  return `
    <section class="pack-shell">
      <div class="pack-toolbar">
        <div class="toolbar">
          <label class="sr-only" for="pack-select">Select application</label>
          <select class="select-control" id="pack-select" data-change="pack-select">
            ${db.applications.map((item) => `<option value="${item.id}"${item.id === application.id ? " selected" : ""}>${escapeHtml(item.company)} - ${escapeHtml(item.role)}</option>`).join("")}
          </select>
        </div>
        <div class="pack-actions">
          <button class="secondary-button" type="button" data-action="copy-pack"><span aria-hidden="true">C</span>Copy</button>
          <button class="secondary-button" type="button" data-action="print-pack"><span aria-hidden="true">P</span>Print</button>
          <button class="primary-button" type="button" data-action="edit-application" data-id="${application.id}"><span aria-hidden="true">E</span>Edit Links</button>
        </div>
      </div>
      <div class="pack-body">
        <header class="pack-hero">
          <div>
            <h2 class="pack-title">${escapeHtml(application.company)}</h2>
            <p class="pack-subtitle">${escapeHtml(application.role)}</p>
          </div>
          <span class="pill ${stageTone(application.stage)}">${escapeHtml(stageName(application.stage))}</span>
        </header>
        <div class="data-grid">
          <div class="data-item"><span class="data-label">Deadline</span><span class="data-value">${application.deadline ? formatDate(application.deadline) : "None"}</span></div>
          <div class="data-item"><span class="data-label">Location</span><span class="data-value">${escapeHtml(application.location || "None")}</span></div>
          <div class="data-item"><span class="data-label">Posting</span><span class="data-value">${application.jobUrl ? `<a href="${escapeAttr(application.jobUrl)}" target="_blank" rel="noreferrer">Open link</a>` : "None"}</span></div>
          <div class="data-item"><span class="data-label">Updated</span><span class="data-value">${formatDateTime(application.updatedAt)}</span></div>
        </div>
        <section class="pack-section">
          <h2>Resume Notes</h2>
          <p class="body-copy">${escapeHtml(application.resumeNotes || "No resume notes linked yet.")}</p>
        </section>
        <section class="pack-section">
          <h2>Application Notes</h2>
          <p class="body-copy">${escapeHtml(application.notes || "No application notes yet.")}</p>
        </section>
        <section class="pack-section">
          <h2>Stories</h2>
          ${linkedStories.length ? linkedStories.map(renderPackStory).join("") : `<div class="empty-state"><span>No linked stories yet</span></div>`}
        </section>
      </div>
    </section>
  `;
}

function renderPackStory(story) {
  return `
    <article class="pack-story">
      <h3 class="section-title">${escapeHtml(story.title)}</h3>
      <div class="tag-list">${story.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
      <dl class="star-grid">
        ${["situation", "task", "action", "result", "reflection"].map((key) => renderStarRow(key, story[key])).join("")}
      </dl>
    </article>
  `;
}

function renderModal() {
  if (!state.modal) {
    return "";
  }

  if (state.modal.type === "story") {
    return renderStoryModal();
  }

  return renderApplicationModal();
}

function renderApplicationModal() {
  const application = db.applications.find((item) => item.id === state.modal?.id);
  const isEditing = Boolean(application);
  const draft = application || {
    company: "",
    role: "",
    stage: "saved",
    jobUrl: "",
    deadline: "",
    location: "",
    notes: "",
    resumeNotes: "",
    storyIds: []
  };

  return `
    <div class="modal-backdrop" role="presentation">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="application-modal-title">
        <header class="modal-header">
          <h2 id="application-modal-title">${isEditing ? "Edit Application" : "Add Application"}</h2>
          <button class="icon-button" type="button" data-action="close-modal" aria-label="Close">X</button>
        </header>
        <form id="application-form" class="form-body" novalidate>
          <input type="hidden" name="id" value="${escapeAttr(application?.id || "")}">
          <div class="form-grid">
            ${inputField("Company", "company", draft.company, "text", true)}
            ${inputField("Role", "role", draft.role, "text", true)}
            <div class="form-field">
              <label for="application-stage">Stage</label>
              <select class="select-control" id="application-stage" name="stage">
                ${STAGES.map((stage) => `<option value="${stage.id}"${draft.stage === stage.id ? " selected" : ""}>${stage.name}</option>`).join("")}
              </select>
            </div>
            ${inputField("Deadline", "deadline", draft.deadline, "date", false)}
            ${inputField("Job Posting URL", "jobUrl", draft.jobUrl, "url", false)}
            ${inputField("Location", "location", draft.location, "text", false)}
            ${textareaField("Application Notes", "notes", draft.notes)}
            ${textareaField("Resume Notes / Key Bullets", "resumeNotes", draft.resumeNotes)}
            <div class="form-field full">
              <span class="checkbox-group-title">Linked Stories</span>
              <div class="checkbox-grid">
                ${db.stories.length ? db.stories.map((story) => storyCheckbox(story, draft.storyIds.includes(story.id))).join("") : `<div class="empty-state"><span>No stories available</span></div>`}
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="primary-button" type="submit"><span aria-hidden="true">S</span>Save Application</button>
            <button class="secondary-button" type="button" data-action="close-modal">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function renderStoryModal() {
  const story = db.stories.find((item) => item.id === state.modal?.id);
  const isEditing = Boolean(story);
  const draft = story || {
    title: "",
    situation: "",
    task: "",
    action: "",
    result: "",
    reflection: "",
    tags: []
  };

  return `
    <div class="modal-backdrop" role="presentation">
      <section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="story-modal-title">
        <header class="modal-header">
          <h2 id="story-modal-title">${isEditing ? "Edit Story" : "Add Story"}</h2>
          <button class="icon-button" type="button" data-action="close-modal" aria-label="Close">X</button>
        </header>
        <form id="story-form" class="form-body" novalidate>
          <input type="hidden" name="id" value="${escapeAttr(story?.id || "")}">
          <div class="form-grid">
            ${inputField("Title", "title", draft.title, "text", true)}
            ${inputField("Tags", "tags", draft.tags.join(", "), "text", false)}
            ${textareaField("Situation", "situation", draft.situation, true)}
            ${textareaField("Task", "task", draft.task, true)}
            ${textareaField("Action", "action", draft.action, true)}
            ${textareaField("Result", "result", draft.result, true)}
            ${textareaField("Reflection / Learning", "reflection", draft.reflection)}
          </div>
          <div class="modal-actions">
            <button class="primary-button" type="submit"><span aria-hidden="true">S</span>Save Story</button>
            <button class="secondary-button" type="button" data-action="close-modal">Cancel</button>
          </div>
        </form>
      </section>
    </div>
  `;
}

function inputField(label, name, value, type = "text", required = false) {
  const error = state.errors[name];
  return `
    <div class="form-field">
      <label for="${name}">${label}${required ? " *" : ""}</label>
      <input class="field-control" id="${name}" name="${name}" type="${type}" value="${escapeAttr(value)}"${required ? " required" : ""}>
      ${error ? `<span class="field-error">${escapeHtml(error)}</span>` : ""}
    </div>
  `;
}

function textareaField(label, name, value, required = false) {
  const error = state.errors[name];
  return `
    <div class="form-field full">
      <label for="${name}">${label}${required ? " *" : ""}</label>
      <textarea class="textarea-control" id="${name}" name="${name}"${required ? " required" : ""}>${escapeHtml(value)}</textarea>
      ${error ? `<span class="field-error">${escapeHtml(error)}</span>` : ""}
    </div>
  `;
}

function storyCheckbox(story, checked) {
  return `
    <label class="checkbox-option">
      <input type="checkbox" name="storyIds" value="${story.id}"${checked ? " checked" : ""}>
      <span>
        <strong>${escapeHtml(story.title)}</strong>
        <span class="tag-list">${story.tags.slice(0, 3).map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</span>
      </span>
    </label>
  `;
}

function selectedApplication() {
  const selected = db.applications.find((application) => application.id === state.selectedAppId);
  if (selected) {
    return selected;
  }

  const firstFiltered = getFilteredApplications()[0] || db.applications[0];
  return firstFiltered || null;
}

function getFilteredApplications() {
  const query = state.appQuery.trim().toLowerCase();
  return db.applications.filter((application) => {
    const stageMatches = state.stageFilter === "all" || application.stage === state.stageFilter;
    const searchable = [
      application.company,
      application.role,
      application.location,
      application.notes,
      application.resumeNotes,
      stageName(application.stage)
    ].join(" ").toLowerCase();
    return stageMatches && (!query || searchable.includes(query));
  });
}

function getFilteredStories() {
  const query = state.storyQuery.trim().toLowerCase();
  return db.stories.filter((story) => {
    const tagMatches = state.storyTag === "all" || story.tags.includes(state.storyTag);
    const searchable = [
      story.title,
      story.situation,
      story.task,
      story.action,
      story.result,
      story.reflection,
      story.tags.join(" ")
    ].join(" ").toLowerCase();
    return tagMatches && (!query || searchable.includes(query));
  });
}

function getLinkedStories(application) {
  return application.storyIds
    .map((storyId) => db.stories.find((story) => story.id === storyId))
    .filter(Boolean);
}

function getAllTags() {
  return [...new Set(db.stories.flatMap((story) => story.tags))].sort((a, b) => a.localeCompare(b));
}

function getCounts() {
  const active = db.applications.filter((application) => application.stage !== "archived").length;
  const interviewing = db.applications.filter((application) => application.stage === "interviewing").length;
  const storyLinks = db.applications.reduce((sum, application) => sum + application.storyIds.length, 0);
  const packReady = db.applications.filter((application) => application.resumeNotes.trim() || application.storyIds.length).length;
  const next = nextDeadline();

  return {
    active,
    interviewing,
    storyLinks,
    packReady,
    nextDeadline: next ? formatDate(next) : "None",
    nextDeadlineShort: next ? formatShortDate(next) : "None"
  };
}

function nextDeadline() {
  const now = startOfDay(new Date());
  const futureDeadlines = db.applications
    .filter((application) => application.stage !== "archived" && application.deadline)
    .map((application) => application.deadline)
    .filter((deadline) => startOfDay(new Date(`${deadline}T00:00:00`)) >= now)
    .sort();

  return futureDeadlines[0] || "";
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function stageName(stageId) {
  return STAGES.find((stage) => stage.id === stageId)?.name || "Saved";
}

function stageTone(stageId) {
  if (stageId === "interviewing") return "amber";
  if (stageId === "offer") return "green";
  if (stageId === "archived") return "";
  if (stageId === "applied") return "red";
  return "blue";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatShortDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);
}

function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function captureFocus() {
  const active = document.activeElement;
  if (!active?.dataset?.focusId) {
    return null;
  }

  return {
    id: active.dataset.focusId,
    start: active.selectionStart,
    end: active.selectionEnd
  };
}

function restoreFocus(focus) {
  if (!focus) {
    return;
  }

  const element = document.querySelector(`[data-focus-id="${CSS.escape(focus.id)}"]`);
  if (!element) {
    return;
  }

  element.focus();
  if (typeof focus.start === "number" && typeof element.setSelectionRange === "function") {
    element.setSelectionRange(focus.start, focus.end);
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function showToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2200);
}

function parseTags(value) {
  const seen = new Set();
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    })
    .slice(0, 10);
}

function validateApplication(values) {
  const errors = {};
  if (!values.company.trim()) errors.company = "Company is required.";
  if (!values.role.trim()) errors.role = "Role is required.";
  if (values.jobUrl.trim() && !isHttpUrl(values.jobUrl.trim())) {
    errors.jobUrl = "Use a valid http or https URL.";
  }
  return errors;
}

function validateStory(values) {
  const errors = {};
  ["title", "situation", "task", "action", "result"].forEach((field) => {
    if (!values[field].trim()) {
      errors[field] = `${FIELD_LABELS[field] || "Title"} is required.`;
    }
  });
  return errors;
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function upsertApplication(values) {
  const now = new Date().toISOString();
  const existing = db.applications.find((application) => application.id === values.id);
  const application = {
    id: existing?.id || makeId(),
    company: values.company.trim(),
    role: values.role.trim(),
    stage: values.stage,
    jobUrl: values.jobUrl.trim(),
    deadline: values.deadline,
    location: values.location.trim(),
    notes: values.notes.trim(),
    resumeNotes: values.resumeNotes.trim(),
    storyIds: values.storyIds,
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  if (existing) {
    db.applications = db.applications.map((item) => item.id === existing.id ? application : item);
  } else {
    db.applications = [application, ...db.applications];
  }

  state.selectedAppId = application.id;
  saveStore();
}

function upsertStory(values) {
  const now = new Date().toISOString();
  const existing = db.stories.find((story) => story.id === values.id);
  const story = {
    id: existing?.id || makeId(),
    title: values.title.trim(),
    situation: values.situation.trim(),
    task: values.task.trim(),
    action: values.action.trim(),
    result: values.result.trim(),
    reflection: values.reflection.trim(),
    tags: parseTags(values.tags),
    createdAt: existing?.createdAt || now,
    updatedAt: now
  };

  if (existing) {
    db.stories = db.stories.map((item) => item.id === existing.id ? story : item);
  } else {
    db.stories = [story, ...db.stories];
  }

  saveStore();
}

function buildPackText(application) {
  const stories = getLinkedStories(application);
  const lines = [
    `${application.company} - ${application.role}`,
    `Stage: ${stageName(application.stage)}`,
    `Deadline: ${application.deadline ? formatDate(application.deadline) : "None"}`,
    `Location: ${application.location || "None"}`,
    `Posting: ${application.jobUrl || "None"}`,
    "",
    "Resume Notes",
    application.resumeNotes || "No resume notes linked yet.",
    "",
    "Application Notes",
    application.notes || "No application notes yet.",
    "",
    "Stories"
  ];

  if (!stories.length) {
    lines.push("No linked stories yet.");
  }

  stories.forEach((story) => {
    lines.push("");
    lines.push(story.title);
    lines.push(`Tags: ${story.tags.join(", ") || "None"}`);
    lines.push(`Situation: ${story.situation}`);
    lines.push(`Task: ${story.task}`);
    lines.push(`Action: ${story.action}`);
    lines.push(`Result: ${story.result}`);
    if (story.reflection) {
      lines.push(`Reflection: ${story.reflection}`);
    }
  });

  return lines.join("\n");
}

document.addEventListener("click", async (event) => {
  const actionElement = event.target.closest("[data-action]");
  if (!actionElement) {
    return;
  }

  const action = actionElement.dataset.action;
  const id = actionElement.dataset.id;

  if (action === "set-view") {
    state.view = actionElement.dataset.view;
    state.modal = null;
    state.errors = {};
    render();
    return;
  }

  if (action === "add-application") {
    state.modal = { type: "application" };
    state.errors = {};
    render();
    return;
  }

  if (action === "edit-application") {
    state.modal = { type: "application", id };
    state.errors = {};
    render();
    return;
  }

  if (action === "select-application") {
    state.selectedAppId = id;
    render();
    return;
  }

  if (action === "open-pack") {
    state.selectedAppId = id;
    state.view = "pack";
    render();
    return;
  }

  if (action === "delete-application") {
    const application = db.applications.find((item) => item.id === id);
    if (application && window.confirm(`Delete ${application.company} - ${application.role}?`)) {
      db.applications = db.applications.filter((item) => item.id !== id);
      state.selectedAppId = db.applications[0]?.id || null;
      saveStore();
      showToast("Application deleted.");
    }
    return;
  }

  if (action === "save-resume-notes") {
    const application = db.applications.find((item) => item.id === id);
    const textarea = document.getElementById("resume-notes");
    if (application && textarea) {
      application.resumeNotes = textarea.value.trim();
      application.updatedAt = new Date().toISOString();
      saveStore();
      showToast("Resume notes saved.");
    }
    return;
  }

  if (action === "add-story") {
    state.modal = { type: "story" };
    state.errors = {};
    render();
    return;
  }

  if (action === "edit-story") {
    state.modal = { type: "story", id };
    state.errors = {};
    render();
    return;
  }

  if (action === "delete-story") {
    const story = db.stories.find((item) => item.id === id);
    if (story && window.confirm(`Delete ${story.title}?`)) {
      db.stories = db.stories.filter((item) => item.id !== id);
      db.applications = db.applications.map((application) => ({
        ...application,
        storyIds: application.storyIds.filter((storyId) => storyId !== id)
      }));
      saveStore();
      showToast("Story deleted.");
    }
    return;
  }

  if (action === "close-modal") {
    state.modal = null;
    state.errors = {};
    render();
    return;
  }

  if (action === "reset-demo") {
    if (window.confirm("Reset all local Engineer Career Hub data?")) {
      db = seedData();
      state.selectedAppId = db.applications[0]?.id || null;
      state.view = "applications";
      state.modal = null;
      state.errors = {};
      saveStore();
      showToast("Demo data reset.");
    }
    return;
  }

  if (action === "copy-pack") {
    const application = selectedApplication();
    if (application) {
      try {
        await navigator.clipboard.writeText(buildPackText(application));
        showToast("Interview pack copied.");
      } catch {
        showToast("Clipboard access was blocked.");
      }
    }
    return;
  }

  if (action === "print-pack") {
    window.print();
  }
});

document.addEventListener("change", (event) => {
  const element = event.target.closest("[data-change]");
  if (!element) {
    return;
  }

  const change = element.dataset.change;

  if (change === "stage-filter") {
    state.stageFilter = element.value;
    render();
    return;
  }

  if (change === "story-tag-filter") {
    state.storyTag = element.value;
    render();
    return;
  }

  if (change === "pack-select") {
    state.selectedAppId = element.value;
    render();
    return;
  }

  if (change === "application-stage") {
    const application = db.applications.find((item) => item.id === element.dataset.id);
    if (application) {
      application.stage = element.value;
      application.updatedAt = new Date().toISOString();
      saveStore();
      render();
    }
  }
});

document.addEventListener("input", (event) => {
  const element = event.target.closest("[data-input]");
  if (!element) {
    return;
  }

  const input = element.dataset.input;
  if (input === "app-search") {
    state.appQuery = element.value;
    render();
    return;
  }

  if (input === "story-search") {
    state.storyQuery = element.value;
    render();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.matches("#application-form")) {
    event.preventDefault();
    const formData = new FormData(form);
    const values = {
      id: formData.get("id"),
      company: formData.get("company") || "",
      role: formData.get("role") || "",
      stage: formData.get("stage") || "saved",
      jobUrl: formData.get("jobUrl") || "",
      deadline: formData.get("deadline") || "",
      location: formData.get("location") || "",
      notes: formData.get("notes") || "",
      resumeNotes: formData.get("resumeNotes") || "",
      storyIds: formData.getAll("storyIds")
    };
    const errors = validateApplication(values);
    if (Object.keys(errors).length) {
      state.errors = errors;
      render();
      return;
    }
    upsertApplication(values);
    state.modal = null;
    state.errors = {};
    showToast("Application saved.");
    return;
  }

  if (form.matches("#story-form")) {
    event.preventDefault();
    const formData = new FormData(form);
    const values = {
      id: formData.get("id"),
      title: formData.get("title") || "",
      tags: formData.get("tags") || "",
      situation: formData.get("situation") || "",
      task: formData.get("task") || "",
      action: formData.get("action") || "",
      result: formData.get("result") || "",
      reflection: formData.get("reflection") || ""
    };
    const errors = validateStory(values);
    if (Object.keys(errors).length) {
      state.errors = errors;
      render();
      return;
    }
    upsertStory(values);
    state.modal = null;
    state.errors = {};
    showToast("Story saved.");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.modal) {
    state.modal = null;
    state.errors = {};
    render();
  }
});

render();
