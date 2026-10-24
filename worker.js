/**
 * Cloudflare Worker Navigation - V25.12 Drag & Drop Edition
 * 包含：Open-Meteo高精度天气、随机多句问候语、高透明度轻量仪表盘、后台拖拽排序
 */

const DEFAULT_DATA = {
  title: "Flaris 导航",
  title_en: "Flaris Navigation",
  adminTitle: "Flaris Admin",
  adminTitle_en: "Flaris Control Panel",
  logo: "fas fa-compass", 
  adminIcon: "fas fa-user-shield",
  favicon: "https://www.google.com/favicon.ico",
  githubUrl: "", 
  customCSS: "",
  customJS: "",
  defaultCityZh: "",
  defaultCityEn: "",
  items: {
    "i_demo1": { title: "Google", url: "https://www.google.com", desc: "全球最大搜索引擎，提供强大的搜索功能，覆盖网页、图片、新闻等海量信息。", icon: "", isPrivate: false },
    "i_demo2": { title: "GitHub", url: "https://github.com", desc: "全球最大的代码托管平台，开发者首选，拥有海量开源项目。", icon: "", isPrivate: false },
    "i_demo3": { title: "NAS管理", url: "http://192.168.1.1", desc: "仅管理员可见的内部链接", icon: "fas fa-hdd", isPrivate: true }
  },
  categories: [
    {
      id: "c_demo", name: "演示栏目", icon: "fas fa-star",
      itemIds: ["i_demo1"], 
      subCategories: [
        { id: "s_demo", name: "常用工具", icon: "fas fa-tools", itemIds: ["i_demo2", "i_demo3"] }
      ]
    }
  ]
};

const I18N_MESSAGES = {
  zh: {
    search_placeholder: "搜索... (按 / 聚焦)",
    search_result: "搜索结果",
    items_count: "个",
    no_content: "暂无内容",
    current_loc: "当前位置",
    private: "私有",
    admin_panel: "管理后台",
    menu: "菜单导航",
    powered_by: "Powered by",
    toggle_theme: "切换明暗模式",
    toggle_lang: "切换语言",
    login_title: "管理员登录",
    login_btn: "登录",
    pwd_placeholder: "请输入密码",
    pwd_error: "密码错误",
    logout: "退出",
    cat_level1: "栏目",
    all_links: "📦 所有链接",
    new_cat: "新建栏目",
    edit_cat: "编辑栏目",
    del_cat: "删除栏目",
    new_sub: "新建子栏目",
    edit_sub: "编辑子栏目",
    del_sub: "删除子栏目",
    export: "导出",
    import: "导入",
    backup: "备份",
    restore: "恢复",
    settings: "设置",
    preview: "预览",
    save_publish: "保存并发布",
    saving: "正在保存...",
    add_link: "添加/关联链接",
    add_first_link: "添加第一个链接",
    link_list: "链接列表",
    links: "链接",
    move_up: "上移",
    move_down: "下移",
    edit_content: "编辑内容源数据",
    unlink: "仅移除引用",
    delete_physical: "彻底物理删除",
    confirm_del_cat: "确定删除？",
    confirm_del_sub: "确定删除此子栏目吗？",
    confirm_unlink: "确定移除引用？(源数据保留)",
    confirm_physical_del: "确定要从数据库中彻底删除此内容吗？\n所有引用此内容的栏目都将自动移除它。",
    confirm_overwrite: "确定要覆盖当前所有数据吗？",
    file_error: "文件格式错误",
    save_success: "保存成功",
    auth_fail: "认证失效，请刷新",
    network_err: "网络错误",
    url_empty: "URL 不能为空",
    select_one: "请选择一项",
    add_success: "成功添加 {n} 项链接",
    added_pool: "已添加至内容池",
    exist_err: "所选链接已存在",
    modal_name: "名称",
    modal_icon: "图标 (类名或URL)",
    modal_icon_ph: "fas fa-star 或 https://...",
    modal_site_title_zh: "中文网站标题",
    modal_site_title_en: "英文网站标题",
    modal_admin_title_zh: "中文管理后台标题",
    modal_admin_title_en: "英文管理后台标题",
    modal_admin_title_ph: "例如：我的导航控制台",
    modal_admin_icon: "管理入口图标",
    modal_admin_icon_ph: "fas fa-user-shield 或 URL",
    modal_admin_logo: "后台左上角 Logo",
    modal_admin_logo_ph: "fas fa-cog 或 URL",
    modal_logo: "Logo (类名/URL)",
    modal_favicon: "Favicon (URL)",
    modal_github: "GitHub 项目地址",
    modal_github_ph: "https://github.com/...",
    modal_css: "自定义 CSS",
    modal_js: "自定义 JS",
    modal_city_zh: "固定城市 (中文，如：北京)",
    modal_city_en: "固定城市 (英文，如：Beijing)",
    modal_city_ph: "留空则自动IP定位",
    modal_title: "标题",
    modal_desc: "描述",
    modal_custom_icon: "自定义图标 URL",
    modal_custom_icon_ph: "留空则自动获取",
    modal_is_private: "私有链接",
    modal_new: "新建",
    modal_select: "从库中选择",
    modal_selected: "已选 {n} 项",
    modal_edit_tip: "修改源数据会同步更新所有引用。",
    btn_cancel: "取消",
    btn_confirm: "确定",
    tab_public: "前台展示",
    tab_admin: "后台管理",
    tab_advanced: "高级设置",
    greet_dawn: [
      "清晨好，愿你拥有美好的一天 ✨",
      "早安！新的一天充满无限可能 🌅",
      "晨光熹微，愿你心情如阳光般明媚 🌸",
      "早上好，开启神清气爽的一天 🍃"
    ],
    greet_morning: [
      "上午好，开启高效的创作时光 ☕",
      "上午好，保持专注，灵感满满 💡",
      "加油，愿你今天的每一项任务都轻松搞定 🚀",
      "保持微笑，开启元气满满的上午 ☀️"
    ],
    greet_noon: [
      "中午好，记得按时午休与用餐 🥗",
      "午休时间到，好好放松一下吧 🍱",
      "中午好，给大脑补充一点能量 🍵",
      "吃个美味的午饭，下午继续加油 🥪"
    ],
    greet_afternoon: [
      "下午好，保持专注，继续加油 💻",
      "下午茶时间到了，喝杯水歇一歇吧 🍰",
      "下午好，愿你思路清晰，事半功倍 🌟",
      "伸个懒腰，打起精神迎战下午 ☕"
    ],
    greet_evening: [
      "傍晚好，卸下疲惫，享受片刻宁静 🌇",
      "晚霞真美，祝你拥有惬意的傍晚 🌆",
      "结束了一天的忙碌，好好犒劳下自己 🍲",
      "傍晚好，享受属于你的轻松时光 ✨"
    ],
    greet_night: [
      "夜深了，注意作息，早点休息 🌙",
      "晚安，愿你有一个香甜的梦境 💤",
      "忙碌了一天，今晚好好犒劳自己吧 🛋️",
      "夜色渐深，卸下一天的疲惫，早点入睡 🌌"
    ]
  },
  en: {
    search_placeholder: "Search... (Press /)",
    search_result: "Search Results",
    items_count: "items",
    no_content: "No Content",
    current_loc: "Location",
    private: "Private",
    admin_panel: "Admin Panel",
    menu: "Menu",
    powered_by: "Powered by",
    toggle_theme: "Toggle Theme",
    toggle_lang: "Switch Language",
    login_title: "Admin Login",
    login_btn: "Login",
    pwd_placeholder: "Enter Password",
    pwd_error: "Incorrect Password",
    logout: "Logout",
    cat_level1: "Categories",
    all_links: "📦 All Links",
    new_cat: "New Category",
    edit_cat: "Edit Category",
    del_cat: "Delete Category",
    new_sub: "New Sub-Category",
    edit_sub: "Edit Sub-Category",
    del_sub: "Delete Sub-Category",
    export: "Export",
    import: "Import",
    backup: "Backup",
    restore: "Restore",
    settings: "Settings",
    preview: "Preview",
    save_publish: "Save & Publish",
    saving: "Saving...",
    add_link: "Add / Link Item",
    add_first_link: "Add First Link",
    link_list: "Link List",
    links: "Links",
    move_up: "Move Up",
    move_down: "Move Down",
    edit_content: "Edit Source Data",
    unlink: "Unlink Only",
    delete_physical: "Delete Permanently",
    confirm_del_cat: "Delete this category?",
    confirm_del_sub: "Delete this sub-category?",
    confirm_unlink: "Unlink? (Source data remains)",
    confirm_physical_del: "Permanently delete from database?\nIt will be removed from all categories.",
    confirm_overwrite: "Overwrite all current data?",
    file_error: "Invalid file format",
    save_success: "Saved Successfully",
    auth_fail: "Auth failed, please refresh",
    network_err: "Network Error",
    url_empty: "URL cannot be empty",
    select_one: "Please select an item",
    add_success: "Added {n} items",
    added_pool: "Added to content pool",
    exist_err: "Item already exists",
    modal_name: "Name",
    modal_icon: "Icon (Class or URL)",
    modal_icon_ph: "fas fa-star or https://...",
    modal_site_title_zh: "Chinese Site Title",
    modal_site_title_en: "English Site Title",
    modal_admin_title_zh: "Chinese Admin Title",
    modal_admin_title_en: "English Admin Title",
    modal_admin_title_ph: "e.g. My Admin Console",
    modal_admin_icon: "Admin Entry Icon",
    modal_admin_icon_ph: "fas fa-user-shield or URL",
    modal_admin_logo: "Admin Top-Left Logo",
    modal_admin_logo_ph: "fas fa-cog or URL",
    modal_logo: "Logo (Class/URL)",
    modal_favicon: "Favicon (URL)",
    modal_github: "GitHub Repo URL",
    modal_github_ph: "https://github.com/...",
    modal_css: "Custom CSS",
    modal_js: "Custom JS",
    modal_city_zh: "Default City (Chinese, e.g. 北京)",
    modal_city_en: "Default City (English, e.g. Beijing)",
    modal_city_ph: "Leave blank for auto IP location",
    modal_title: "Title",
    modal_desc: "Description",
    modal_custom_icon: "Custom Icon URL",
    modal_custom_icon_ph: "Auto-fetch if empty",
    modal_is_private: "Private Link",
    modal_new: "Create New",
    modal_select: "Select Existing",
    modal_selected: "Selected {n}",
    modal_edit_tip: "Editing source data updates all references.",
    btn_cancel: "Cancel",
    btn_confirm: "Confirm",
    tab_public: "Public View",
    tab_admin: "Admin Panel",
    tab_advanced: "Advanced",
    greet_dawn: [
      "Early morning, have a wonderful day ✨",
      "Good morning! A new day full of possibilities 🌅",
      "Rise and shine, make today count 🌸"
    ],
    greet_morning: [
      "Good morning, time to be productive ☕",
      "Morning! Stay focused and inspired 💡",
      "Have a great and productive morning 🚀"
    ],
    greet_noon: [
      "Good noon, enjoy your lunch break 🥗",
      "Time for lunch! Take a short break 🍱",
      "Good noon, recharge your energy 🍵"
    ],
    greet_afternoon: [
      "Good afternoon, keep up the great work 💻",
      "Afternoon! Time for a short tea break 🍰",
      "Stay energized and make progress 🌟"
    ],
    greet_evening: [
      "Good evening, relax and unwind 🌇",
      "Enjoy the peaceful evening vibes 🌆",
      "Time to slow down and rest 🍲"
    ],
    greet_night: [
      "Late night, get some good rest 🌙",
      "Good night, sweet dreams 💤",
      "Rest well and recharge for tomorrow 🛋️"
    ]
  }
};

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;
      const isAdminReq = url.searchParams.get("admin") === "1";

      if (!env.NAV_DB) throw new Error("KV Namespace 'NAV_DB' not bound.");

      if (request.method === "OPTIONS") {
        return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization" }});
      }

      if (path === "/api/data" && request.method === "GET") {
        if (isAdminReq) {
          if (!checkAuth(request, env)) return new Response("Unauthorized", { status: 401 });
          let data = await env.NAV_DB.get("nav_data", { type: "json" });
          if (!data) data = DEFAULT_DATA;
          data = ensureData(data);
          return new Response(JSON.stringify(data), { headers: { "Content-Type": "application/json" } });
        }

        const cache = caches.default;
        const cacheKey = new Request(url.toString(), request);
        let response = await cache.match(cacheKey);

        if (!response) {
          let data = await env.NAV_DB.get("nav_data", { type: "json" });
          data = ensureData(data);
          
          const publicData = {
            title: data.title,
            title_en: data.title_en,
            logo: data.logo,
            favicon: data.favicon,
            githubUrl: data.githubUrl,
            adminIcon: data.adminIcon,
            adminTitle: data.adminTitle,
            adminTitle_en: data.adminTitle_en,
            customCSS: data.customCSS,
            customJS: data.customJS,
            defaultCityZh: data.defaultCityZh,
            defaultCityEn: data.defaultCityEn,
            categories: data.categories,
            items: {}
          };

          if (data.items) {
              for (const key in data.items) {
                  if (!data.items[key].isPrivate) {
                      publicData.items[key] = {
                          title: data.items[key].title,
                          url: data.items[key].url,
                          desc: data.items[key].desc,
                          icon: data.items[key].icon
                      };
                  }
              }
          }

          response = new Response(JSON.stringify(publicData), {
            headers: { 
              "Content-Type": "application/json", 
              "Cache-Control": "public, max-age=300, stale-while-revalidate=600" 
            }
          });
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
        return response;
      }

      if (path === "/api/login" && request.method === "POST") {
        const { password } = await request.json();
        return new Response(JSON.stringify({ success: password === env.ADMIN_PASSWORD, token: password === env.ADMIN_PASSWORD ? password : "" }), { headers: { "Content-Type": "application/json" } });
      }

      if (path === "/api/save" && request.method === "POST") {
        if (!checkAuth(request, env)) return new Response("Unauthorized", { status: 401 });
        const body = await request.json();
        await env.NAV_DB.put("nav_data", JSON.stringify(body));
        
        const cache = caches.default;
        const publicUrl = new URL(request.url);
        publicUrl.search = ""; 
        ctx.waitUntil(cache.delete(new Request(publicUrl.toString())));

        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
      }

      if (path === "/admin") {
        let html = getAdminPage();
        html = html.replace('__I18N_DATA__', JSON.stringify(I18N_MESSAGES));
        return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
      }
      
      let html = getPublicPage();
      html = html.replace('__I18N_DATA__', JSON.stringify(I18N_MESSAGES));
      return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });

    } catch (e) {
      return new Response("Worker Error: " + e.message, { status: 500 });
    }
  },
};

