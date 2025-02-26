<template>
  <div>
    <h1>Event Tenders</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <div v-for="event in events" :key="event.id">
        <!-- Display event details here -->
        <events-tender
          :datetime="event.datetime"
          :event_title="event.event_title"
          :event_translation="event.event_translation"
          :event_evenue="event.event_evenue"
          :event_address="event.event_address"
          :event_has_address="event.event_has_address"
        />
      </div>
    </div>
  </div>
</template>

<script>
import EventsTender from './EventsTender.vue';

export default {
  name: 'EventTendersList',
  components: {
    EventsTender,
  },
  data() {
    return {
      events: [],
      loading: true,
    };
  },
  created() {
    this.fetchEventTenders();
  },
  methods: {
    async fetchEventTenders() {
      try {
        const response = await fetch('https://api.example.com/event-tenders');
        const data = await response.json();
        this.events = data;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching event tenders:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>