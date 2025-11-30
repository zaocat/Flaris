# Flaris 🧭 Your bookmark galaxy on the edge. / 云端导航站

![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange?logo=cloudflare&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-3.0-4FC08D?logo=vuedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

[English](#english) | [中文说明](#chinese)

---

<a name="english"></a>
## 📖 English

**CF-Nav** is a lightweight, serverless, and highly customizable navigation/bookmark site running entirely on **Cloudflare Workers**. It uses **Cloudflare KV** for data storage, requiring no external server or database.

It features a modern UI built with **Vue 3** and **Tailwind CSS**, offering a seamless experience for both visitors and administrators.

### ✨ Features

* **☁️ Serverless:** Hosted 100% on Cloudflare Workers (Free Tier friendly).
* **⚡ Single File:** The entire logic (Frontend + Backend) is contained in a single `worker.js` file.
* **🎨 Modern UI:** Glassmorphism design, responsive layout (Mobile/Desktop), and smooth transitions.
* **🌗 Dark/Light Mode:** Automatic detection with a manual toggle switch.
* **🌍 Internationalization (i18n):** Built-in English and Chinese support, auto-synced between views.
* **🔒 Admin Panel:**
    * Secure login protection.
    * **Visual Editing:** Add/Edit/Delete Categories and Links visually.
    * **Drag & Drop Sorting:** Easily reorder categories and items.
    * **Icons:** Built-in FontAwesome selector and custom image URL support.
    * **Private Links:** Hide sensitive links from visitors (visible only to admin).
    * **Batch Selection:** Add existing items from the pool to multiple categories.
* **💾 Backup & Restore:** One-click JSON export/import to keep your data safe.
* **🔍 Global Search:** Real-time filtering of all links.

### 🚀 Quick Deployment

1.  **Login to Cloudflare Dashboard:**
    * Go to `Workers & Pages` -> `Overview`.
    * Click `Create Application` -> `Create Worker`.
    * Name it (e.g., `my-nav`) and `Deploy`.

2.  **Configure KV Namespace:**
    * Go to `Workers & Pages` -> `KV`.
    * Click `Create a Namespace`, name it `NAV_KV` (or any name).
    * Go back to your Worker -> `Settings` -> `Variables` -> `KV Namespace Bindings`.
    * **Variable name:** `NAV_DB` (Case sensitive, must be exact).
    * **KV Namespace:** Select the `NAV_KV` you just created.

3.  **Set Admin Password:**
    * In your Worker -> `Settings` -> `Variables` -> `Environment Variables`.
    * Click `Add variable`.
    * **Variable name:** `ADMIN_PASSWORD`.
    * **Value:** Your desired password (e.g., `123456`).
    * Click `Deploy` (or Save and Deploy).

4.  **Upload Code:**
    * Click `Edit code`.
    * Copy the content of `worker.js` from this repository.
    * Paste it into the Cloudflare editor (replace existing code).
    * Click `Deploy`.

5.  **Enjoy!**
    * Visit your Worker URL (e.g., `https://my-nav.your-name.workers.dev`).
    * Click the **Shield Icon** (or Gear Icon) in the top-right corner to login.

### 🛠️ Configuration

You can customize the site title, logo, and favicon directly in the **Admin Panel -> Settings**.

* **Admin Entry:** Click the Shield/Gear icon in the header.
* **Private Items:** Check the "Private Link" box when editing. These items show a lock icon and are hidden from public view.

---

<a name="chinese"></a>
## 🇨🇳 中文说明

**CF-Nav** 是一个轻量级、无服务器的个人导航/书签站，完全运行在 **Cloudflare Workers** 上。它使用 **Cloudflare KV** 作为数据库，无需购买任何服务器。

前端基于 **Vue 3** 和 **Tailwind CSS** 构建，拥有现代化的 UI 设计和强大的后台管理功能。

### ✨ 功能特性

* **☁️ Serverless 架构:** 100% 运行在 Cloudflare Workers 上（免费版额度足够个人使用）。
* **⚡ 单文件部署:** 前后端逻辑包含在一个 `worker.js` 文件中，极易维护。
* **🎨 现代化 UI:** 磨砂玻璃质感，响应式布局（完美适配手机/桌面），丝滑的动画效果。
* **🌗均色/暗黑模式:** 支持日间/夜间模式切换，且配置持久化。
* **🌍 多语言 (i18n):** 内置中英文切换，前后台语言自动同步。
* **🔒 强大的管理后台:**
    * 安全登录保护。
    * **可视化编辑:** 直观地添加、修改、删除栏目和链接。
    * **拖拽排序:** 支持栏目和内容的上下移动排序。
    * **图标选择器:** 内置常用 FontAwesome 图标，也支持自定义图片 URL（自动识别 Logo）。
    * **私有链接:** 可将特定链接设为“私有”，仅管理员登录后可见（访客端自动过滤，保护隐私）。
    * **批量关联:** 支持从内容池中多选已有链接添加到不同分类。
* **💾 备份与恢复:** 支持一键导出 JSON 备份数据，或导入 JSON 恢复数据。
* **🔍 全局搜索:** 顶部自带搜索框，实时过滤所有链接。

### 🚀 部署教程

1.  **登录 Cloudflare:**
    * 进入 `Workers & Pages` -> `Overview`。
    * 点击 `Create Application` -> `Create Worker`。
    * 给 Worker 起个名字（例如 `my-nav`），然后点击 `Deploy`。

2.  **配置 KV 数据库:**
    * 在左侧菜单点击 `KV`。
    * 点击 `Create a Namespace`，命名为 `NAV_KV`（名字随意）。
    * 回到你刚才创建的 Worker -> `Settings` -> `Variables` -> `KV Namespace Bindings`。
    * 点击 `Add binding`。
    * **Variable name (变量名):** 必须填写 `NAV_DB` (大小写敏感)。
    * **KV Namespace:** 选择你刚才创建的 `NAV_KV`。
    * 点击 `Save and Deploy`。

3.  **设置管理密码:**
    * 仍在 Worker 的 `Settings` -> `Variables` 页面，找到 `Environment Variables` (环境变量)。
    * 点击 `Add variable`。
    * **Variable name:** `ADMIN_PASSWORD`。
    * **Value:** 填写你想要的后台密码（例如 `123456`）。
    * 点击 `Save and Deploy`。

4.  **上传代码:**
    * 点击右上角的 `Edit code` 按钮进入编辑器。
    * 复制本项目 `worker.js` 的所有代码。
    * 覆盖编辑器中的默认代码。
    * 点击右上角的 `Deploy`。

5.  **开始使用:**
    * 访问你的 Worker 域名（例如 `https://my-nav.your-name.workers.dev`）。
    * 点击右上角的 **盾牌图标** 或 **设置图标** 进入管理后台。
    * 输入刚才设置的密码即可开始配置你的导航站！

### 🛠️ 常见问题与设置

* **如何修改网站标题和 Logo？**
    * 登录后台后，点击左下角的 **“设置”** 按钮，在弹窗中可以修改前台标题、后台标题、Logo、Favicon 以及 GitHub 地址等。
* **私有链接是什么？**
    * 在添加或编辑链接时，勾选“私有链接”。该链接在未登录状态下不会加载，也不会出现在网页源码中，适合存放 NAS、路由器后台等敏感地址。
* **如何自定义 CSS/JS？**
    * 在“站点设置”的“高级”选项卡中，你可以注入自定义的 CSS 样式或 JavaScript 代码（用于统计代码等）。

## 📄 License

MIT License