function checkAuth(req, env) {
  const h = req.headers.get("Authorization");
  return h && h.replace("Bearer ", "") === env.ADMIN_PASSWORD;
}

function ensureData(data) {
  try {
    if (!data) data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    if (!data.items) data.items = {};
    if (!data.categories) data.categories = [];
    const keys = ['title', 'title_en', 'adminTitle', 'adminTitle_en', 'logo', 'adminLogo', 'adminIcon', 'favicon', 'githubUrl', 'customCSS', 'customJS', 'defaultCityZh', 'defaultCityEn'];
    keys.forEach(k => { if (data[k] === undefined) data[k] = DEFAULT_DATA[k] || ""; });
    if (data.categories) {
        data.categories.forEach(c => { 
            if(!c.itemIds) c.itemIds = []; 
            if(c.subCategories) {
                c.subCategories.forEach(s => { 
                    if(!s.itemIds) s.itemIds = []; 
                    if(s.icon === undefined) s.icon = ""; 
                });
            }
        });
    }
    return data;
  } catch(e) {
    console.error("Data integrity error, resetting to default", e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

// 1. 访客端 (Public)
function getPublicPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Loading...</title>
<link rel="icon" href="">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script>tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:'#3b82f6'}}}}</script>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; overflow-x: hidden;}
.glass{background:rgba(255,255,255,0.7);backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(255,255,255,0.3)}
.dark .glass{background:rgba(15,23,42,0.7);border-bottom:1px solid rgba(255,255,255,0.05)}

.card-glass{
    background:rgba(255,255,255,0.75); 
    backdrop-filter:blur(16px) saturate(180%);
    border:1px solid rgba(255,255,255,0.6);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform, box-shadow, border-color;
    transform: translate3d(0, 0, 0);
}
.dark .card-glass{
    background:rgba(30,41,59,0.55);
    border:1px solid rgba(255,255,255,0.06);
    box-shadow:0 4px 6px -1px rgba(0,0,0,0.2);
}
.card-glass:hover {
    border-color: rgba(249, 115, 22, 0.5);
    box-shadow: 0 12px 24px -6px rgba(249, 115, 22, 0.15), 0 0 0 1px rgba(249, 115, 22, 0.2);
    transform: translate3d(0, -4px, 0);
}

.ambient-blob {
    position: fixed;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    filter: blur(80px);
    z-index: -1;
    opacity: 0.15;
    pointer-events: none;
    will-change: transform;
    transform: translate3d(0, 0, 0);
    animation: blobFloat 12s ease-in-out infinite alternate;
}
.dark .ambient-blob { opacity: 0.25; filter: blur(100px); }
@keyframes blobFloat {
    0% { transform: translate3d(-50px, -50px, 0) scale(1); }
    100% { transform: translate3d(100px, 80px, 0) scale(1.15); }
}

@keyframes fadeInUp {
    from { opacity: 0; transform: translate3d(0, 12px, 0); }
    to { opacity: 1; transform: translate3d(0, 0, 0); }
}
.animate-fade-in {
    animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    will-change: transform, opacity;
}

@keyframes cursorBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
}
.typing-cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: currentColor;
    vertical-align: -0.15em;
    margin-left: 2px;
    animation: cursorBlink 0.8s infinite;
}

.dropdown-menu{opacity:0;visibility:hidden;transform:translateY(10px);transition:all 0.2s cubic-bezier(0.16,1,0.3,1);pointer-events:none}
.group:hover .dropdown-menu{opacity:1;visibility:visible;transform:translateY(0);pointer-events:auto}
.scrollbar-none::-webkit-scrollbar {display: none;}
#error-display { display: none; position: fixed; top: 0; left: 0; background: red; color: white; padding: 10px; z-index: 9999; font-size: 12px; }

#splash-screen {
    position: fixed; inset: 0; z-index: 99999;
    background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #e2e8f0 100%);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.dark #splash-screen {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0b1120 100%);
}

@keyframes pulseGlow {
    0%, 100% { transform: scale(0.95); opacity: 0.3; }
    50% { transform: scale(1.15); opacity: 0.6; }
}
.cat-glow { animation: pulseGlow 2.5s ease-in-out infinite; }

@keyframes catFloat {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-6px) scale(1.02); }
}
.cat-container { animation: catFloat 2.8s cubic-bezier(0.45, 0, 0.55, 1) infinite; }

@keyframes tailWag {
    0%, 100% { transform: rotate(0deg); }
    30% { transform: rotate(-12deg); }
    70% { transform: rotate(8deg); }
}
.cat-tail { transform-origin: bottom left; animation: tailWag 2s ease-in-out infinite; }

