
<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <h3 class="text-2xl font-semibold mb-4">Legal Documents</h3>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="(document, index) in documents" :key="index" class="bg-gray-100 border border-gray-300 rounded-lg p-4 flex flex-col shadow hover:shadow-lg transition-shadow">
        <div class="flex justify-between items-start mb-2">
          <h4 class="text-lg font-semibold">{{ document.typeOfDoc }}</h4>
          <span :class="['px-2 py-1 text-xs font-semibold rounded-full', getStatusClass(document.status)]">{{ document.status }}</span>
        </div>
        <p class="text-sm text-gray-600">Issued On: {{ formatDate(document.issueDate) }}</p>
        <p class="text-sm text-gray-600">Expires On: {{ formatDate(document.expiredDate) }}</p>
        <p class="text-sm text-gray-600">ID No: {{ document.idNo }}</p>
        <p class="text-sm text-gray-600">Issued From: {{ document.issueFrom }}</p>
        <p class="text-sm text-gray-600">Holder: {{ document.holderName }}</p>
        <p class="text-sm text-gray-600">Comments: {{ document.comments }}</p>
        <p class="text-sm text-gray-600">Verified with Original: <span :class="document.isVerified ? 'text-green-500' : 'text-red-500'">{{ document.isVerified ? 'Yes' : 'No' }}</span></p>
        <button @click="viewDocument(document)" class="mt-2 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">
          View Document
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LegalDocuments',
  data() {
    return {
      documents: [
        {
          typeOfDoc: 'Passport',
          issueDate: '2020-01-15',
          expiredDate: '2030-01-14',
          idNo: 'P123456789',
          issueFrom: 'Government Office',
          attachedFile: 'passport.pdf', // Not used in this example
          holderName: 'John Doe',
          comments: 'N/A',
          isVerified: true,
          status: 'Valid'
        },
        {
          typeOfDoc: 'Driver License',
          issueDate: '2018-05-10',
          expiredDate: '2023-05-09',
          idNo: 'D987654321',
          issueFrom: 'DMV',
          attachedFile: 'driver_license.pdf', // Not used in this example
          holderName: 'Jane Smith',
          comments: 'Renewal pending',
          isVerified: false,
          status: 'Expired'
        },
        // Add more document objects as needed
      ]
    };
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    getStatusClass(status) {
      switch (status) {
        case 'Valid':
          return 'bg-green-100 text-green-800';
        case 'Expired':
          return 'bg-red-100 text-red-800';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    },
    viewDocument(document) {
      // Logic to view the document (e.g., open a modal or redirect)
      alert(`Viewing document: ${document.typeOfDoc}`);
    }
  }
};
</script>

<style scoped>
/* Additional styles can go here if necessary */
</style>