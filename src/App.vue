<template>
  <div>
    <div class="btn-group" role="group" aria-label="Basic mixed styles example">
      <button type="button" class="btn btn-danger">
        <router-link class="text-light" to="/">Home</router-link>
      </button>
    </div>
    <router-view></router-view>
  </div>
</template>
