const STORAGE_KEY = "wenelynPortfolioProjects";

const defaultProjects = [
    {
        id: "1",
        name: "Mini Calculator",
        duration: "1 day",
        description: "A simple and responsive calculator built using HTML, CSS, and JavaScript. It performs basic arithmetic operations with a clean and user-friendly interface.",
        image: "IMG_20260824_205807.jpg",
        live: "https://wewenxyl.github.io/Mini_Calculator/",
        github: "https://github.com/wewenxyl/Mini_Calculator",
        feedback: "",
        tags: ["HTML", "CSS", "JavaScript"]
    },
    {
        id: "2",
        name: "Student Task Manager",
        duration: "2–3 days",
        description: "A simple web application designed to help students organize school assignments, deadlines, and task statuses.",
        image: "Screenshot_2026-08-24-21-24-28-33_40deb401b9ffe8e1df2f1cc5ba480b12.jpg",
        live: "https://wewenxyl.github.io/Student_Task_Manager/",
        github: "https://github.com/wewenxyl/Student_Task_Manager",
        feedback: "",
        tags: ["HTML", "CSS", "JavaScript"]
    }
];

let projects = loadProjects();
const $ = (id) => document.getElementById(id);

function loadProjects() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultProjects;
    } catch (error) {
        return defaultProjects;
    }
}

function saveProjects() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function escapeHTML(value = "") {
    return String(value).replace(/[&<>'"]/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
}

function renderProjects() {
    const container = $("projectContainer");
    const empty = $("emptyState");
    container.innerHTML = "";
    empty.hidden = projects.length !== 0;

    projects.forEach((project, index) => {
        const card = document.createElement("article");
        card.className = "project-card";
        card.innerHTML = `
            <div class="project-image">
                <img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.name)}">
            </div>
            <div class="project-content">
                <span class="project-number">PROJECT ${String(index + 1).padStart(2, "0")}</span>
                <h3>${escapeHTML(project.name)}</h3>
                <p>${escapeHTML(project.description)}</p>
                <p class="duration"><strong>Duration:</strong> ${escapeHTML(project.duration)}</p>
                ${project.feedback ? `<p class="feedback"><strong>Client Feedback:</strong> “${escapeHTML(project.feedback)}”</p>` : ""}
                <div class="tags">${project.tags.map(tag => `<span>${escapeHTML(tag.trim())}</span>`).join("")}</div>
                <div class="project-buttons">
                    <a href="${escapeHTML(project.live)}" target="_blank" rel="noopener" class="project-btn live">Live Demo ↗</a>
                    <a href="${escapeHTML(project.github)}" target="_blank" rel="noopener" class="project-btn github">GitHub ↗</a>
                </div>
            </div>`;
        container.appendChild(card);
    });
    renderManageList();
}

function renderManageList() {
    const list = $("manageList");
    list.innerHTML = projects.map((project, index) => `
        <div class="manage-item">
            <div>
                <strong>${String(index + 1).padStart(2, "0")}. ${escapeHTML(project.name)}</strong>
                <small>${escapeHTML(project.duration)}</small>
            </div>
            <div class="manage-actions">
                <button type="button" class="edit-action" data-id="${escapeHTML(project.id)}">Edit</button>
                <button type="button" class="delete-action" data-id="${escapeHTML(project.id)}">Delete</button>
            </div>
        </div>`).join("");
}

function resetForm() {
    $("projectForm").reset();
    $("projectId").value = "";
    $("saveProjectBtn").textContent = "Add Project";
}

function fillForm(project) {
    $("projectId").value = project.id;
    $("projectName").value = project.name;
    $("projectDuration").value = project.duration;
    $("projectDescription").value = project.description;
    $("projectImage").value = project.image;
    $("projectLive").value = project.live;
    $("projectGithub").value = project.github;
    $("projectFeedback").value = project.feedback || "";
    $("projectTags").value = project.tags.join(", ");
    $("saveProjectBtn").textContent = "Update Project";
    $("projectName").focus();
}

$("openManagerBtn").addEventListener("click", () => {
    $("managerPanel").hidden = false;
    $("managerPanel").scrollIntoView({ behavior: "smooth", block: "start" });
});

$("closeManagerBtn").addEventListener("click", () => {
    $("managerPanel").hidden = true;
});

$("cancelEditBtn").addEventListener("click", resetForm);

$("projectForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const id = $("projectId").value;
    const project = {
        id: id || Date.now().toString(),
        name: $("projectName").value.trim(),
        duration: $("projectDuration").value.trim(),
        description: $("projectDescription").value.trim(),
        image: $("projectImage").value.trim(),
        live: $("projectLive").value.trim(),
        github: $("projectGithub").value.trim(),
        feedback: $("projectFeedback").value.trim(),
        tags: $("projectTags").value.split(",").map(tag => tag.trim()).filter(Boolean)
    };

    if (id) {
        projects = projects.map(item => item.id === id ? project : item);
    } else {
        projects.push(project);
    }

    saveProjects();
    renderProjects();
    resetForm();
});

$("manageList").addEventListener("click", (event) => {
    const id = event.target.dataset.id;
    if (!id) return;

    if (event.target.classList.contains("edit-action")) {
        const project = projects.find(item => item.id === id);
        if (project) fillForm(project);
    }

    if (event.target.classList.contains("delete-action")) {
        const project = projects.find(item => item.id === id);
        if (!project) return;
        if (confirm(`Delete “${project.name}”?`)) {
            projects = projects.filter(item => item.id !== id);
            saveProjects();
            renderProjects();
            resetForm();
        }
    }
});

renderProjects();
