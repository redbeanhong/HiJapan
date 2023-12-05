<template>
  <div class="bg-dark text-light min-vh-100 d-flex flex-column">
    <nav
      class="navbar navbar-dark bg-secondary position-fixed top-0 w-100 z-99"
    >
      <div class="container-fluid ps-5 pe-5">
        <router-link class="navbar-brand d-flex align-items-center" to="/">
          <img
            src="./assets/image/logo.png"
            alt=""
            width="35"
            height="35"
            class="d-inline-block align-text-top"
          />
        </router-link>
        <ul class="navbar-nav flex-row">
          <li class="nav-item">
            <router-link class="nav-link fw-bold" to="/">Home</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class="flex-grow-1"></router-view>
  </div>
</template>
