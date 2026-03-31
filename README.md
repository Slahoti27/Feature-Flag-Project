## 🚀 Feature Flag Management System

A production-inspired full-stack Feature Flag (Feature Toggle) platform that enables dynamic control over application features without requiring redeployments.

Built with Vue, Vuetify, Node.js, and PostgreSQL, this system supports user-specific targeting, percentage-based rollouts, and a real-time interactive dashboard for managing feature flags.

### ✨ Features

- 🔄 Create, update, delete feature flags (CRUD)
- 🎯 User-specific feature targeting
- 📊 Percentage-based rollout using deterministic hashing
- ⚡ Real-time feature evaluation API (`/flags/evaluate`)
- 🎛️ Interactive admin dashboard with toggle controls
- 🟢 Status indicators (ON/OFF) with live updates
- ✏️ Inline editing of rollout percentage
- 🗑️ Delete functionality with instant UI updates
- 🔔 Snackbar feedback for user actions

### 🧠 Core Concept

Implements a deterministic feature evaluation engine:
- Ensures consistent results for the same user
- Supports hybrid logic: user targeting + rollout percentage

### 🏗️ Tech Stack

- Frontend: Vue.js, Vuetify
- Backend: Node.js, Express.js
- Database: PostgreSQL
- API: REST

### 📡 Example API

```bash
GET /api/flags/evaluate?userId=user123