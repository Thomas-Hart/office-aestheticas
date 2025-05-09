<template>
  <div class="wrapper">
    <header class="header">
      <h1>Job Applications</h1>
    </header>

    <div class="main-container">
      <aside class="sidebar">
        <button class="new-btn" @click="openModal">+ New Application</button>

        <div v-for="status in statuses" :key="status" class="status-group">
          <h3 class="status-header">{{ status }}</h3>
          <ul class="app-list">
            <li
              v-for="app in applications.filter((a) => a.status === status)"
              :key="app._id"
              @click="select(app)"
              :class="[
                'app-item',
                'status-' + status,
                { active: selected._id === app._id },
              ]"
            >
              {{ app.jobTitle }} @ {{ app.company }}
            </li>
          </ul>
        </div>
      </aside>

      <section class="editor">
        <div v-if="selected._id">
          <div class="form-group" :class="{ 'has-text': selected.jobTitle }">
            <label for="jobTitle">Job Title</label>
            <input id="jobTitle" v-model="selected.jobTitle" type="text" />
          </div>

          <div class="form-group" :class="{ 'has-text': selected.company }">
            <label for="company">Company</label>
            <input id="company" v-model="selected.company" type="text" />
          </div>

          <div class="form-group" :class="{ 'has-text': selected.appliedDate }">
            <label for="appliedDate">Applied Date</label>
            <input
              id="appliedDate"
              v-model="selected.appliedDate"
              type="date"
            />
          </div>

          <div class="form-group" :class="{ 'has-text': selected.status }">
            <label for="status">Status</label>
            <select id="status" v-model="selected.status">
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>

          <div
            class="form-group"
            :class="{ 'has-text': selected.expectedSalary != null }"
          >
            <label for="expectedSalary">Expected Salary</label>
            <input
              id="expectedSalary"
              v-model.number="selected.expectedSalary"
              type="number"
              step="0.01"
            />
          </div>

          <div
            class="form-group"
            :class="{ 'has-text': selected.offerAmount != null }"
          >
            <label for="offerAmount">Offer Amount</label>
            <input
              id="offerAmount"
              v-model.number="selected.offerAmount"
              type="number"
              step="0.01"
            />
          </div>

          <div class="form-group" :class="{ 'has-text': selected.notes }">
            <label for="notes">Notes</label>
            <textarea id="notes" v-model="selected.notes" rows="3"></textarea>
          </div>

          <div class="actions">
            <button @click="saveApp" :disabled="isSaving">
              {{ isSaving ? "Saving…" : "Update" }}
            </button>
            <button @click="openDeleteModal" :disabled="isDeleting">
              {{ isDeleting ? "Deleting…" : "Delete" }}
            </button>
          </div>
        </div>
        <div v-else class="no-select">
          <p>Select an application from the list or create a new one.</p>
        </div>
      </section>
    </div>

    <div class="modal-overlay" v-if="showModal">
      <div class="modal">
        <h2>New Application</h2>
        <form @submit.prevent="createApp">
          <div class="form-group" :class="{ 'has-text': form.jobTitle }">
            <label for="mJobTitle">Job Title</label>
            <input
              id="mJobTitle"
              v-model="form.jobTitle"
              type="text"
              required
            />
          </div>

          <div class="form-group" :class="{ 'has-text': form.company }">
            <label for="mCompany">Company</label>
            <input id="mCompany" v-model="form.company" type="text" required />
          </div>

          <div class="form-group" :class="{ 'has-text': form.appliedDate }">
            <label for="mAppliedDate">Applied Date</label>
            <input
              id="mAppliedDate"
              v-model="form.appliedDate"
              type="date"
              required
            />
          </div>

          <div class="form-group" :class="{ 'has-text': form.status }">
            <label for="mStatus">Status</label>
            <select id="mStatus" v-model="form.status">
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>

          <div
            class="form-group"
            :class="{ 'has-text': form.expectedSalary != null }"
          >
            <label for="mExpectedSalary">Expected Salary</label>
            <input
              id="mExpectedSalary"
              v-model.number="form.expectedSalary"
              type="number"
              step="0.01"
            />
          </div>

          <div
            class="form-group"
            :class="{ 'has-text': form.offerAmount != null }"
          >
            <label for="mOfferAmount">Offer Amount</label>
            <input
              id="mOfferAmount"
              v-model.number="form.offerAmount"
              type="number"
              step="0.01"
            />
          </div>

          <div class="form-group" :class="{ 'has-text': form.notes }">
            <label for="mNotes">Notes</label>
            <textarea id="mNotes" v-model="form.notes" rows="3"></textarea>
          </div>

          <div class="modal-actions">
            <button type="submit" :disabled="isSaving">
              {{ isSaving ? "Creating…" : "Create" }}
            </button>
            <button type="button" @click="closeModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <div class="modal-overlay" v-if="showDeleteModal">
      <div class="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this application?</p>
        <div class="modal-actions">
          <button @click="confirmDelete" :disabled="isDeleting">Yes</button>
          <button @click="closeDeleteModal">No</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from "vue";

