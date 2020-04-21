/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Williams Medina @willyelm

  Added pathInfo is:
   Copyright (c) 2020 @BigFly3
*/
'use strict'
const util = require('loader-utils')
const pug = require('pug')
const path = require('path')

module.exports = function (source) {
  let query = {}
  if (this.cacheable) {
    this.cacheable(true)
  }
  if (typeof this.query === 'string') {
    query = util.parseQuery(this.query)
  } else {
    query = this.query
  }

  let req = util.getRemainingRequest(this)
  let options = Object.assign({
    filename: this.resourcePath,
    doctype: query.doctype || 'js',
    compileDebug: this.debug || false
  }, query)
  if (options.plugins){
    if (typeof options.plugins === 'object') {
      options.plugins = [options.plugins];
    }
  }
  let template = pug.compile(source, options)
  template.dependencies.forEach(this.addDependency)
  let data = query.data || {}

  /* Added pathInfo */
  const basePath = query.basePath ? query.basePath : process.env.pwd
  const pugPath = path.relative(basePath,req).replace(/\\/g,'/')
  const htmlPath = pugPath.replace(path.extname(pugPath),'.html')
  data.pathInfo = {
    pug     : pugPath,
    html    : htmlPath,
    dir     : path.dirname(htmlPath),
    basename: path.basename(htmlPath,'.html'),
    htmlname: path.basename(htmlPath),
    pugname : path.basename(pugPath)
  }
  /* /Added pathInfo */

  let htmlStr = ''
  try {
    htmlStr = template(data)
  } catch (e) {
    this.emitError(new Error(`${this.resourcePath}\n${e}`))
  }
  return htmlStr
}