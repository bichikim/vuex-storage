const tsNode = require('ts-node')
tsNode.register({
  project: 'tsconfig.node.json',
})
global.expect = require('chai').expect
