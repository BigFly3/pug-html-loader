# Pug HTML loader for webpack with pathInfo added as local variables 
This is a **【customized version】** of the original `pug-html-loader`.  
Path information can be automatically set as local variables.

If you want to set local meta information for each pug file,
It will be possible by data together with the file path as a JSON key.

## Installation

`npm i -D pug-html-info-loader`

## add options
- **basePath** (optional)    
  Base directory for public path.  
  【 default 】 → node.env.pwd

## added local variables
ex 【 src/baseDir/first/second/page.pug 】 & 【 config.basePath = baseDir's path 】

added pathInfo
- 【 pathInfo.pug 】 → first/second/page.pug
- 【 pathInfo.html 】 → first/second/page.html
- 【 pathInfo.dir 】 → first/second/
- 【 pathInfo.parent 】 → second
- 【 pathInfo.basename 】 → page
- 【 pathInfo.htmlname 】 → page.html
- 【 pathInfo.pugname 】 → page.pug

If **config.basePath** is not set, it will be the path from **node.env.pwd**.  

added pathInfo
- 【 pathInfo.pug  】 → src/baseDir/first/second/page.pug
- 【 pathInfo.html 】 → src/baseDir/first/second/page.html
- 【 pathInfo.dir  】 → src/baseDir/first/second/


## meta data example

**meta.json**
```json
{
  "global": {
    "title": "global title",
    "description": "global description",
    "keywords": "global keywords",
    "og_url": "global og_url",
    "og_title": "global og_title",
    "og_image": "global og_image",
    "og_description": "global og_description",
    "bodyClass": "global bodyClass"
  },
  "local": {
    "path/to/page1.html": {
      "title": "Page1 title",
      "description": "Page1 description",
      "keywords": "Page1 keywords",
      "og_url": "Page1 og_url",
      "og_title": "Page1 og_title",
      "og_image": "Page1 og_image",
      "og_description": "Page1 og_description",
      "bodyClass": "Page1 bodyClass"
    },
    "path/to/page2.html": {
      "title": "Page2 title",
      "description": "Page2 description",
      "keywords": "Page2 keywords",
      "og_url": "Page2 og_url",
      "og_title": "Page2 og_title",
      "og_image": "Page2 og_image",
      "og_description": "Page2 og_description",
      "bodyClass": "Page2 bodyClass"
    }
  }
}
```

**webpack.config**

```javascript
const path = require('path')
const metadata = require('./meta.json')

module.exports = {
  // your config settings ...
  module: [{
    // your modules...
    rules: [
      {
      test: /\.pug/,
      use: [
        'html-loader',
        {
          loader: 'pug-html-info-loader',
          options: {
            data: {
              globalConf:metadata['global'],
              localConf :metadata['local']
            }, // set of data to pass to the pug render.
            basePath: path.resolve(__dirname, 'src')
            // base folder path for local variables.
          }
        }
      ]
    }]
  }]
};
```

**localfile.pug**  
```
- var config = localConf[pathInfo.html] ? localConf[pathInfo.html] : globalConf;
head
  title=config.title
  meta(name='description', content=config.description)
  meta(name='keywords', content=config.keywords)

  meta(property='og:title', content=config.og_title)
  meta(property='og:description', content=config.og_description)
  meta(property='og:url', content=config.og_url)
  meta(property='og:image', content=config.og_image)

body(class=config.bodyClass)

  p this page path → #{pathiInfo.html} 
```
ex 
- 【 path/to/page1.pug 】 → config.title = page1.title 
- 【 path/to/page3.pug 】 → config.title = global.title 



## License

MIT (http://www.opensource.org/licenses/mit-license.php)