.ashine-boot-progress {  
    width: 0%;  
    animation: bootLoad 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
@keyframes bootLoad {  
    0% { width: 0%; }  
    60% { width: 75%; }  
    100% { width: 100%; }
}
.boot-leave-active {  
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.boot-leave-to {  
    opacity: 0;  
    transform: scale(1.04);
}
</style>
</head>
<body class="text-slate-700 dark:text-slate-200 min-h-screen flex flex-col transition-colors duration-500 bg-fixed bg-gradient-to-b from-[#f8fafc] via-[#eff6ff] to-[#e2e8f0] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0b1120]">

<div class="ambient-blob bg-blue-400 top-[-10%] left-[-10%]"></div>
<div class="ambient-blob bg-orange-400 bottom-[-10%] right-[-10%]" style="animation-delay: -6s;"></div>

<div id="error-display"></div>

<div id="splash-screen">
  <div class="relative flex flex-col items-center justify-center">
    <div class="absolute w-28 h-28 bg-gradient-to-tr from-orange-400 to-amber-300 rounded-full blur-2xl cat-glow"></div>
    <div class="relative w-24 h-24 mb-4 flex items-center justify-center cat-container">
      <svg class="w-20 h-20 text-slate-900 dark:text-white drop-shadow-xl" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 46C16 34.9543 24.9543 26 36 26C47.0457 26 56 34.9543 56 46V50H16V46Z" fill="currentColor"/>
        <path d="M18 16L27 28H15L18 16Z" fill="currentColor"/>
        <path d="M46 16L49 28H37L46 16Z" fill="currentColor"/>
        <path d="M20 20L25 27H17L20 20Z" class="text-orange-500" fill="currentColor"/>
        <path d="M44 20L47 27H39L44 20Z" class="text-orange-500" fill="currentColor"/>
        <circle cx="32" cy="30" r="14" fill="currentColor"/>
        <path d="M24 30C25.5 32 27.5 32 29 30" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M35 30C36.5 32 38.5 32 40 30" stroke="#f97316" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="32" cy="34" r="1.5" fill="#f97316"/>
        <circle cx="23" cy="33" r="2" fill="#f97316" opacity="0.4"/>
        <circle cx="41" cy="33" r="2" fill="#f97316" opacity="0.4"/>
        <path class="cat-tail" d="M52 48C56 44 58 38 56 32C55 29 52 28 50 30C48 32 50 35 51 37C52 40 50 44 46 47" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      </svg>
      <div class="absolute -top-1 -right-1 text-orange-500 animate-bounce"><i class="fas fa-sparkles text-sm"></i></div>
    </div>
    <div class="text-xl font-bold tracking-wider text-slate-800 dark:text-white mb-4" id="splash-title">Flaris Navigation</div>
    <div class="w-44 h-1 bg-slate-200/80 dark:bg-slate-700/80 rounded-full overflow-hidden shadow-inner">
      <div class="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 ashine-boot-progress"></div>
    </div>
    <div class="mt-3 text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-widest uppercase">Initializing...</div>
  </div>
</div>

<div id="app" class="flex-1 flex flex-col">
  <header class="fixed top-0 inset-x-0 h-16 glass z-50 transition-all duration-300">
    <div class="container mx-auto px-4 h-full flex items-center justify-between">
      <div @click="resetToHome" class="flex items-center gap-3 shrink-0 mr-4 cursor-pointer group" title="返回首页">
        <div v-if="isImageUrl(db.logo)" class="w-8 h-8 rounded overflow-hidden shadow-sm group-hover:scale-105 transition-transform"><img :src="db.logo" class="w-full h-full object-cover" loading="lazy"></div>
        <div v-else class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform"><i :class="db.logo||'fas fa-compass'"></i></div>
        <span class="font-bold text-lg tracking-tight hidden md:block text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">{{ currentDisplayTitle }}</span>
      </div>

      <nav class="hidden md:flex h-full items-center space-x-1">
        <div v-for="(cat,idx) in db.categories" :key="cat.id" class="group relative h-full flex items-center px-1">
          <button @click="selectCategory(idx)" class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 transform active:scale-95" :class="(!isSearching&&activeCatIdx===idx)?'bg-white text-blue-600 shadow-md shadow-blue-500/10 ring-1 ring-black/5 dark:bg-slate-800 dark:text-blue-400 dark:ring-white/10':'text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:ring-1 hover:ring-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 dark:text-slate-400 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 dark:hover:ring-orange-400/50'">
            <img v-if="isImageUrl(cat.icon)" :src="cat.icon" class="w-4 h-4 object-contain" loading="lazy"><i v-else :class="cat.icon||'fas fa-folder'" class="text-xs"></i><span>{{cat.name}}</span>
          </button>
          <div v-if="cat.subCategories && cat.subCategories.length" class="dropdown-menu absolute top-[85%] left-0 w-max max-w-xl p-0 pt-4 z-50">
            <div class="flex flex-wrap gap-2">
              <button v-for="(sub,sIdx) in cat.subCategories" :key="sub.id" @click.stop="selectSubCategory(idx,sIdx)" class="group/item relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-md backdrop-blur-md" :class="(!isSearching&&activeCatIdx===idx&&activeSubIdx===sIdx)?'bg-blue-600 text-white ring-2 ring-blue-200 dark:ring-blue-900':'bg-white/90 text-slate-600 hover:bg-orange-50 hover:text-orange-600 hover:ring-1 hover:ring-orange-500/50 hover:shadow-md hover:shadow-orange-500/20 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:bg-orange-900/30 dark:hover:text-orange-400 dark:hover:ring-orange-400/50 hover:scale-105'">
                <div v-if="sub.icon" class="opacity-70 group-hover/item:opacity-100"><img v-if="isImageUrl(sub.icon)" :src="sub.icon" class="w-3 h-3 object-contain" loading="lazy"><i v-else :class="sub.icon"></i></div>
                <span>{{sub.name}}</span>
                <span class="flex items-center justify-center h-4 min-w-[16px] px-1 rounded-full text-[9px] shadow-sm transition-colors" :class="(!isSearching&&activeCatIdx===idx&&activeSubIdx===sIdx)?'bg-white/20 text-white':'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500'">{{sub.itemIds.length}}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div class="flex-1 flex justify-end md:flex-none items-center gap-4">
        <div class="relative group w-full max-w-[140px] md:max-w-[180px] transition-all focus-within:max-w-[220px]">
          <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input ref="searchInputRef" v-model="searchQuery" type="text" :placeholder="t('search_placeholder')" class="w-full bg-white/50 dark:bg-slate-800/50 border border-transparent focus:border-orange-400 focus:bg-white dark:focus:bg-slate-800 rounded-full py-1.5 pl-9 pr-8 text-sm outline-none transition-all shadow-sm focus:shadow-md">
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-400 pointer-events-none hidden sm:inline-block">/</span>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <a v-if="db.githubUrl" :href="db.githubUrl" target="_blank" title="GitHub Project" class="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white/50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-full transition-all"><i class="fab fa-github text-lg"></i></a>
          <a href="/admin" target="_blank" :title="currentDisplayAdminTitle||t('admin_panel')" class="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white/50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 rounded-full transition-all"><img v-if="isImageUrl(db.adminIcon)" :src="db.adminIcon" class="w-5 h-5 object-contain" loading="lazy"><i v-else :class="db.adminIcon||'fas fa-user-shield'" class="text-base"></i></a>
          
          <button @click="toggleLang" class="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-all font-bold text-xs uppercase" :title="t('toggle_lang')">
             <span>{{ lang }}</span>
          </button>

          <button @click="toggleTheme" :title="t('toggle_theme')" class="w-9 h-9 flex items-center justify-center text-amber-500 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-300 dark:hover:bg-slate-800 rounded-full transition-all"><i :class="isDark?'fas fa-moon':'fas fa-sun'"></i></button>
          <button class="md:hidden text-slate-600 ml-2 text-xl" @click="mobileMenuOpen=!mobileMenuOpen"><i class="fas fa-bars"></i></button>
        </div>
      </div>
    </div>
  </header>

  <div v-if="mobileMenuOpen" class="fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm md:hidden" @click="mobileMenuOpen=false"></div>
  <transition name="drawer">
    <div v-if="mobileMenuOpen" class="fixed inset-y-0 right-0 z-[70] w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl md:hidden border-l border-slate-200 dark:border-slate-700 flex flex-col">
      <div class="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <span class="font-bold text-lg text-slate-800 dark:text-white" @click="resetToHome;mobileMenuOpen=false">{{ currentDisplayTitle }}</span>
        <div class="flex gap-2">
            <button @click="toggleLang" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase">{{ lang }}</button>
            <button @click="toggleTheme" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-amber-500"><i :class="isDark?'fas fa-moon':'fas fa-sun'"></i></button>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-2">
         <div v-for="(cat,idx) in db.categories" :key="cat.id">
           <button @click="selectCategory(idx);mobileMenuOpen=false" class="w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3" :class="activeCatIdx===idx?'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400':'text-slate-600 dark:text-slate-400 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-800 dark:hover:text-orange-400'">
             <img v-if="isImageUrl(cat.icon)" :src="cat.icon" class="w-5 h-5 object-contain" loading="lazy"><i v-else :class="cat.icon||'fas fa-folder'"></i>{{cat.name}}
           </button>
           <div v-if="activeCatIdx===idx && cat.subCategories && cat.subCategories.length" class="mt-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-700 space-y-1">
             <button v-for="(sub,sIdx) in cat.subCategories" :key="sub.id" @click.stop="selectSubCategory(idx,sIdx);mobileMenuOpen=false" class="w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex justify-between items-center" :class="(activeSubIdx===sIdx)?'text-blue-600 font-bold bg-blue-50/50 dark:text-blue-400':'text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400'"><span>{{sub.name}}</span><span class="text-[10px] opacity-50">{{sub.itemIds.length}}</span></button>
           </div>
         </div>
      </div>
    </div>
  </transition>

  <main class="flex-1 container mx-auto px-4 pt-28 pb-4 max-w-7xl flex flex-col animate-fade-in" :key="activeCatIdx + '-' + activeSubIdx + '-' + isSearching">
    <div v-if="loading" class="flex justify-center mt-20"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div></div>
    <div v-else class="flex-1 flex flex-col">
      <div v-if="isSearching" class="mb-6 flex items-center gap-2 text-lg font-bold text-slate-700 dark:text-slate-200"><i class="fas fa-search text-orange-500"></i><span>{{ t('search_result') }}: "{{searchQuery}}"</span><span class="text-sm font-normal text-slate-400 ml-2">({{displayedItems.length}} {{ t('items_count') }})</span></div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-4">
        <a v-for="item in displayedItems" :key="item.id" :href="item.url" target="_blank" class="group card-glass p-3 rounded-xl flex flex-col relative overflow-hidden h-24">
          <div class="flex flex-col items-center justify-center h-full transition-opacity duration-300 group-hover:opacity-10">
             <div class="relative mb-2">
               <div class="w-8 h-8 rounded-lg bg-white/50 dark:bg-slate-700/50 p-1.5 flex items-center justify-center shadow-sm">
                 <img :src="item.icon||getFav(item.url)" @error="defIcon" class="w-full h-full object-contain rounded-md filter group-hover:brightness-110" loading="lazy">
               </div>
             </div>
             <h3 class="font-bold text-sm text-slate-800 dark:text-slate-100 text-center leading-tight line-clamp-1 group-hover:text-orange-600 transition-colors">{{item.title}}</h3>
          </div>
          
          <div class="absolute inset-0 px-3 py-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
             <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium overflow-y-auto max-h-full scrollbar-none text-center">{{item.desc|| t('no_content') }}</p>
          </div>
          
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20"><i class="fas fa-external-link-alt text-xs text-orange-400"></i></div>
        </a>
      </div>
      <div v-if="displayedItems.length===0" class="flex flex-col items-center justify-center py-20 text-slate-400 flex-1"><div class="w-16 h-16 bg-white/50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm"><i class="fas fa-box-open text-slate-300"></i></div><p class="text-sm">{{ t('no_content') }}</p></div>
      
      <!-- ✨ 底部仪表盘：高透明度、舒适间距、多句随机问候语 -->
      <div v-if="!isSearching" class="mt-auto pt-16 pb-2 flex flex-col items-center gap-6 w-full">
        <!-- 第一行：问候语卡片（高透明度） -->
        <div class="inline-flex items-center justify-center px-5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm">
          <span class="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide whitespace-nowrap">{{ displayedGreeting }}<span v-if="isTypingActive" class="typing-cursor"></span></span>
        </div>

        <!-- 第二行：时间天气居左/居中，右下角当前位置指示器保持在右侧 -->
        <div class="relative w-full flex items-center justify-center min-h-[44px]">
          <!-- 时间/日期 + 天气卡片（高透明度） -->
          <div class="inline-flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm">
            <div class="flex items-center gap-2 cursor-pointer transition-opacity duration-300 hover:opacity-80" :title="lang==='zh'?'点击切换公历/农历':''" @click="toggleCalendarMode">
              <div class="flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/90 text-white shadow-sm text-sm"><i class="fas fa-clock"></i></div>
              <span class="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">{{ currentTime }}</span>
            </div>
            <span class="opacity-30">|</span>
            <div class="flex items-center gap-2">
              <div class="flex items-center justify-center w-7 h-7 rounded-full bg-orange-500/90 text-white shadow-sm text-sm"><i class="fas fa-map-marker-alt"></i></div>
              <span class="text-sm font-bold text-slate-800 dark:text-slate-100">{{ locationText }}</span>
              <div class="flex items-center gap-1.5 text-sm font-extrabold text-blue-600 dark:text-blue-400 ml-1">
                <i :class="weatherIcon"></i>
                <span>{{ weatherText }}</span>
              </div>
            </div>
          </div>

          <!-- 右下角原位的“当前位置/栏目指示器”（高透明度） -->
          <div class="absolute right-0 hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 shadow-sm">
            <div class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/90 text-white shadow-sm text-xs"><i class="fas fa-folder-open"></i></div>
            <span class="text-sm font-bold text-slate-800 dark:text-slate-100">{{currentCatName}}</span>
            <template v-if="currentSubName"><i class="fas fa-chevron-right text-xs text-orange-400"></i><span class="text-sm font-bold text-amber-600 dark:text-amber-400">{{currentSubName}}</span></template>
            <span class="ml-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/30 dark:bg-black/20 text-slate-700 dark:text-slate-200 border border-black/5 dark:border-white/5">{{displayedItems.length}}</span>
          </div>
        </div>
      </div>
    </div>
  </main>
  
  <footer class="bg-slate-200/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-white/20 dark:border-white/5 mt-4 py-6">
    <div class="container mx-auto px-4 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
      <div class="flex items-center gap-1 cursor-default group"><span>&copy; ${new Date().getFullYear()}</span><span class="font-bold transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500">{{ currentDisplayTitle }}</span></div>
      <span class="hidden sm:inline-block opacity-30">|</span>
      <div class="flex items-center gap-2 cursor-default"><span>{{ t('powered_by') }}</span><a href="https://workers.cloudflare.com/" target="_blank" class="opacity-80 hover:opacity-100 transition-opacity"><img src="https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare" alt="Cloudflare Workers" class="h-4"></a></div>
    </div>
  </footer>
</div>
<script id="i18n-data" type="application/json">__I18N_DATA__</script>
<script>
  window.onerror = function(msg, url, line) { 
      const el = document.getElementById('error-display');
      if(el) { el.style.display = 'block'; el.innerText = 'Error: ' + msg + ' (' + line + ')'; }
      return false; 
  };
  
  let isSplashDone = false;
  function closeSplash() {
      const sp = document.getElementById('splash-screen');
      if (sp) {
          sp.classList.add('boot-leave-active', 'boot-leave-to');
          setTimeout(() => { 
              if(sp && sp.parentNode) sp.parentNode.removeChild(sp); 
              isSplashDone = true;
              window.dispatchEvent(new CustomEvent('splashDone'));
          }, 500);
      }
  }
  setTimeout(closeSplash, 1200);

  // 📌 高精度农历转换引擎 (1900 - 2100)
  const LunarCalendar = (function() {
      const lunarInfo = [
          0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
          0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x09560,0x14977,
          0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
          0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
          0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
          0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
          0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
          0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b5a0,0x195a6,
          0x09560,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
          0x04af5,0x04970,0x064b0,0x07433,0x0ea50,0x06b55,0x05ad0,0x02b60,0x09571,0x092e0,
          0x0c96d,0x0c950,0x0d4a0,0x1da54,0x0b550,0x056a0,0x1a4d7,0x025d0,0x092d0,0x0aca2,
          0x0a950,0x0b558,0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,
          0x0e950,0x06aa0,0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,
          0x05b57,0x056a0,0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,
          0x0b5a0,0x195a6,0x09560,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,
          0x0ab60,0x09570,0x04af5,0x04970,0x064b0,0x07433,0x0ea50,0x06b55,0x05ad0,0x02b60,
          0x09571,0x092e0,0x0c96d,0x0c950,0x0d4a0,0x1da54,0x0b550,0x056a0,0x1a4d7,0x025d0,
          0x092d0,0x0aca2,0x0a950,0x0b558,0x06ca0,0x0b550
      ];

      const gan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
      const zhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
      const monthsName = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
      const daysName = ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
                        "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
                        "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"];

      function lYearDays(y) {
          let sum = 348;
          for (let i = 0x8000; i > 0x8; i >>= 1) {
              sum += (lunarInfo[y - 1900] & i) ? 1 : 0;
          }
          return sum + leapDays(y);
      }

      function leapDays(y) {
          if (leapMonth(y)) {
              return (lunarInfo[y - 1900] & 0x10000) ? 30 : 29;
          }
          return 0;
      }

      function leapMonth(y) {
          return lunarInfo[y - 1900] & 0xf;
      }

      function monthDays(y, m) {
          return (lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29;
      }

      return function(date) {
          let i, leap = 0, temp = 0;
          let baseDate = new Date(1900, 0, 31);
          let offset = Math.floor((date - baseDate) / 86400000);

          let year = 1900;
          for (i = 1900; i < 2100 && offset > 0; i++) {
              temp = lYearDays(i);
              offset -= temp;
              year = i;
          }

          if (offset < 0) {
              offset += temp;
              year--;
          }

          let leapM = leapMonth(year);
          let isLeap = false;

          for (i = 1; i < 13 && offset > 0; i++) {
              if (leapM > 0 && i === (leapM + 1) && !isLeap) {
                  --i;
                  isLeap = true;
                  temp = leapDays(year);
              } else {
                  temp = monthDays(year, i);
              }

              if (isLeap && i === (leapM + 1)) isLeap = false;

              offset -= temp;
              if (!isLeap) leap++;
          }

          if (offset === 0 && leapM > 0 && i === leapM + 1) {
              if (isLeap) {
                  isLeap = false;
              } else {
                  isLeap = true;
                  --i;
                  --leap;
              }
          }

          if (offset < 0) {
              offset += temp;
              --i;
              --leap;
          }

          let month = i;
          let day = offset + 1;
          let gZ = gan[(year - 4) % 10] + zhi[(year - 4) % 12];

          let mStr = (isLeap ? "闰" : "") + (monthsName[month - 1] || "正") + "月";
          let dStr = daysName[day - 1] || "初一";

          return {
              year: year,
              month: month,
              day: day,
              isLeap: isLeap,
              yearStr: gZ + "年",
              monthStr: mStr,
              dayStr: dStr,
              fullStr: gZ + "年 " + mStr + dStr
          };
      };
  })();

  let MESSAGES = {};
  try {
      MESSAGES = JSON.parse(document.getElementById('i18n-data').textContent);
  } catch(e) { console.error("I18N Data Parse Error", e); }

  const { createApp, ref, computed, onMounted, onUnmounted, watch } = Vue;
  createApp({
    setup() {
      const db = ref({ title:'', title_en:'', items: {}, categories: [], githubUrl: '', adminIcon: '', adminTitle:'', adminTitle_en:'', customCSS: '', customJS: '', defaultCityZh: '', defaultCityEn: '' });
      const loading = ref(true);
      const activeCatIdx = ref(0);
      const activeSubIdx = ref(-1);
      const searchQuery = ref("");
      const searchInputRef = ref(null);
      const isDark = ref(localStorage.theme === 'dark');
      const mobileMenuOpen = ref(false);
      const token = localStorage.getItem('nav_token');
      const lang = ref(localStorage.getItem('nav_lang') || 'zh');
      
      const currentTime = ref('');
      const locationText = ref('定位中...');
      const weatherText = ref('获取中...');
      const weatherIcon = ref('fas fa-cloud-sun');
      const greetingText = ref('');
      const currentPeriod = ref('');
      const displayedGreeting = ref('');
      const isTypingActive = ref(true);
      
      const calendarMode = ref(0); // 0: 公历, 1: 农历

      const t = (key) => { 
          if(!MESSAGES[lang.value]) return key;
          if (key === 'no_content') return MESSAGES[lang.value]['no_content'] || '暂无内容'; 
          return MESSAGES[lang.value][key] || key; 
      };
      
      const currentDisplayTitle = computed(() => {
          if (lang.value === 'en') return db.value.title_en || db.value.title || 'Navigation';
          return db.value.title || '导航';
      });

      const currentDisplayAdminTitle = computed(() => {
          if (lang.value === 'en') return db.value.adminTitle_en || db.value.adminTitle || 'Admin';
          return db.value.adminTitle || '管理后台';
      });

      let typingTimer = null;
      const startTypewriter = (text) => {
          if (typingTimer) clearInterval(typingTimer);
          displayedGreeting.value = "";
          isTypingActive.value = true;
          let index = 0;
          typingTimer = setInterval(() => {
              if (index < text.length) {
                  displayedGreeting.value += text.charAt(index);
                  index++;
              } else {
                  clearInterval(typingTimer);
                  setTimeout(() => { isTypingActive.value = false; }, 1500);
              }
          }, 80);
      };

      const triggerGreetingAnimation = () => {
          if (greetingText.value) {
              if (isSplashDone) {
                  startTypewriter(greetingText.value);
              } else {
                  window.addEventListener('splashDone', () => {
                      startTypewriter(greetingText.value);
                  }, { once: true });
              }
          }
      };

      watch(greetingText, (newVal) => {
          if (newVal) triggerGreetingAnimation();
      });

      const getRandomGreeting = (key) => {
          const list = t(key);
          if (Array.isArray(list) && list.length > 0) {
              return list[Math.floor(Math.random() * list.length)];
          }
          return typeof list === 'string' ? list : '';
      };

      const updateClockAndGreeting = () => {
          const now = new Date();
          const hour = now.getHours();
          
          let periodKey = '';
          if (hour >= 4 && hour < 8) periodKey = 'greet_dawn';
          else if (hour >= 8 && hour < 12) periodKey = 'greet_morning';
          else if (hour >= 12 && hour < 14) periodKey = 'greet_noon';
          else if (hour >= 14 && hour < 18) periodKey = 'greet_afternoon';
          else if (hour >= 18 && hour < 22) periodKey = 'greet_evening';
          else periodKey = 'greet_night';

          if (!greetingText.value || currentPeriod.value !== periodKey) {
              currentPeriod.value = periodKey;
              greetingText.value = getRandomGreeting(periodKey);
          }

          const timeStr = now.toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit', hour12: false});

          if (lang.value === 'en') {
              const options = { month: 'short', day: 'numeric', year: 'numeric' };
              currentTime.value = now.toLocaleDateString('en-US', options) + ' ' + timeStr;
          } else {
              if (calendarMode.value === 0) {
                  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
                  const weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
                  currentTime.value = months[now.getMonth()] + now.getDate() + '日 ' + weeks[now.getDay()] + ' ' + timeStr;
              } else {
                  const lunar = LunarCalendar(now);
                  currentTime.value = '农历 ' + lunar.yearStr + lunar.monthStr + lunar.dayStr + ' ' + timeStr;
              }
          }
      };

      const toggleCalendarMode = () => {
          if (lang.value === 'zh') {
              calendarMode.value = calendarMode.value === 0 ? 1 : 0;
              updateClockAndGreeting();
          }
      };

      const fetchLocationAndWeather = async () => {
          try {
              let latitude, longitude, cityName = "";

              if (lang.value === 'en' && db.value.defaultCityEn) {
                  cityName = db.value.defaultCityEn;
              } else if (db.value.defaultCityZh) {
                  cityName = db.value.defaultCityZh;
              }

              if (cityName) {
                  locationText.value = cityName;
                  const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(cityName) + '&count=1&language=' + (lang.value === 'en' ? 'en' : 'zh');
                  const geoRes = await fetch(geoUrl);
                  if (geoRes.ok) {
                      const geoData = await geoRes.json();
                      if (geoData.results && geoData.results.length > 0) {
                          latitude = geoData.results[0].latitude;
                          longitude = geoData.results[0].longitude;
                          locationText.value = geoData.results[0].name || cityName;
                      }
                  }
              }

              if (!latitude || !longitude) {
                  const ipRes = await fetch('https://ipapi.co/json/');
                  if (ipRes.ok) {
                      const ipData = await ipRes.json();
                      latitude = ipData.latitude;
                      longitude = ipData.longitude;
                      if (!cityName) {
                          locationText.value = (lang.value === 'en' ? ipData.city : (ipData.city || '本地')) || '本地';
                      }
                  }
              }

              if (latitude && longitude) {
                  const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current=temperature_2m,weather_code&timezone=auto';
                  const weatherRes = await fetch(weatherUrl);
                  if (weatherRes.ok) {
                      const weatherData = await weatherRes.json();
                      const current = weatherData.current;
                      const temp = Math.round(current.temperature_2m);
                      const code = current.weather_code;

                      let desc = "晴";
                      let icon = "fas fa-sun text-amber-500";

                      if (code === 0) {
                          desc = lang.value === 'en' ? 'Clear' : '晴';
                          icon = 'fas fa-sun text-amber-500';
                      } else if ([1, 2, 3].includes(code)) {
                          desc = lang.value === 'en' ? 'Partly Cloudy' : '多云';
                          icon = 'fas fa-cloud-sun text-blue-400';
                      } else if ([45, 48].includes(code)) {
                          desc = lang.value === 'en' ? 'Foggy' : '有雾';
                          icon = 'fas fa-smog text-slate-400';
                      } else if ([51, 53, 55, 56, 57].includes(code)) {
                          desc = lang.value === 'en' ? 'Drizzle' : '细雨';
                          icon = 'fas fa-cloud-rain text-blue-300';
                      } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
                          desc = lang.value === 'en' ? 'Rain' : '阵雨/雨';
                          icon = 'fas fa-cloud-showers-heavy text-blue-500';
                      } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
                          desc = lang.value === 'en' ? 'Snow' : '雪';
                          icon = 'fas fa-snowflake text-blue-200';
                      } else if ([95, 96, 99].includes(code)) {
                          desc = lang.value === 'en' ? 'Thunderstorm' : '雷暴';
                          icon = 'fas fa-bolt text-yellow-500';
                      }

                      weatherText.value = temp + '°C ' + desc;
                      weatherIcon.value = icon;
                      return;
                  }
              }
              throw new Error("Open-Meteo Fetch Failed");
          } catch (e) {
              if (locationText.value === '定位中...') {
                  locationText.value = lang.value === 'en' ? 'Local' : '本地';
              }
              weatherText.value = lang.value === 'en' ? '22°C Clear' : '22°C 晴';
              weatherIcon.value = 'fas fa-sun text-amber-500';
          }
      };

      const toggleLang = () => { 
          lang.value = lang.value === 'zh' ? 'en' : 'zh'; 
          localStorage.setItem('nav_lang', lang.value);
          updateMeta();
          updateClockAndGreeting();
          fetchLocationAndWeather(); 
      };

      const handleKeyDown = (e) => {
          if ((e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') || 
              ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
              e.preventDefault();
              if (searchInputRef.value) {
                  searchInputRef.value.focus();
              }
          }
      };

      let timer = null;
      let calendarTimer = null;

      onMounted(async () => {
        window.addEventListener('keydown', handleKeyDown);
        if(isDark.value) document.documentElement.classList.add('dark');
        
        updateClockAndGreeting();
        timer = setInterval(updateClockAndGreeting, 1000);

        calendarTimer = setInterval(() => {
            if (lang.value === 'zh') {
                calendarMode.value = calendarMode.value === 0 ? 1 : 0;
                updateClockAndGreeting();
            }
        }, 6000);

        try {
            const headers = token ? { 'Authorization': 'Bearer ' + token } : {};
            const url = token ? '/api/data?admin=1' : '/api/data';
            const res = await fetch(url, { headers });
            if(res.ok) {
                db.value = await res.json();
                if(!db.value.categories || db.value.categories.length === 0) {
                    db.value.categories = [{name:'默认', itemIds:[], subCategories:[]}];
                }
                updateMeta();
                injectCustomCode();
            } else {
                console.error("API Error", res.status);
            }
        } catch(e) { 
            console.error("Fetch Error", e); 
        } finally {
            loading.value = false;
            fetchLocationAndWeather();
        }
      });

      onUnmounted(() => {
          window.removeEventListener('keydown', handleKeyDown);
          if (timer) clearInterval(timer);
          if (calendarTimer) clearInterval(calendarTimer);
          if (typingTimer) clearInterval(typingTimer);
      });

      const updateMeta = () => { 
          const title = currentDisplayTitle.value;
          if(title) { 
              document.title = title; 
              const stTitle = document.getElementById('splash-title'); 
              if(stTitle) stTitle.innerText = title; 
          } 
          if(db.value.favicon) { 
              let link = document.querySelector("link[rel~='icon']"); 
              if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); } 
              link.href = db.value.favicon; 
          } 
      };

      const injectCustomCode = () => { if (db.value.customCSS) { const style = document.createElement('style'); style.innerHTML = db.value.customCSS; document.head.appendChild(style); } if (db.value.customJS) { const script = document.createElement('script'); script.innerHTML = db.value.customJS; document.body.appendChild(script); } };
      const isImageUrl = (str) => str && (str.startsWith('http') || str.startsWith('/')) && !str.includes(' ');
      const resolveItems = (ids) => { if(!ids || !db.value.items) return []; return ids.map(id => { const item = db.value.items[id]; return item ? { ...item, id } : null; }).filter(Boolean); };
      const isSearching = computed(() => searchQuery.value.trim().length > 0);
      const displayedItems = computed(() => { 
          if (isSearching.value) { const q = searchQuery.value.toLowerCase(); if (!db.value.items) return []; return Object.values(db.value.items).filter(item => item.title.toLowerCase().includes(q) || item.url.toLowerCase().includes(q) || (item.desc && item.desc.toLowerCase().includes(q))); }
          const cat = db.value.categories[activeCatIdx.value]; if (!cat) return [];
          if (activeSubIdx.value !== -1) return resolveItems(cat.subCategories[activeSubIdx.value]?.itemIds || []);
          return resolveItems(cat.itemIds || []); 
      });
      const currentCatName = computed(() => db.value.categories[activeCatIdx.value]?.name || '');
      const currentSubName = computed(() => activeSubIdx.value !== -1 ? db.value.categories[activeCatIdx.value]?.subCategories[activeSubIdx.value]?.name : '');
      const selectCategory = (i) => { activeCatIdx.value=i; activeSubIdx.value=-1; searchQuery.value=""; window.scrollTo({top:0, behavior:'smooth'}); };
      const selectSubCategory = (c, s) => { activeCatIdx.value=c; activeSubIdx.value=s; searchQuery.value=""; window.scrollTo({top:0, behavior:'smooth'}); };
      
      const resetToHome = () => { activeCatIdx.value = 0; activeSubIdx.value = -1; searchQuery.value = ""; window.scrollTo({top:0, behavior:'smooth'}); };

      const toggleTheme = () => { isDark.value=!isDark.value; localStorage.theme=isDark.value?'dark':'light'; document.documentElement.classList.toggle('dark', isDark.value); };
      const getFav = (u) => { try { return 'https://favicon.im/' + new URL(u).hostname; } catch { return ''; } };
      const defIcon = (e) => e.target.src = 'https://ui-avatars.com/api/?background=random&color=fff&name=Nav';
      
      return { 
          db, loading, activeCatIdx, activeSubIdx, isDark, mobileMenuOpen, searchQuery, searchInputRef, isSearching, 
          displayedItems, currentCatName, currentSubName, selectCategory, selectSubCategory, resetToHome, toggleTheme, 
          getFav, defIcon, isImageUrl, t, toggleLang, lang, currentDisplayTitle, currentDisplayAdminTitle,
          currentTime, locationText, weatherText, weatherIcon, greetingText, displayedGreeting, isTypingActive, toggleCalendarMode 
      };
    }
  }).mount('#app');
