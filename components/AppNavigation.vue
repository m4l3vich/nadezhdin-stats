<template>
  <nav class="app-navigation">
    <ul>
      <li>
        <NuxtLink to="/" class="app-navigation__link" active-class="app-navigation__link_active">
          <Icon name="material-symbols:map-outline-rounded" />
          <span class="app-navigation__link-text">Карта</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/chart" class="app-navigation__link" active-class="app-navigation__link_active">
          <Icon name="material-symbols:bar-chart-4-bars-rounded" />
          <span class="app-navigation__link-text">График</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss">
.app-navigation {
  @media screen and (min-width: 750px) {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 999px;
  }

  background: #e5eef7;
  border: 8px solid #e5eef7;

  @media screen and (prefers-color-scheme: dark) {
    background: #1b1d1e;
    border: 8px solid #1b1d1e;
  }

  ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;

    justify-content: center;
  }

  @media screen and (max-width: 750px) {
    li {
      flex: 1;
    }
  }

  &__link {
    font-size: 18px;
    border-radius: 999px;
    padding: 8px 16px;

    display: flex;
    align-items: center;
    gap: 8px;

    color: var(--text);
    text-decoration: none;

    & .icon {
      font-size: 24px;
    }

    &_active {
      color: var(--background);
      background: var(--blue)
    }

    @media screen and (max-width: 750px) {
      justify-content: center;
      font-size: 14px;

      opacity: 0.5;

      &_active {
        opacity: 1;
        font-weight: bold;

        background: none;
        color: var(--blue)
      }
    }
  }
}
</style>
