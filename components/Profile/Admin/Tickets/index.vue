<template>
  <div>
    <div class="hero">
      <h2>Admin Support Center</h2>
    </div>
    <div class="support-wrapper">
      <!-- Sidebar for managing tickets -->
      <div class="sidebar">
        <h3>All Tickets</h3>

        <div class="ticket-section open-section">
          <h4>Open Tickets</h4>
          <div
            v-for="ticket in openTickets"
            :key="ticket._id"
            class="ticket-tab"
            :class="{
              active: selectedTicket && selectedTicket._id === ticket._id,
            }"
            @click="selectTicket(ticket)"
          >
            <div class="ticket-info">
              <strong>{{ ticket.title }}</strong>
              <span class="ticket-date">{{
                formatDateTime(ticket.updatedAt)
              }}</span>
              <span class="ticket-user">User: {{ ticket.userName }}</span>
            </div>
            <span v-if="ticket.adminUnread" class="unread-dot"></span>
          </div>
        </div>

        <div class="ticket-section closed-section">
          <h4>Closed Tickets</h4>
          <div
            v-for="ticket in closedTickets"
            :key="ticket._id"
            class="ticket-tab"
            :class="{
              active: selectedTicket && selectedTicket._id === ticket._id,
            }"
            @click="selectTicket(ticket)"
          >
            <div class="ticket-info">
              <strong>{{ ticket.title }}</strong>
              <span class="ticket-date">{{
                formatDateTime(ticket.updatedAt)
              }}</span>
              <span class="ticket-user">User: {{ ticket.userName }}</span>
            </div>
            <span v-if="ticket.adminUnread" class="unread-dot"></span>
          </div>
        </div>
      </div>

      <!-- Main content area -->
      <div class="conversation-view">
        <!-- Show conversation if a ticket is selected -->
        <div v-if="selectedTicket">
          <h2>{{ selectedTicket.title }}</h2>
          <ul class="messages">
            <li
              v-for="message in selectedTicket.messages"
              :key="message.timestamp"
              class="message-box"
            >
              <div class="message-header">
                <strong>{{ message.senderName }}</strong>
                <span class="message-timestamp">{{
                  formatDateTime(message.timestamp)
                }}</span>
              </div>
              <p>{{ message.text }}</p>
            </li>
          </ul>
          <textarea
            v-model="newMessage"
            placeholder="Type your message here"
          ></textarea>
          <div class="action-buttons">
            <button @click="sendMessage">Send Reply</button>
            <button @click="toggleTicketStatus" class="right-button">
              {{
                selectedTicket.status === "open"
                  ? "Close Ticket"
                  : "Reopen Ticket"
              }}
            </button>
            <button @click="attemptDelete" class="delete-button">
              Delete Ticket
            </button>
          </div>
        </div>

        <!-- Show placeholder if no ticket is selected -->
        <div v-else class="no-ticket-placeholder">
          <img src="/Logos/OALogo.svg" alt="No Ticket Selected" />
          <p>Please select a ticket to view its details or create a new one!</p>
        </div>
      </div>

      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this ticket?</p>
          <div class="modal-buttons">
            <button @click="deleteTicket" class="delete-confirm-button">
              Yes, Delete
            </button>
            <button @click="cancelDelete" class="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: initialTickets, error: ticketsError } = await useFetch(
  "/api/tickets"
);

// Use a computed property so that tickets updates reactively once initialTickets is available
const tickets = computed(() =>
  Array.isArray(initialTickets.value) ? initialTickets.value : []
);

// Now your openTickets and closedTickets computed properties, as well as other logic,
// will always work with a guaranteed array, preventing any null or undefined issues.

const selectedTicket = ref(null);
const newMessage = ref("");
const showDeleteModal = ref(false);

const emit = defineEmits(["close-sidebar"]);