</script>
</body>
</html>`;
}

// ==========================================
// 2. 管理后台 (Admin)
// ==========================================
function getAdminPage() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Loading...</title>
<link rel="icon" href="">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://unpkg.com/vue@3/dist/vue.global.prod.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
body{font-family:'Inter',sans-serif}.hide-scrollbar::-webkit-scrollbar{display:none}
.modal-enter-active,.modal-leave-active{transition:all 0.2s ease}.modal-enter-from,.modal-leave-to{opacity:0;transform:scale(0.95)}
.toast-enter-active,.toast-leave-active{transition:all 0.3s ease}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(-20px)}
.glass{background:rgba(255,255,255,0.7);backdrop-filter:blur(20px) saturate(180%);border-bottom:1px solid rgba(255,255,255,0.3)}
.dark .glass{background:rgba(15,23,42,0.7);border-bottom:1px solid rgba(255,255,255,0.05)}
.sidebar-glass{background:rgba(255,255,255,0.6);backdrop-filter:blur(20px) saturate(180%);border-right:1px solid rgba(255,255,255,0.3)}
.dark .sidebar-glass{background:rgba(15,23,42,0.6);border-right:1px solid rgba(255,255,255,0.05)}
</style>
<script>tailwind.config={darkMode:'class',theme:{extend:{colors:{primary:'#3b82f6'}}}}</script>
</head>
<body class="text-slate-700 h-screen flex flex-col overflow-hidden bg-fixed bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 dark:from-slate-950 dark:via-[#0f172a] dark:text-slate-200 dark:to-[#1e1b4b]">
<div id="app" class="h-full flex flex-col" :class="{'dark':isDark}">
  <transition name="toast">
    <div v-if="toast.show" :class="toast.type==='error'?'bg-red-500':'bg-green-600'" class="fixed top-5 right-5 z-[100] text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 font-medium">
      <i :class="toast.type==='error'?'fas fa-exclamation-circle':'fas fa-check-circle'"></i>{{toast.msg}}
    </div>
  </transition>
  
  <div v-if="!token" class="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50 dark:bg-slate-900/80">
    <div class="bg-white/80 p-10 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-white dark:bg-slate-800 dark:border-slate-700">
      <h2 class="text-2xl font-bold mb-6 text-slate-800 dark:text-white">{{ t('login_title') }}</h2>
      <input v-model="password" type="password" class="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('pwd_placeholder')" @keyup.enter="login">
      <button @click="login" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold shadow-md transition-transform active:scale-95">{{ t('login_btn') }}</button>
    </div>
  </div>

  <div v-else class="flex-1 flex overflow-hidden backdrop-blur-xl bg-white/30 dark:bg-slate-900/30">
    <aside class="w-72 sidebar-glass flex flex-col z-20">
      <div class="h-16 flex items-center justify-between px-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div class="font-bold text-lg text-slate-800 flex items-center gap-2 dark:text-white">
             <img v-if="isImageUrl(db.adminLogo)" :src="db.adminLogo" class="w-5 h-5 object-contain" loading="lazy">
             <i v-else :class="db.adminLogo||'fas fa-cog'" class="text-blue-600"></i>
             {{ currentDisplayAdminTitle }}
        </div>
        <div class="flex gap-2">
            <button @click="toggleLang" class="text-slate-400 hover:text-blue-500 font-bold text-xs uppercase" title="Language">{{ lang }}</button>
            <button @click="toggleTheme" class="text-slate-400 hover:text-amber-500 transition-colors" :title="t('toggle_theme')"><i :class="isDark?'fas fa-moon':'fas fa-sun'"></i></button>
        </div>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-1">
        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">{{ t('cat_level1') }}</div>
        <button @click="switchToAll" class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all border border-transparent mb-2" :class="showAllMode?'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400':'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-800'"><div class="flex items-center gap-3"><i class="fas fa-cubes w-5 text-center opacity-70"></i><span>{{ t('all_links') }}</span></div></button>
        <div v-for="(cat,idx) in db.categories" :key="cat.id" @click="selCat(idx)" class="group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all border border-transparent" :class="(curCatIdx===idx && !showAllMode)?'bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-400':'text-slate-600 hover:bg-white/50 dark:text-slate-400 dark:hover:bg-slate-800'">
          <div class="flex items-center gap-3 truncate"><img v-if="isImageUrl(cat.icon)" :src="cat.icon" class="w-5 h-5 object-contain" loading="lazy"><i v-else :class="cat.icon||'fas fa-folder'" class="w-5 text-center opacity-70"></i><span>{{cat.name}}</span></div>
          <div class="hidden group-hover:flex items-center bg-white shadow-sm rounded border border-slate-200 px-1 dark:bg-slate-900 dark:border-slate-700">
            <button @click.stop="moveCat(idx,-1)" class="p-1 text-slate-400 hover:text-blue-600" :title="t('move_up')"><i class="fas fa-chevron-up text-xs"></i></button>
            <button @click.stop="moveCat(idx,1)" class="p-1 text-slate-400 hover:text-blue-600" :title="t('move_down')"><i class="fas fa-chevron-down text-xs"></i></button>
            <button @click.stop="editCat(idx)" class="p-1 text-slate-400 hover:text-green-600" :title="t('edit_cat')"><i class="fas fa-pen text-xs"></i></button>
            <button @click.stop="delCat(idx)" class="p-1 text-slate-400 hover:text-red-500" :title="t('del_cat')"><i class="fas fa-trash text-xs"></i></button>
          </div>
        </div>
        <button @click="addCategory" class="w-full mt-4 flex items-center justify-center gap-2 py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-xs font-bold uppercase tracking-wide dark:border-slate-600 dark:hover:bg-slate-800" :title="t('new_cat')"><i class="fas fa-plus"></i> {{ t('new_cat') }}</button>
      </div>
      
      <div class="p-4 border-t border-slate-200/50 bg-white/30 backdrop-blur-sm space-y-3 dark:border-slate-700/50 dark:bg-slate-900/30">
         <div class="grid grid-cols-2 gap-2">
           <button @click="exportData" class="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 dark:hover:text-blue-400"><i class="fas fa-download"></i> {{ t('export') }}</button>
           <label class="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm transition-all cursor-pointer dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 dark:hover:text-blue-400"><i class="fas fa-upload"></i> {{ t('import') }}<input type="file" class="hidden" accept=".json" @change="importData"></label>
         </div>
         <div class="grid grid-cols-2 gap-2">
           <button @click="openSiteSet" class="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-sm transition-all group dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:border-blue-500 dark:hover:text-blue-400"><i class="fas fa-cog transition-transform group-hover:rotate-90"></i> {{ t('settings') }}</button>
           <a href="/" target="_blank" class="flex items-center justify-center gap-2 px-2 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-green-300 hover:text-green-600 shadow-sm transition-all group dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-green-900/20 dark:hover:border-green-500 dark:hover:text-green-400"><i class="fas fa-external-link-alt transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"></i> {{ t('preview') }}</a>
         </div>
         <button @click="save" :disabled="saving" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"><i :class="saving?'fas fa-circle-notch fa-spin':'fas fa-cloud-upload-alt'"></i> {{saving? t('saving') : t('save_publish')}}</button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col bg-slate-50/50 min-w-0 relative dark:bg-slate-900/30">
      <div class="glass px-6 py-3 shrink-0 flex justify-between items-center z-10">
        <div class="flex items-center gap-4 overflow-x-auto hide-scrollbar flex-1">
          <template v-if="!showAllMode">
            <button @click="selSub(-1)" class="px-4 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-2 whitespace-nowrap border" :class="curSubIdx===-1?'bg-blue-600 text-white border-blue-600 shadow-md':'bg-white text-slate-600 border-slate-200 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'">{{ t('links') }} <span class="bg-white/20 text-xs px-1.5 rounded-full" :class="curSubIdx===-1?'text-white':'text-slate-400'">{{(curCat.itemIds||[]).length}}</span></button>
            <button v-for="(sub,sIdx) in curCat.subCategories" :key="sub.id" @click="selSub(sIdx)" class="px-4 py-1.5 text-sm font-medium rounded-full transition-all flex items-center gap-2 whitespace-nowrap group relative border" :class="curSubIdx===sIdx?'bg-blue-600 text-white border-blue-600 shadow-md':'bg-white text-slate-600 border-slate-200 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'">
              {{sub.name}} <span class="text-xs px-1.5 rounded-full" :class="curSubIdx===sIdx?'bg-white/20 text-white':'bg-slate-100 text-slate-400 dark:bg-slate-700'">{{sub.itemIds.length}}</span>
              <div v-if="curSubIdx===sIdx" class="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><i @click.stop="editSub(sIdx)" class="fas fa-pen text-xs hover:text-green-300 p-1" :title="t('edit_sub')"></i><i @click.stop="delSub(sIdx)" class="fas fa-times text-xs hover:text-red-300 p-1" :title="t('del_sub')"></i></div>
            </button>
            <button @click="addSub" class="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-dashed border-slate-300 text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all dark:bg-slate-800 dark:border-slate-600" :title="t('new_sub')"><i class="fas fa-plus"></i></button>
          </template>
          <div v-else class="font-bold text-slate-700 text-lg flex items-center gap-2 dark:text-white"><div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><i class="fas fa-archive"></i></div>{{ t('all_links') }}</div>
        </div>
        <div class="relative w-64 shrink-0 ml-4"><i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i><input v-model="adminSearchQuery" :placeholder="t('search_placeholder')" class="w-full bg-white/80 border border-slate-200 rounded-full pl-9 pr-4 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-800/80 dark:border-slate-700"></div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 md:p-8">
        <div class="max-w-6xl mx-auto">
          <div class="flex justify-end items-center mb-4" v-if="!showAllMode"><button @click="addItem" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2" :title="t('add_link')"><i class="fas fa-plus"></i> {{ t('add_link') }}</button></div>
          <div class="space-y-3">
            <div v-for="(itemId,iIdx) in filteredAdminItems" :key="itemId" 
                 :draggable="!showAllMode && !adminSearchQuery"
                 @dragstart="handleDragStart($event, iIdx)"
                 @dragend="handleDragEnd($event)"
                 @dragover="handleDragOver($event)"
                 @drop="handleDrop($event, iIdx)"
                 class="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group relative dark:bg-slate-800/80 dark:border-slate-700 cursor-grab active:cursor-grabbing">
              
              <div v-if="!showAllMode && !adminSearchQuery" class="text-slate-300 hover:text-slate-500 cursor-grab px-1">
                <i class="fas fa-grip-vertical"></i>
              </div>

              <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-sm dark:bg-slate-700 dark:border-slate-600"><img v-if="db.items[itemId]" :src="db.items[itemId].icon||getFav(db.items[itemId].url)" class="w-6 h-6 object-contain" loading="lazy"><i v-else class="fas fa-question text-slate-300"></i></div>
              <div class="flex-1 min-w-0" v-if="db.items[itemId]"><div class="flex items-center gap-2"><span class="font-bold text-slate-700 truncate dark:text-slate-200">{{db.items[itemId].title}}</span><span v-if="db.items[itemId].isPrivate" class="text-[10px] bg-amber-100 text-amber-600 px-1.5 rounded border border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800"><i class="fas fa-lock"></i> {{ t('private') }}</span></div><div class="text-xs text-blue-500 truncate mt-0.5 hover:underline">{{db.items[itemId].url}}</div></div>
              <div v-else class="flex-1 text-red-500 text-sm"><i class="fas fa-unlink"></i> 引用已失效</div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="flex bg-slate-50 rounded-lg border border-slate-200 mr-2 dark:bg-slate-700 dark:border-slate-600" v-if="!showAllMode && !adminSearchQuery"><button @click="moveItem(iIdx,-1)" class="px-2 py-1.5 text-slate-400 hover:text-blue-600 border-r border-slate-200 dark:border-slate-600" :title="t('move_up')"><i class="fas fa-arrow-up text-xs"></i></button><button @click="moveItem(iIdx,1)" class="px-2 py-1.5 text-slate-400 hover:text-blue-600" :title="t('move_down')"><i class="fas fa-arrow-down text-xs"></i></button></div>
                <button @click="editItem(itemId)" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors dark:bg-blue-900/30 dark:text-blue-400" :title="t('edit_content')"><i class="fas fa-pen text-xs"></i></button>
                <button @click="deleteItem(itemId,iIdx)" class="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors dark:bg-red-900/30 dark:text-red-400" :title="showAllMode?t('delete_physical'):t('unlink')"><i :class="showAllMode?'fas fa-trash':'fas fa-link-slash'" class="text-xs"></i></button>
              </div>
            </div>
            <div v-if="filteredAdminItems.length===0" class="text-center py-10 text-slate-400">{{ t('no_content') }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>

  <transition name="modal">
    <div v-if="modal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" @click.self>
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden border border-slate-100 dark:bg-slate-800 dark:border-slate-700">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 dark:bg-slate-700/50 dark:border-slate-700"><h3 class="font-bold text-lg text-slate-800 dark:text-white">{{modal.title}}</h3><button @click="modal.show=false" class="text-slate-400 hover:text-slate-600 dark:hover:text-white"><i class="fas fa-times"></i></button></div>
        <div class="p-6 overflow-y-auto space-y-5">
          <div v-if="['cat','sub'].includes(modal.type)" class="space-y-4"><div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_name') }}</label><input v-model="modal.data.name" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div><div v-if="modal.data.icon!==undefined"><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_icon') }}</label><div class="flex gap-2 mb-2"><input v-model="modal.data.icon" class="flex-1 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_icon_ph')"><div class="w-11 h-11 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 text-lg dark:bg-slate-700 dark:border-slate-600"><img v-if="isImageUrl(modal.data.icon)" :src="modal.data.icon" class="w-full h-full object-contain" loading="lazy"><i v-else :class="modal.data.icon||'fas fa-question'"></i></div></div><div class="flex flex-wrap gap-2"><button v-for="icon in presets" :key="icon" @click="modal.data.icon=icon" class="w-8 h-8 rounded hover:bg-blue-100 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors dark:hover:bg-slate-600" :class="modal.data.icon===icon?'bg-blue-100 text-blue-600 ring-1 ring-blue-400':''"><i :class="icon"></i></button></div></div></div>
          
          <div v-if="modal.type==='site'" class="flex flex-col h-[50vh]">
            <div class="flex bg-slate-100 p-1 rounded-lg mb-4 shrink-0 dark:bg-slate-700"><button @click="siteTab='public'" class="flex-1 py-1.5 rounded-md text-sm font-bold" :class="siteTab==='public'?'bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-400':'text-slate-500 hover:text-slate-700 dark:text-slate-400'">{{ t('tab_public') }}</button><button @click="siteTab='admin'" class="flex-1 py-1.5 rounded-md text-sm font-bold" :class="siteTab==='admin'?'bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-400':'text-slate-500 hover:text-slate-700 dark:text-slate-400'">{{ t('tab_admin') }}</button><button @click="siteTab='advanced'" class="flex-1 py-1.5 rounded-md text-sm font-bold" :class="siteTab==='advanced'?'bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-400':'text-slate-500 hover:text-slate-700 dark:text-slate-400'">{{ t('tab_advanced') }}</button></div>
            <div class="overflow-y-auto flex-1 space-y-4 p-1">
              <div v-if="siteTab==='public'" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div><label class="block text-xs font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_site_title_zh') }}</label><input v-model="modal.data.title" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div>
                  <div><label class="block text-xs font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_site_title_en') }}</label><input v-model="modal.data.title_en" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div>
                </div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_logo') }}</label><input v-model="modal.data.logo" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_favicon') }}</label><input v-model="modal.data.favicon" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_github') }}</label><input v-model="modal.data.githubUrl" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_github_ph')"></div>
              </div>
              <div v-if="siteTab==='admin'" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div><label class="block text-xs font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_admin_title_zh') }}</label><input v-model="modal.data.adminTitle" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_admin_title_ph')"></div>
                  <div><label class="block text-xs font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_admin_title_en') }}</label><input v-model="modal.data.adminTitle_en" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_admin_title_ph')"></div>
                </div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_admin_icon') }}</label><input v-model="modal.data.adminIcon" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_admin_icon_ph')"></div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_admin_logo') }}</label><input v-model="modal.data.adminLogo" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_admin_logo_ph')"></div>
              </div>
              <div v-if="siteTab==='advanced'" class="space-y-4">
                <div class="grid grid-cols-2 gap-3">
                  <div><label class="block text-xs font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_city_zh') }}</label><input v-model="modal.data.defaultCityZh" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_city_ph')"></div>
                  <div><label class="block text-xs font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_city_en') }}</label><input v-model="modal.data.defaultCityEn" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700" :placeholder="t('modal_city_ph')"></div>
                </div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_css') }}</label><textarea v-model="modal.data.customCSS" class="w-full border border-slate-200 rounded-lg p-2.5 h-24 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs dark:bg-slate-900 dark:border-slate-700" placeholder="<style>...</style> (无需标签)"></textarea></div>
                <div><label class="block text-sm font-bold text-slate-700 mb-1 dark:text-slate-300">{{ t('modal_js') }}</label><textarea v-model="modal.data.customJS" class="w-full border border-slate-200 rounded-lg p-2.5 h-24 outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs dark:bg-slate-900 dark:border-slate-700" placeholder="<script>...</script> (无需标签)"></textarea></div>
              </div>
            </div>
          </div>
          
          <div v-if="modal.type==='item_add'" class="flex flex-col h-[60vh]">
            <div class="flex bg-slate-100 p-1 rounded-lg mb-4 shrink-0 dark:bg-slate-700"><button @click="tab='new'" class="flex-1 py-1.5 rounded-md text-sm font-bold" :class="tab==='new'?'bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-400':'text-slate-500 hover:text-slate-700 dark:text-slate-400'">{{ t('modal_new') }}</button><button @click="tab='exist'" class="flex-1 py-1.5 rounded-md text-sm font-bold" :class="tab==='exist'?'bg-white text-blue-600 shadow-sm dark:bg-slate-600 dark:text-blue-400':'text-slate-500 hover:text-slate-700 dark:text-slate-400'">{{ t('modal_select') }}</button></div>
            <div v-if="tab==='new'" class="space-y-4"><input v-model="modal.data.title" :placeholder="t('modal_title')" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"><input v-model="modal.data.url" placeholder="URL" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"><textarea v-model="modal.data.desc" :placeholder="t('modal_desc')" class="w-full border border-slate-200 rounded-lg p-2.5 h-24 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></textarea><div class="flex gap-4"><div class="flex-1"><label class="block text-xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">{{ t('modal_custom_icon') }}</label><input v-model="modal.data.icon" :placeholder="t('modal_custom_icon_ph')" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div><div class="flex items-end pb-2"><label class="flex items-center cursor-pointer gap-2"><input type="checkbox" v-model="modal.data.isPrivate" class="w-5 h-5 text-blue-600 rounded"><span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ t('modal_is_private') }}</span></label></div></div></div>
            <div v-if="tab==='exist'" class="flex-1 flex flex-col overflow-hidden"><input v-model="searchLib" :placeholder="t('search_placeholder')" class="w-full border border-slate-200 rounded-lg p-2.5 mb-2 outline-none focus:ring-2 focus:ring-blue-500 shrink-0 dark:bg-slate-900 dark:border-slate-700"><div class="flex-1 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-2 dark:border-slate-700"><div v-for="item in filteredLib" :key="item.id" @click="toggleLibSelect(item.id)" class="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-slate-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-700" :class="modal.data.selectedIds.includes(item.id)?'border-blue-500 bg-blue-50 dark:bg-blue-900/30':'border-slate-200 dark:border-slate-700'"><div class="flex-1 min-w-0"><div class="font-bold text-sm truncate">{{item.title}}</div><div class="text-xs text-slate-400 truncate">{{item.url}}</div></div><i v-if="modal.data.selectedIds.includes(item.id)" class="fas fa-check-circle text-blue-600 text-lg"></i><i v-else class="far fa-circle text-slate-300 text-lg"></i></div></div></div><div v-if="tab==='exist'" class="mt-2 text-xs text-slate-500 text-right">{{ t('modal_selected').replace('{n}', modal.data.selectedIds.length) }}</div>
          </div>
          <div v-if="modal.type==='item_edit'" class="space-y-4"><div class="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg dark:bg-blue-900/30 dark:text-blue-400">{{ t('modal_edit_tip') }}</div><input v-model="modal.data.title" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"><input v-model="modal.data.url" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"><textarea v-model="modal.data.desc" class="w-full border border-slate-200 rounded-lg p-2.5 h-24 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></textarea><div class="flex gap-4"><div class="flex-1"><label class="block text-xs font-bold text-slate-500 uppercase mb-1 dark:text-slate-400">{{ t('modal_custom_icon') }}</label><input v-model="modal.data.icon" :placeholder="t('modal_custom_icon_ph')" class="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700"></div><div class="flex items-end pb-2"><label class="flex items-center cursor-pointer gap-2"><input type="checkbox" v-model="modal.data.isPrivate" class="w-5 h-5 text-blue-600 rounded"><span class="text-sm font-bold text-slate-700 dark:text-slate-300">{{ t('modal_is_private') }}</span></label></div></div></div>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 dark:bg-slate-700/50 dark:border-slate-700"><button @click="modal.show=false" class="px-5 py-2.5 rounded-lg text-slate-500 hover:bg-slate-200 font-medium dark:hover:bg-slate-600 dark:text-slate-300">{{ t('btn_cancel') }}</button><button @click="saveModal" class="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg">{{ t('btn_confirm') }}</button></div>
      </div>
    </div>
  </transition>
</div>
<script id="i18n-data" type="application/json">__I18N_DATA__</script>
<script>
  window.onerror = function(msg, url, line) { alert('Error: ' + msg); return false; };
  let MESSAGES = {};
  try {
      MESSAGES = JSON.parse(document.getElementById('i18n-data').textContent);
  } catch(e) { console.error("I18N Data Parse Error", e); }

  const { createApp, ref, computed, onMounted } = Vue;
  createApp({
    setup() {
      const token = ref(localStorage.getItem('nav_token')||'');
      const password = ref('');
      const db = ref({title:'', title_en:'', adminTitle:'', adminTitle_en:'', logo:'', adminLogo:'', adminIcon:'', favicon:'', githubUrl:'', customCSS:'', customJS:'', defaultCityZh:'', defaultCityEn:'', items:{}, categories:[]});
      const curCatIdx = ref(0);
      const curSubIdx = ref(-1);
      const modal = ref({show:false, type:'', title:'', data:{}, callback:null});
      const tab = ref('new');
      const siteTab = ref('public');
      const searchLib = ref('');
      const filteredLib = computed(() => { if(!db.value.items) return []; const q = searchLib.value.toLowerCase(); return Object.entries(db.value.items).map(([id, val]) => ({id, ...val})).filter(i => i.title.toLowerCase().includes(q) || i.url.includes(q)); });
      const toast = ref({show:false, msg:'', type:'success'});
      const saving = ref(false);
      const isDark = ref(localStorage.theme === 'dark');
      
      const lang = ref(localStorage.getItem('nav_lang') || 'zh');
      const t = (key) => { if (key === 'no_content') return MESSAGES[lang.value]['no_content'] || '暂无内容'; return MESSAGES[lang.value][key] || key; };
      const toggleLang = () => { lang.value = lang.value === 'zh' ? 'en' : 'zh'; localStorage.setItem('nav_lang', lang.value); updateMeta(); };
      
      const currentDisplayAdminTitle = computed(() => {
          if (lang.value === 'en') return db.value.adminTitle_en || db.value.adminTitle || 'Admin';
          return db.value.adminTitle || '管理后台';
      });

      const presets = ['fas fa-home', 'fas fa-star', 'fas fa-fire', 'fas fa-bolt', 'fas fa-heart', 'fas fa-code', 'fas fa-terminal', 'fas fa-laptop-code', 'fas fa-database', 'fas fa-server', 'fas fa-image', 'fas fa-video', 'fas fa-music', 'fas fa-gamepad', 'fas fa-film', 'fas fa-book', 'fas fa-graduation-cap', 'fas fa-pen-nib', 'fas fa-newspaper', 'fas fa-rss', 'fas fa-shopping-cart', 'fas fa-money-bill', 'fas fa-tag', 'fas fa-gift', 'fas fa-credit-card', 'fas fa-cloud', 'fas fa-wifi', 'fas fa-lock', 'fas fa-key', 'fas fa-shield-alt', 'fas fa-user', 'fas fa-users', 'fas fa-comment', 'fas fa-envelope', 'fas fa-phone'];

      const curCat = computed(() => db.value.categories[curCatIdx.value]);
      const showAllMode = ref(false);
      const adminSearchQuery = ref("");
      
      const filteredAdminItems = computed(() => {
          let ids = [];
          if (showAllMode.value) { ids = Object.keys(db.value.items || {}); } 
          else {
              if (!curCat.value) return [];
              if (curSubIdx.value === -1) ids = curCat.value.itemIds || [];
              else ids = curCat.value.subCategories[curSubIdx.value]?.itemIds || [];
          }
          if (!adminSearchQuery.value) return ids;
          const q = adminSearchQuery.value.toLowerCase();
          return ids.filter(id => { const item = db.value.items[id]; return item && (item.title.toLowerCase().includes(q) || item.url.includes(q)); });
      });
      
      const curItemList = filteredAdminItems;

      // 📌 拖拽排序逻辑
      const dragSourceIndex = ref(null);
      const handleDragStart = (e, index) => {
          dragSourceIndex.value = index;
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', index);
          e.target.classList.add('opacity-40');
      };
      const handleDragEnd = (e) => {
          e.target.classList.remove('opacity-40');
          dragSourceIndex.value = null;
      };
      const handleDragOver = (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
      };
      const handleDrop = (e, targetIndex) => {
          e.preventDefault();
          const sourceIndex = dragSourceIndex.value;
          if (sourceIndex !== null && sourceIndex !== targetIndex) {
              const arr = curSubIdx.value === -1 
                  ? curCat.value.itemIds 
                  : curCat.value.subCategories[curSubIdx.value].itemIds;
              const [movedItem] = arr.splice(sourceIndex, 1);
              arr.splice(targetIndex, 0, movedItem);
          }
      };

      const showToast = (msg, type='success') => { toast.value = {show:true, msg, type}; setTimeout(() => toast.value.show=false, 3000); };
      
      const load = async () => { 
          try {
              const res = await fetch('/api/data?admin=1', { headers: {'Authorization': 'Bearer ' + token.value} }); 
              if(res.ok) {
                  db.value = await res.json(); 
                  if(!db.value.items) db.value.items = {}; 
                  if(!db.value.categories) db.value.categories = [];
                  db.value.categories.forEach(c => { if(!c.itemIds) c.itemIds=[]; }); 
                  updateMeta(); 
                  injectCustomCode();
              } else {
                  if(res.status === 401) { token.value = ''; }
              }
          } catch(e) { console.error(e); }
      };
      
      const login = async () => { 
          const res = await fetch('/api/login', { method:'POST', body:JSON.stringify({password:password.value}) }); 
          const data = await res.json(); 
          if(data.success) { token.value=data.token; localStorage.setItem('nav_token',data.token); load(); } 
          else showToast(t('pwd_error'), 'error'); 
      };
      
      if(token.value) load();

      const updateMeta = () => { document.title = currentDisplayAdminTitle.value; if(db.value.favicon) { let link = document.querySelector("link[rel~='icon']"); if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); } link.href = db.value.favicon; } };
      const injectCustomCode = () => { if (db.value.customCSS) { const style = document.createElement('style'); style.innerHTML = db.value.customCSS; document.head.appendChild(style); } if (db.value.customJS) { const script = document.createElement('script'); script.innerHTML = db.value.customJS; document.body.appendChild(script); } };
      const isImageUrl = (str) => str && (str.startsWith('http') || str.startsWith('/')) && !str.includes(' ');
      const getFav = (u) => { try { return 'https://favicon.im/' + new URL(u).hostname; } catch { return ''; } };
      const defIcon = (e) => e.target.src = 'https://ui-avatars.com/api/?background=random&color=fff&name=Nav';
      
      const selCat = (i) => { curCatIdx.value = i; curSubIdx.value = -1; showAllMode.value = false; };
      const selSub = (i) => { curSubIdx.value = i; showAllMode.value = false; };
      const switchToAll = () => { showAllMode.value = true; curSubIdx.value = -1; };
      const toggleTheme = () => { isDark.value=!isDark.value; localStorage.theme=isDark.value?'dark':'light'; document.documentElement.classList.toggle('dark', isDark.value); };

      const save = async () => { saving.value = true; try { const res = await fetch('/api/save', { method:'POST', headers:{'Authorization':'Bearer '+token.value}, body:JSON.stringify(db.value) }); if(res.ok) { showToast(t('save_success')); updateMeta(); } else showToast(t('auth_fail'), 'error'); } catch(e) { showToast(t('network_err'), 'error'); } saving.value = false; };
      const genId = () => Math.random().toString(36).substr(2,9);
      
      const openModal = (type, title, data, cb) => { tab.value = 'new'; searchLib.value = ''; siteTab.value = 'public'; modal.value = { show:true, type, title, data:JSON.parse(JSON.stringify(data)), callback:cb }; };
      const saveModal = () => { modal.value.callback(modal.value.data); modal.value.show = false; };
      const openSiteSet = () => openModal('site', t('settings'), {title:db.value.title, title_en:db.value.title_en, adminTitle:db.value.adminTitle, adminTitle_en:db.value.adminTitle_en, logo:db.value.logo, adminLogo:db.value.adminLogo, adminIcon:db.value.adminIcon, favicon:db.value.favicon, githubUrl:db.value.githubUrl, customCSS:db.value.customCSS, customJS:db.value.customJS, defaultCityZh:db.value.defaultCityZh, defaultCityEn:db.value.defaultCityEn}, (d)=>{ Object.assign(db.value, d); updateMeta(); });

      const addCategory = () => openModal('cat', t('new_cat'), {name:'New Category', icon:'fas fa-folder'}, (d)=>{ db.value.categories.push({id:'c'+genId(), ...d, itemIds:[], subCategories:[]}); curCatIdx.value = db.value.categories.length - 1; curSubIdx.value = -1; });
      const editCat = (i) => openModal('cat', t('edit_cat'), db.value.categories[i], (d) => Object.assign(db.value.categories[i], d));
      const delCat = (i) => { if(confirm(t('confirm_del_cat'))) db.value.categories.splice(i,1); };
      const moveCat = (i, dir) => { const arr = db.value.categories; if(i+dir>=0 && i+dir<arr.length) [arr[i], arr[i+dir]] = [arr[i+dir], arr[i]]; };
      
      const addSub = () => curCat.value && openModal('sub', t('new_sub'), {name:'New Sub', icon:'fas fa-folder'}, (d)=>{ curCat.value.subCategories.push({id:'s'+genId(), ...d, itemIds:[]}); curSubIdx.value = curCat.value.subCategories.length-1; });
      const editSub = (i) => openModal('sub', t('edit_sub'), {icon:'', ...curCat.value.subCategories[i]}, (d) => Object.assign(curCat.value.subCategories[i], d));
      const delSub = (i) => { if(!confirm(t('confirm_del_sub'))) return; curCat.value.subCategories.splice(i,1); if (curSubIdx.value === i || curSubIdx.value >= curCat.value.subCategories.length) { curSubIdx.value = -1; } };
      
      const addItem = () => { 
          if(!curCat.value && !showAllMode.value) return; 
          openModal('item_add', t('add_link'), {title:'', url:'', desc:'', icon:'', isPrivate: false, selectedIds: []}, (d) => { 
              let count = 0; 
              if(tab.value === 'new') { 
                  if(!d.url) return showToast(t('url_empty'),'error'); 
                  let itemId = 'i'+genId(); 
                  db.value.items[itemId] = { title: d.title||'Untitled', url: d.url, desc: d.desc, icon: d.icon || '', isPrivate: d.isPrivate }; 
                  if(!showAllMode.value) { 
                      const targetArr = (curSubIdx.value === -1) ? curCat.value.itemIds : curCat.value.subCategories[curSubIdx.value].itemIds; 
                      if(!targetArr.includes(itemId)) { targetArr.push(itemId); count++; } 
                  } else {
                      showToast(t('added_pool'));
                  }
              } else { 
                  if (!d.selectedIds || d.selectedIds.length === 0) return showToast(t('select_one'),'error'); 
                  if(!showAllMode.value) { 
                      const targetArr = (curSubIdx.value === -1) ? curCat.value.itemIds : curCat.value.subCategories[curSubIdx.value].itemIds; 
                      d.selectedIds.forEach(id => { if(!targetArr.includes(id)) { targetArr.push(id); count++; } }); 
                  } 
              } 
              if(count > 0) showToast(t('add_success').replace('{n}', count)); else if(tab.value==='exist') showToast(t('exist_err'),'error'); 
          }); 
      };
      const toggleLibSelect = (id) => { const idx = modal.value.data.selectedIds.indexOf(id); if (idx > -1) modal.value.data.selectedIds.splice(idx, 1); else modal.value.data.selectedIds.push(id); };
      const editItem = (id) => openModal('item_edit', t('edit_content'), db.value.items[id], (d) => db.value.items[id] = { ...db.value.items[id], ...d });
      const unlinkItem = (idx) => { if(!confirm(t('confirm_unlink'))) return; if(curSubIdx.value === -1) curCat.value.itemIds.splice(idx, 1); else curCat.value.subCategories[curSubIdx.value].itemIds.splice(idx, 1); };
      const deleteItem = (id) => { if(!confirm(t('confirm_physical_del'))) return; delete db.value.items[id]; db.value.categories.forEach(c => { if(c.itemIds) c.itemIds = c.itemIds.filter(i => i !== id); if(c.subCategories) { c.subCategories.forEach(s => { if(s.itemIds) s.itemIds = s.itemIds.filter(i => i !== id); }); } }); };
      const moveItem = (idx, dir) => { const arr = curSubIdx.value === -1 ? curCat.value.itemIds : curCat.value.subCategories[curSubIdx.value].itemIds; if(idx+dir >= 0 && idx+dir < arr.length) { [arr[idx], arr[idx+dir]] = [arr[idx+dir], arr[idx]]; } };
      
      const exportData = () => { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db.value)); const downloadAnchorNode = document.createElement('a'); downloadAnchorNode.setAttribute("href", dataStr); downloadAnchorNode.setAttribute("download", "nav_backup.json"); document.body.appendChild(downloadAnchorNode); downloadAnchorNode.click(); downloadAnchorNode.remove(); };
      const importData = (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (e) => { try { const json = JSON.parse(e.target.result); if(confirm(t('confirm_overwrite'))) { db.value = json; save(); } } catch(err) { alert(t('file_error')); } }; reader.readAsText(file); };

      return { 
          token, password, db, curCatIdx, curSubIdx, curCat, curItemList, modal, tab, siteTab, searchLib, filteredLib, toast, saving, login, save, getFav, selCat, selSub, addCategory, editCat, delCat, moveCat, addSub, editSub, delSub, addItem, editItem, unlinkItem, deleteItem, moveItem, toggleLibSelect, openSiteSet, saveModal, isImageUrl, presets, exportData, importData, showAllMode, switchToAll, filteredAdminItems, adminSearchQuery, isDark, toggleTheme, t, toggleLang, lang, currentDisplayAdminTitle,
          handleDragStart, handleDragEnd, handleDragOver, handleDrop 
      };
    }
  }).mount('#app');
</script>
</body>
</html>`;
}