const statuses = ["Applied", "Interview", "Offer", "Accepted", "Rejected"];
const applications = ref([]);
const selected = reactive({
  _id: null,
  jobTitle: "",
  company: "",
  appliedDate: new Date().toISOString().slice(0, 10),
  status: "Applied",
  expectedSalary: null,
  offerAmount: null,
  notes: "",
});
const form = reactive({ ...selected });
const isSaving = ref(false);
const isDeleting = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);

async function fetchApps() {
  applications.value = await $fetch("/api/jobApplication");
}

onMounted(fetchApps);

function select(app) {
  Object.assign(selected, {
    _id: app._id,
    jobTitle: app.jobTitle,
    company: app.company,
    appliedDate: app.appliedDate.slice(0, 10),
    status: app.status,
    expectedSalary: app.expectedSalary,
    offerAmount: app.offerAmount,
    notes: app.notes,
  });
}

function openModal() {
  Object.assign(form, {
    _id: null,
    jobTitle: "",
    company: "",
    appliedDate: new Date().toISOString().slice(0, 10),
    status: "Applied",
    expectedSalary: null,
    offerAmount: null,
    notes: "",
  });
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function createApp() {
  isSaving.value = true;
  try {
    await $fetch("/api/jobApplication", {
      method: "POST",
      body: form,
    });
    await fetchApps();
    const created = applications.value.find(
      (a) => a.jobTitle === form.jobTitle && a.company === form.company
    );
    if (created) select(created);
    closeModal();
  } finally {
    isSaving.value = false;
  }
}

async function saveApp() {
  isSaving.value = true;
  try {
    await $fetch(`/api/jobApplication/${selected._id}`, {
      method: "PUT",
      body: selected,
    });
    await fetchApps();
  } finally {
    isSaving.value = false;
  }
}

function openDeleteModal() {
  showDeleteModal.value = true;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
}

async function confirmDelete() {
  isDeleting.value = true;
  try {
    await $fetch(`/api/jobApplication/${selected._id}`, {
      method: "DELETE",
    });
    await fetchApps();
    Object.assign(selected, form);
    closeDeleteModal();
  } finally {
    isDeleting.value = false;
  }
}
</script>
  
  <style scoped>
.form-group {
  position: relative;
  margin-bottom: 1rem;
  height: 50px;
}
.form-group input,
.form-group select,
.form-group textarea {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  line-height: 60px;
  padding: 0 12px;
  font-size: 13px;
  color: #000;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  transition: all 0.2s ease;
}
.form-group.has-text input,
.form-group.has-text select,
.form-group.has-text textarea {
  line-height: 12px;
  padding-top: 16px;
  border-color: #66afe9;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #66afe9;
  outline: none;
}
.form-group label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #777;
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 1;
}
.form-group.has-text label {
  top: 8px;
  transform: none;
  font-size: 12px;
  color: #555;
}

.wrapper {
  font-family: "Inter", sans-serif;
  background: #f9fafb;
  min-height: 100vh;
}
.header {
  background: #fff;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}
.header h1 {
  margin: 0;
  color: #2563eb;
}
.main-container {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem;
}
.sidebar {
  flex: 0 0 240px;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 4px;
}
.new-btn {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.new-btn:hover {
  background: #1d4ed8;
}
.status-group + .status-group {
  margin-top: 1.5rem;
}
.status-header {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.app-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.app-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  border-left: 4px solid transparent;
  transition: background 0.2s ease;
}
.app-item:hover,
.app-item.active {
  background: #f0f9ff;
}
.status-Applied .app-item {
  border-left-color: #2563eb;
}
.status-Interview .app-item {
  border-left-color: #10b981;
}
.status-Offer .app-item {
  border-left-color: #f59e0b;
}
.status-Accepted .app-item {
  border-left-color: #6366f1;
}
.status-Rejected .app-item {
  border-left-color: #ef4444;
}
.editor {
  flex: 1;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 4px;
}
.no-select {
  color: #6b7280;
  text-align: center;
  margin-top: 2rem;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.actions button:first-child {
  background: #10b981;
  color: #fff;
}
.actions button:last-child {
  background: #ef4444;
  color: #fff;
}
.actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal {
  background: #fff;
  padding: 1.5rem;
  width: 360px;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.modal h2 {
  margin-top: 0;
  color: #374151;
  text-align: center;
}
.modal p {
  margin: 1rem 0;
  text-align: center;
}
.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.modal-actions button {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-actions button:first-child {
  background: #2563eb;
  color: #fff;
  margin-right: 0.5rem;
}
.modal-actions button:last-child {
  background: #dc2626;
  color: #fff;
}
</style>
  