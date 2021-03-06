# Universal

> PhilleepEdit Nuxt Universal Web Application Boilerplate with Express Middleware

## Build Setup

``` bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

### Project Set Up

All files beginning with `__` need to be created by removing the `__`.
If the files already exist, sync the contents while giving preference with the `__` files.

### Folder Structure

```
├── COMMIT.md
├── README.md
├── __.env
├── __nuxt.config.js
├── __package.json
├── api
│   ├── config
│   │   ├── api.js
│   │   ├── app.js
│   │   ├── form.js
│   │   ├── initialize.js
│   │   └── router.js
│   ├── controllers
│   │   ├── app
│   │   │   ├── analytics.js
│   │   │   ├── boilerplate.js
│   │   │   ├── curl.js
│   │   │   ├── error.js
│   │   │   ├── mailbox.js
│   │   │   ├── metadata.js
│   │   │   └── server.js
│   │   ├── auth
│   │   │   ├── confirm.js
│   │   │   ├── credentials.js
│   │   │   ├── login.js
│   │   │   ├── logout.js
│   │   │   ├── options.js
│   │   │   ├── register.js
│   │   │   ├── reset.js
│   │   │   ├── settings.js
│   │   │   └── user.js
│   │   ├── cache
│   │   │   ├── flush.js
│   │   │   ├── stats.js
│   │   │   └── view.js
│   │   ├── contents
│   │   │   └── README.md
│   │   ├── form
│   │   │   ├── submit.js
│   │   │   ├── update.js
│   │   │   └── upload.js
│   │   └── webhooks
│   │       └── colors.js
│   ├── helpers
│   │   └── core
│   │       ├── api.js
│   │       ├── app.js
│   │       ├── cache.js
│   │       ├── compile.js
│   │       ├── cookie.js
│   │       ├── format.js
│   │       ├── gravatar.js
│   │       ├── initialize.js
│   │       ├── logger.js
│   │       ├── login.js
│   │       ├── logout.js
│   │       ├── page.js
│   │       ├── user.js
│   │       └── validator.js
│   ├── index.js
│   └── policies
│       ├── app.js
│       ├── auth.js
│       └── page.js
├── assets
│   ├── README.md
│   └── styles
│       ├── app.less
│       ├── importer.less
│       ├── mixins
│       │   ├── colors.less
│       │   ├── functions.less
│       │   ├── mixins.less
│       │   └── utilities.less
│       ├── modules
│       │   ├── alert.less
│       │   ├── colors.less
│       │   ├── editor.less
│       │   ├── form.less
│       │   ├── maps.less
│       │   ├── scroll.less
│       │   └── tooltip.less
│       └── project.less
├── boilerplate.config.js
├── components
│   ├── Logo.vue
│   ├── README.md
│   └── core
│       ├── forms
│       │   ├── FileInput.vue
│       │   ├── Form.vue
│       │   └── MediumEditor.vue
│       ├── layouts
│       │   ├── Analytics.vue
│       │   ├── Contact.vue
│       │   ├── Footer.vue
│       │   ├── Header.vue
│       │   ├── Navigation.vue
│       │   ├── Options.vue
│       │   └── Share.vue
│       ├── pages
│       │   ├── Loader.vue
│       │   └── UserProfile.vue
│       ├── ui
│       │   ├── CustomScroll.vue
│       │   ├── ImageLoader.vue
│       │   ├── NavLink.vue
│       │   └── maps
│       │       └── google
│       │           ├── GoogleMaps.vue
│       │           ├── GoogleMapsGeolocation.vue
│       │           └── GoogleMapsInfoBox.vue
│       └── wrappers
│           ├── Auth.vue
│           ├── Page.vue
│           └── User.vue
├── helpers
│   └── core
│       ├── alert.js
│       ├── image.js
│       ├── inview.js
│       └── page.js
├── layouts
│   ├── README.md
│   ├── default.vue
│   └── error.vue
├── middleware
│   ├── README.md
│   └── auth.js
├── nuxt.config.js
├── package.json
├── pages
│   ├── README.md
│   ├── auth
│   │   ├── credentials.vue
│   │   ├── login.vue
│   │   ├── register.vue
│   │   └── reset
│   │       └── _salt.vue
│   ├── index.vue
│   └── user
│       ├── profile
│       │   ├── _username.vue
│       │   └── index.vue
│       └── settings.vue
├── plugins
│   └── README.md
└── store
    ├── README.md
    ├── app.js
    ├── contents.js
    ├── event.js
    └── index.js
```