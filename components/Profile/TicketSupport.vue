<template>
  <div>
    <div class="hero">
      <h2>Support Center</h2>
    </div>
    <div class="support-wrapper">
      <!-- Sidebar for tickets and Create Ticket button -->
      <div class="sidebar">
        <div class="button-wrapper">
          <button class="create-ticket-button" @click="openTicketModal">
            + Create Support Ticket
          </button>
        </div>
        <h3>Your Tickets</h3>

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
            </div>
            <span v-if="ticket.userUnread" class="unread-dot"></span>
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
                formatDate(ticket.createdAt)
              }}</span>
            </div>
            <span v-if="ticket.userUnread" class="unread-dot"></span>
          </div>
        </div>
      </div>

      <!-- Main content -->
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
          <button @click="sendMessage">Send</button>
        </div>

        <!-- Show placeholder if no ticket is selected -->
        <div v-else class="no-ticket-placeholder">
          <img src="/Logos/OAName.svg" alt="No Ticket Selected" />
          <p>Please select a ticket to view its details or create a new one!</p>
        </div>
      </div>

      <!-- Ticket creation modal -->
      <div v-if="showModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Create a Support Ticket</h2>
          <label for="title">Title:</label>
          <input
            type="text"
            v-model="newTicket.title"
            placeholder="Enter title"
          />
          <label for="description">Description:</label>
          <textarea
            v-model="newTicket.description"
            placeholder="Describe your issue"
          ></textarea>
          <div class="modal-buttons">
            <button @click="submitTicket">Submit Ticket</button>
            <button @click="closeTicketModal" class="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const userStore = useUserStore();

const showModal = ref(false);
const newTicket = ref({ title: "", description: "" });
const selectedTicket = ref(null);
const newMessage = ref("");

const emit = defineEmits(["close-sidebar"]);

// Use SSR-friendly fetching at the top-level
const { data: initialTickets, error: ticketsError } = await useFetch(
  `/api/tickets/${userStore.user._id}`
);

// Make tickets a computed property that depends on initialTickets
const tickets = computed(() =>
  Array.isArray(initialTickets.value) ? initialTickets.value : []
);

if (ticketsError.value) {
  console.error("Error fetching tickets:", ticketsError.value);
}

const openTicketModal = () => {
  if (window.innerWidth < 768) {
    emit("close-sidebar");
  }
  showModal.value = true;
};

const closeTicketModal = () => {
  showModal.value = false;
  newTicket.value = { title: "", description: "" };
};

const submitTicket = async () => {
  try {
    const ticketData = {
      userId: userStore.user._id,
      userName: userStore.user.name,
      title: newTicket.value.title,
      description: newTicket.value.description,
    };
    const data = await $fetch("/api/tickets", {
      method: "POST",
      body: ticketData,
    });
    // Since tickets is computed, to update it we need to update initialTickets
    initialTickets.value = [...tickets.value, data];
    closeTicketModal();
  } catch (error) {
    console.error("Error creating ticket:", error);
  }
};

const selectTicket = async (ticket) => {
  selectedTicket.value = ticket;
  if (selectedTicket.value.userUnread === true) {
    selectedTicket.value.userUnread = false;
    try {
      await $fetch(`/api/tickets/${selectedTicket.value._id}`, {
        method: "PUT",
        body: {
          userUnread: false,
        },
      });
      // Update the ticket in initialTickets
      const updatedTickets = tickets.value.map((t) =>
        t._id === selectedTicket.value._id ? { ...t, userUnread: false } : t
      );
      initialTickets.value = updatedTickets;
    } catch (error) {
      console.error("Error marking ticket as read:", error);
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
          body: {
            text: newMessage.value,
            senderName: userStore.user.name,
            isUser: true,
          },
        }
      );
      selectedTicket.value = response;
      newMessage.value = "";
      await fetchTickets(); // Re-fetch tickets to update the list
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
};

const fetchTickets = async () => {
  try {
    const fetchedTickets = await $fetch(`/api/tickets/${userStore.user._id}`);
    initialTickets.value = Array.isArray(fetchedTickets) ? fetchedTickets : [];
  } catch (error) {
    console.error("Error fetching tickets:", error);
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

.create-ticket-button {
  background-color: #3f654c;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  font-size: 16px;
}

h3 {
  margin-left: 10px;
}

.ticket-section {
  margin-top: 20px;
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

.ticket-date {
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
  background-color: #3f654c;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
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
  max-width: 90%;
}

.modal-content h2 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-content label {
  display: block;
  margin: 10px 0 5px;
  font-weight: bold;
  color: #555;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-buttons button {
  font-size: 14px;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
}

.cancel-button:hover {
  background-color: #5a6268;
}

/* Placeholder styles */
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

/* Responsive styling */
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