// Keep fetchTickets for re-fetching after certain actions
const fetchTickets = async () => {
  try {
    const fetched = await $fetch("/api/tickets");
    // Ensure tickets is updated in a way consistent with above logic.
    // Since tickets is computed from initialTickets, you'll need to use a ref if you want to reassign:
    initialTickets.value = fetched;
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
};

const selectTicket = async (ticket) => {
  selectedTicket.value = ticket;
  if (selectedTicket.value.adminUnread === true) {
    selectedTicket.value.adminUnread = false;
    try {
      await $fetch(`/api/tickets/${selectedTicket.value._id}`, {
        method: "PUT",
        body: {
          adminUnread: false,
        },
      });
    } catch (error) {
      console.error("Error marking ticket as read by admin:", error);
    }
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim()) {
    try {
      const response = await $fetch(
        `/api/tickets/${selectedTicket.value._id}`,
        {
          method: "PUT",
          body: { text: newMessage.value, senderName: "Admin", isUser: false },
        }
      );
      selectedTicket.value = response;
      newMessage.value = "";
      await fetchTickets();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};

const toggleTicketStatus = async () => {
  try {
    const newStatus =
      selectedTicket.value.status === "open" ? "closed" : "open";
    const response = await $fetch(`/api/tickets/${selectedTicket.value._id}`, {
      method: "PUT",
      body: { status: newStatus },
    });
    selectedTicket.value = response;
    await fetchTickets();
  } catch (error) {
    console.error("Error updating ticket status:", error);
  }
};

const attemptDelete = () => {
  if (window.innerWidth < 768) {
    emit("close-sidebar");
  }
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
};

const deleteTicket = async () => {
  try {
    await $fetch(`/api/tickets/${selectedTicket.value._id}`, {
      method: "DELETE",
    });
    selectedTicket.value = null;
    showDeleteModal.value = false;
    await fetchTickets();
  } catch (error) {
    console.error("Error deleting ticket:", error);
  }
};

const openTickets = computed(() =>
  tickets.value
    .filter((ticket) => ticket.status === "open")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
);

const closedTickets = computed(() =>
  tickets.value
    .filter((ticket) => ticket.status === "closed")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
);

const formatDate = (date) => new Date(date).toLocaleDateString();
const formatDateTime = (date) =>
  new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
</script>



<style scoped>
.hero {
  width: 100%;
  text-align: left;
  border-bottom: 2px solid white;
  background-color: #f7f7f7;
  padding: 0.75rem 10px;
  color: white;
  background: #3f654c;
}

.hero h2 {
  margin: 0;
  color: white;
  font-size: 18px;
}

.support-wrapper {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 300px;
  background: #f4f5f7;
  border-right: 1px solid #ddd;
}

.button-wrapper {
  padding: 10px;
  margin-bottom: 1rem;
}

h3 {
  margin: 1rem 0 1rem 10px;
}

.ticket-section h4 {
  margin-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;
  text-decoration: underline;
}

.open-section {
  background-color: #e6f7ff;
  border-radius: 5px;
  margin-bottom: 1rem;
  padding-bottom: 10px;
}

.closed-section {
  background-color: #f0f0f0;
  border-radius: 5px;
  padding-bottom: 10px;
}

.ticket-tab {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  position: relative;
  padding-left: 10px;
  transition: background-color 0.3s ease;
}

.ticket-tab.active,
.ticket-tab:hover {
  background-color: #d0e7ff;
}

.ticket-info {
  display: flex;
  flex-direction: column;
}

.ticket-date,
.ticket-user {
  font-size: 12px;
  color: #888;
}

.unread-dot {
  width: 10px;
  height: 10px;
  background-color: lightblue;
  border-radius: 50%;
  position: absolute;
  right: 10px;
}

.conversation-view {
  flex: 1;
  padding: 20px;
}

.conversation-view h2 {
  margin-bottom: 1rem;
  color: white;
}

.messages {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
  max-height: 60vh;
  overflow-y: auto;
}

.message-box {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.message-box p {
  font-weight: lighter;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.message-timestamp {
  font-size: 12px;
  color: #888;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.right-button {
  margin-left: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  margin-left: 1rem;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c82333;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-content p {
  margin: 1rem 0;
  font-size: 16px;
  color: #555;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.delete-confirm-button {
  background-color: #dc3545;
  color: white;
  transition: background-color 0.3s ease;
}

.delete-confirm-button:hover {
  background-color: #c82333;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* Placeholder styles (copied exactly from the user's original component) */
.no-ticket-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 2rem;
  color: #555;
}

.no-ticket-placeholder img {
  width: 150px;
  height: auto;
  margin-bottom: 1rem;
}

.no-ticket-placeholder p {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  color: white;
}

@media (max-width: 768px) {
  .support-wrapper {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    padding: 10px;
    border-right: none;
    border-bottom: 1px solid #ddd;
  }

  .conversation-view {
    width: 100%;
    padding: 10px;
  }

  .modal-content {
    width: 90%;
    padding: 15px;
  }

  .hero {
    padding: 1.25rem 10px;
  }

  .hero h2 {
    font-size: 16px;
    text-align: center;
  }

  .button-wrapper,
  .ticket-section h4,
  .create-ticket-button {
    font-size: 14px;
  }

  .ticket-tab {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
