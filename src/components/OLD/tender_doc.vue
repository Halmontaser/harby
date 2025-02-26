<template>
  <div class="card w-1/2" style="filter: contrast(101%); min-width: 300px; max-width: 599px;">
    <div class="card-body bg-gray-100 m-0 p-0">
      <div class="row g-0">
        <div class="col w-1/4 mb-0" style="background-image: url('#');">
          <a class="file_reader p-0 m-0" href="#">
            <img class="img-fluid shadow-lg flex-fill" src="#" />
          </a>
        </div>
        <div class="col w-3/4">
          <a href="#">
            <div>
              <h5 class="text-start ps-2 flex justify-between">{{ row.p_name }}<i class="fa fa-check-circle p-2"></i></h5>
              <span class="flex justify-between">{{ row.comments }}<i class="fa fa-wpforms p-2"></i></span>
            </div>
          </a>
          <div class="row justify-between modal-footer m-0 p-0">
            <div class="col"><small>{{ row.parent }}</small></div>
            <div class="col w-1/2 flex justify-end">
                          </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DocumentCard',
    props: {
      row: {
        type: Object,
        required: true
      }
     
  }}
  </script>
  
  <style scoped>
  .card {
    @apply shadow-md rounded-lg;
  }
  </style>