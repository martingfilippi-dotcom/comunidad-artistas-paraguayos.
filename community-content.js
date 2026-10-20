(function () {
  "use strict";
  const communityTargets = ["Comunidad", "Ambas"];
  const safeHttps = (value) => {
    try {
      const u = new URL(String(value || ""));
      return u.protocol === "https:" ? u.href : "";
    } catch (_) {
      return "";
    }
  };
  const isPublic = (item) =>
    !!item &&
    String(item.name || item.title || "").trim() !== "" &&
    item.status === "Publicado" &&
    item.permissionVerified === true &&
    communityTargets.includes(item.webTarget);
  const ordered = (items) =>
    items.slice().sort((a, b) => (Number(a.order) || 9999) - (Number(b.order) || 9999));
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined && text !== null) el.textContent = String(text);
    return el;
  };
  const addTag = (container, text) => {
    if (!text) return;
    container.appendChild(make("span", "", text));
  };
  const addSocial = (container, title, value) => {
    const href = safeHttps(value);
    if (!href) return;
    const link = make("a", "artist-social-link", title);
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.title = title;
    link.setAttribute("aria-label", title);
    container.appendChild(link);
  };
  const fetchJson = async (path) => {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return response.json();
  };

  function profilePanel() {
    let panel = document.getElementById("indie-profile-managed");
    if (panel) return panel;
    panel = make("div", "indie-profile-page");
    panel.id = "indie-profile-managed";
    panel.hidden = true;
    const back = make("button", "indie-profile-back", "← VOLVER A ARTISTAS INDEPENDIENTES");
    back.type = "button";
    back.addEventListener("click", showDirectory);
    const layout = make("div", "indie-profile-layout");
    layout.id = "managed-profile-layout";
    const image = make("img");
    image.id = "managed-profile-image";
    image.hidden = true;
    const copy = make("div");
    copy.appendChild(make("p", "gateway-eyebrow", "ARTISTA INDEPENDIENTE · PARAGUAY"));
    copy.appendChild(make("h2", "", ""));
    copy.lastChild.id = "managed-profile-name";
    copy.appendChild(make("p", "", ""));
    copy.lastChild.id = "managed-profile-description";
    copy.appendChild(make("div", "tag-row", ""));
    copy.lastChild.id = "managed-profile-tags";
    copy.appendChild(make("div", "artist-socials", ""));
    copy.lastChild.id = "managed-profile-socials";
    copy.lastChild.setAttribute("aria-label", "Plataformas oficiales del artista");
    layout.append(image, copy);
    panel.append(back, layout);
    const main = document.getElementById("independent-view");
    const footer = main && main.querySelector(".indie-bottom");
    if (footer) main.insertBefore(panel, footer);
    else if (main) main.appendChild(panel);
    return panel;
  }

  function showManagedProfile(item) {
    const panel = profilePanel();
    const name = String(item.name || "").trim();
    const image = panel.querySelector("#managed-profile-image");
    const layout = panel.querySelector("#managed-profile-layout");
    const description = panel.querySelector("#managed-profile-description");
    const tags = panel.querySelector("#managed-profile-tags");
    const socials = panel.querySelector("#managed-profile-socials");
    panel.querySelector("#managed-profile-name").textContent = name;
    description.textContent = String(item.description || item.skills || "Perfil artístico de la Comunidad de Artistas Paraguayos.");
    tags.replaceChildren();
    socials.replaceChildren();
    const genres = Array.isArray(item.genres) ? item.genres : (item.genres ? String(item.genres).split(",") : []);
    genres.map((x) => String(x).trim()).filter(Boolean).slice(0, 6).forEach((x) => addTag(tags, x));
    if (item.city) addTag(tags, item.city);
    if (item.skills && String(item.skills).trim() && String(item.skills).trim() !== String(item.description || "").trim()) {
      addTag(tags, item.skills);
    }
    const socialsData = item.socialLinks || {};
    addSocial(socials, "YouTube", socialsData.youtube);
    addSocial(socials, "Spotify", socialsData.spotify);
    addSocial(socials, "Apple Music", socialsData.appleMusic);
    addSocial(socials, "Instagram", socialsData.instagram);
    addSocial(socials, "TikTok", socialsData.tiktok);
    addSocial(socials, "Sitio oficial", item.externalUrl);
    const imageUrl = safeHttps(item.imageUrl);
    image.hidden = !imageUrl;
    image.style.display = imageUrl ? "" : "none";
    if (imageUrl) {
      image.src = imageUrl;
      image.alt = "Foto de " + name;
    } else {
      image.removeAttribute("src");
      image.alt = "";
    }
    layout.classList.toggle("is-no-image", !imageUrl);

    document.querySelectorAll(".indie-profile-page").forEach((el) => { el.hidden = true; });
    [" .indie-hero", ".community-section-heading", "#indie-artists-grid", "#eco-sello", "#community-updates", ".indie-bottom"].forEach((selector) => {
      const el = document.querySelector(selector.trim());
      if (el) el.hidden = true;
    });
    panel.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function showDirectory() {
    document.querySelectorAll(".indie-profile-page").forEach((el) => { el.hidden = true; });
    [".indie-hero", ".community-section-heading", "#indie-artists-grid", "#eco-sello", ".indie-bottom"].forEach((selector) => {
      const el = document.querySelector(selector);
      if (el) el.hidden = false;
    });
    const updates = document.getElementById("community-updates");
    if (updates) updates.hidden = updates.dataset.hasItems !== "true";
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  async function loadArtists() {
    const grid = document.getElementById("indie-artists-grid");
    if (!grid) return;
    try {
      const payload = await fetchJson("data/community-artists.json");
      const items = ordered(Array.isArray(payload.items) ? payload.items : []).filter(isPublic);
      // Keep the current designed roster until at least one approved Notion record is available.
      if (!items.length) return;
      grid.replaceChildren();
      items.forEach((item, index) => {
        const name = String(item.name || "").trim();
        const button = make("button", "indie-artist");
        button.type = "button";
        button.setAttribute("aria-label", "Ver perfil de " + name);
        const imageUrl = safeHttps(item.imageUrl);
        if (imageUrl) {
          const img = make("img");
          img.src = imageUrl;
          img.alt = "Foto de " + name;
          img.loading = "lazy";
          button.appendChild(img);
        } else {
          button.appendChild(make("div", "community-managed-avatar", name.charAt(0).toUpperCase()));
        }
        button.appendChild(make("span", "indie-artist-no", String(index + 1).padStart(2, "0") + " / ARTISTA"));
        button.appendChild(make("strong", "", name));
        button.appendChild(make("span", "", "Ver perfil del artista ↗"));
        button.addEventListener("click", () => showManagedProfile(item));
        grid.appendChild(button);
      });
    } catch (error) {
      console.warn("El directorio automático de la Comunidad todavía no está disponible.", error);
    }
  }

  function ensureUpdatesSection() {
    let section = document.getElementById("community-updates");
    if (section) return section;
    section = make("section", "community-updates");
    section.id = "community-updates";
    section.hidden = true;
    section.setAttribute("aria-live", "polite");
    const heading = make("div", "community-updates-heading");
    const titleWrap = make("div");
    titleWrap.appendChild(make("span", "", "02 / ACTUALIDAD"));
    const title = make("h2");
    title.append("Novedades de la ");
    const em = make("em", "", "comunidad.");
    title.appendChild(em);
    titleWrap.appendChild(title);
    heading.appendChild(titleWrap);
    heading.appendChild(make("p", "", "Noticias, lanzamientos, eventos y colaboraciones aprobadas por sus protagonistas."));
    section.appendChild(heading);
    section.appendChild(make("div", "community-update-grid", ""));
    section.lastChild.id = "community-publications-grid";
    const label = document.getElementById("eco-sello");
    if (label && label.parentNode) label.insertAdjacentElement("afterend", section);
    else {
      const main = document.getElementById("independent-view");
      if (main) main.appendChild(section);
    }
    return section;
  }

  async function loadPublications() {
    try {
      const payload = await fetchJson("data/community-publications.json");
      const items = ordered(Array.isArray(payload.items) ? payload.items : []).filter(isPublic);
      if (!items.length) return;
      const section = ensureUpdatesSection();
      const grid = section.querySelector("#community-publications-grid");
      grid.replaceChildren();
      items.forEach((item) => {
        const card = make("article", "community-update-card");
        const imageUrl = safeHttps(item.imageUrl);
        if (imageUrl) {
          const img = make("img");
          img.src = imageUrl;
          img.alt = "";
          img.loading = "lazy";
          card.appendChild(img);
        }
        card.appendChild(make("span", "community-update-type", item.type || "Comunidad"));
        card.appendChild(make("h3", "", item.title || ""));
        card.appendChild(make("p", "", item.summary || item.content || ""));
        if (item.date) card.appendChild(make("span", "community-update-date", item.date));
        const href = safeHttps(item.externalUrl);
        if (href) {
          const link = make("a", "community-update-link", "Ver más ↗");
          link.href = href;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          card.appendChild(link);
        }
        grid.appendChild(card);
      });
      section.dataset.hasItems = "true";
      section.hidden = false;
    } catch (error) {
      console.warn("Las publicaciones automáticas de la Comunidad todavía no están disponibles.", error);
    }
  }

  loadArtists();
  loadPublications();
})();
