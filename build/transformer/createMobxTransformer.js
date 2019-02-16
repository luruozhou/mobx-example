let ts = require('typescript')

const defaultOptions = {
  bindings: ['mStore', 'mAction']
}

const createTransformer = (options = defaultOptions) => {
  const transformer = context => {
    const bindings = []

    let fileName, pageName

    const visitor = node => {
      if (ts.isSourceFile(node)) {
        ;[pageName, fileName] = getFileNameFrom(node.fileName)
        return ts.visitEachChild(node, visitor, context)
      }

      if (ts.isImportDeclaration(node)) {
        node.forEachChild(importChild => {
          if (
            ts.isImportClause(importChild) &&
            importChild.namedBindings &&
            ts.isNamedImports(importChild.namedBindings)
          ) {
            importChild.namedBindings.elements.forEach(
              ({ propertyName, name }) => {
                // import {mStore as otherName} from './store.js'
                const lib = node.moduleSpecifier.text // './store.js' 暂时没用到
                const namedBinding =
                  (propertyName && propertyName.getText()) || name.getText() // mStore
                const aliasBinding = propertyName && name.getText() //otherName
                if (options.bindings.indexOf(namedBinding) > -1) {
                  bindings.push(aliasBinding || namedBinding)
                }
              }
            )
          }
        })

        return node
      }

      if (node.decorators) {
        node.decorators.forEach(decorator => {
          const { expression } = decorator
          if (
            ts.isIdentifier(expression) &&
            bindings.indexOf(expression.getText()) > -1
          ) {
            // 调用形式 @mStore  @mAction
            decorator.expression = ts.createCall(expression, undefined, [
              ts.createObjectLiteral([
                ts.createPropertyAssignment(
                  ts.createLiteral('page'),
                  ts.createLiteral(`${pageName}`)
                ),
                ts.createPropertyAssignment(
                  ts.createLiteral('name'),
                  ts.createLiteral(`${fileName}`)
                )
              ])
            ])
          } else if (
            ts.isCallExpression(expression) &&
            ts.isIdentifier(expression.expression) &&
            bindings.indexOf(expression.expression.getText()) > -1
          ) {
            // 调用形式 @mStore({...someProps})  @mAction({...someProps})
            let arg0 = expression.arguments[0]
            if (ts.isObjectLiteralExpression(arg0)) {
              decorator.expression = ts.createCall(
                expression.expression,
                undefined,
                [
                  ts.createObjectLiteral([
                    ts.createPropertyAssignment(
                      ts.createLiteral('page'),
                      ts.createLiteral(`${pageName}`)
                    ),
                    ts.createPropertyAssignment(
                      ts.createLiteral('name'),
                      ts.createLiteral(`${fileName}`)
                    ),
                    ...arg0.properties
                  ]),
                  ...expression.arguments.slice(1)
                ]
              )
            }
          }
        })

        return node
      }

      return ts.visitEachChild(node, visitor, context)
    }

    return node => ts.visitNode(node, visitor)
  }

  return transformer
}

function getFileNameFrom(path) {
  let reg = /([^\/]+)\/(?:actions|stores)\/(.+)\.(?:t|j)sx?$/
  let matched = path.match(reg)
  let pageName = matched && matched[1]
  let fileName = matched && matched[2]
  return [pageName, fileName]
}

module.exports = createTransformer
