const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");

function openModal(title){
    modalTitle.innerText = title;
    modal.classList.add("active");
}

function closeModal(){
    modal.classList.remove("active");
}

modal.addEventListener("click", e=>{
    if(e.target === modal){
        closeModal();
    }
});

/* ======================================
GITHUB PROJECT LOADER
====================================== */

const hiddenRepos = [
    // "nome-do-repo-que-quer-ocultar"
    "rvastack.github.io",
    "RvaStack",
    "Projects-CPP",
];
/* ==========================
BANNERS DOS PROJETOS
========================== */
const projectBanners = {
    "PEGuard": "assets/banners/PEGuard.png",
    "AssaultCube-Cheat-PoC": "assets/banners/AssaultCube.png",
    "EyeMap": "assets/banners/EyeMap.png",
    "Input-Behavior-Research-League-Client-PoC-": "assets/banners/League.png"
};


const githubUser = "RvaStack";
const container = document.getElementById("projectsContainer");

const MAX_VISIBLE = 3;
let showAllProjects = false;
let cachedRepos = [];

/* ==========================
RENDERIZA OS CARDS
========================== */
function renderProjects(){

    container.innerHTML = "";

    const reposToRender = showAllProjects
        ? cachedRepos
        : cachedRepos.slice(0, MAX_VISIBLE);

    reposToRender.forEach(repo => {

        const card = document.createElement("div");
        card.className = "project-card fade-in";

        card.innerHTML = `

            ${projectBanners[repo.name] ? `
                <div class="project-banner">
                    <img src="${projectBanners[repo.name]}" alt="${repo.name}">
                </div>
            ` : ""}

            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${repo.name}</h3>
                    <span class="project-icon">↗</span>
                </div>

                <p class="project-description">
                    ${repo.description ? repo.description : "No description provided."}
                </p>

                <div class="project-tags">
                    ${repo.language ? `<span class="tag">${repo.language}</span>` : ""}
                    <span class="tag">GitHub</span>
                </div>
            </div>
        `;

        card.addEventListener("click", ()=>{
            window.open(repo.html_url, "_blank");
        });

        container.appendChild(card);
    });

    renderToggleButton();
}

/* ==========================
BOTÃO MOSTRAR TODOS
========================== */
function renderToggleButton(){

    let oldBtn = document.getElementById("toggleProjectsBtn");
    if(oldBtn) oldBtn.remove();

    if(cachedRepos.length <= MAX_VISIBLE) return;

    const btn = document.createElement("button");
    btn.id = "toggleProjectsBtn";
    btn.className = "btn btn-secondary";
    btn.style.marginTop = "40px";

    btn.innerText = showAllProjects
        ? "Mostrar menos projetos"
        : "Mostrar todos os projetos";

    btn.onclick = ()=>{
        showAllProjects = !showAllProjects;
        renderProjects();
    };

    container.after(btn);
}

/* ==========================
LOAD DO GITHUB
========================== */
async function loadGithubProjects() {
const pinnedRepos = [
    "AssaultCube-Cheat-PoC",
    "PEGuard",
    "Input-Behavior-Research-League-Client-PoC-"
];
    try {

        const res = await fetch(`https://api.github.com/users/${githubUser}/repos`);
        let repos = await res.json();

        repos.sort((a,b)=>{

            const aPinned = pinnedRepos.includes(a.name);
            const bPinned = pinnedRepos.includes(b.name);

            // pinned sempre primeiro
            if(aPinned && !bPinned) return -1;
            if(!aPinned && bPinned) return 1;

            // dentro do mesmo grupo ordena por update
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        cachedRepos = repos.filter(repo=>{
            if(hiddenRepos.includes(repo.name)) return false;
            if(repo.fork) return false;
            return true;
        });

        renderProjects();

    } catch(err){
        console.error("Erro ao carregar projetos:", err);
    }
}

loadGithubProjects();
