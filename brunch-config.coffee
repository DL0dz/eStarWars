module.exports = config:
  modules:
    definition: false
    wrapper: false


  files:
    javascripts:
      joinTo:
        'app.js': /^app\/javascripts\//

    stylesheets:
      joinTo:
        'app.css':'app/stylesheets/main.sass'

    templates:
      joinTo:
        'template.js': /^app\/views\//


  overrides:
    production:
      optimize: true
      sourceMaps: false
      plugins: autoReload: enabled: false


  paths:
    watched: ['app']


  plugins:
    sass:
      'allowCache': true
    postcss:
      'processors': [ require('autoprefixer')([ 'last 8 versions' ]) ]
    autoReload:
      'enabled':
        'css': 'on'
        'js': 'on'
        'assets': 'on'
    uglify:
      ignored: /non_minimize\.js/


  server:
    path: 'application.js'
