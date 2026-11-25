// The centering fix is the CSS rule injected into the conversation composer
// dock. A wrong variable name, a missing !important, or the wrong slot
// reintroduces the start-edge pinning described in README.md. This test drives
// the same module-loader boundary DSH uses, so it needs no production seam.
import assert from 'node:assert/strict'
import test from 'node:test'

let moduleDefinition
globalThis.window = {
  __ModuleLoader__: {
    load(definition) {
      moduleDefinition = definition
    },
  },
}

await import('../client.js')

test('injects the centering style into the conversation composer dock', () => {
  assert.ok(moduleDefinition)
  assert.equal(moduleDefinition.id, 'dsh-session-panel-centering')

  const React = {
    createElement(type, props, children) {
      return { type, props: { ...props, children } }
    },
  }
  const plugin = moduleDefinition.factory((name) => {
    assert.equal(name, 'react')
    return React
  })
  assert.ok(plugin.inject.includes('slots'))

  const injectedSlots = []
  const registrations = []
  plugin.apply({
    slots: {
      inject(slotName, register) {
        injectedSlots.push(slotName)
        register()
      },
      register(meta, component) {
        registrations.push({ meta, component })
      },
    },
  })

  assert.deepEqual(injectedSlots, ['conversation.composer.dock'])
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].meta.name, 'conversation.composer.dock')
  assert.equal(registrations[0].meta.id, 'session-panel-centering')
  assert.equal(registrations[0].meta.order, -1)

  const style = registrations[0].component()
  assert.equal(style.type, 'style')
  assert.equal(style.props.id, 'dsh-session-panel-centering')
  assert.match(style.props.children, /\[data-conversation-content\]/)
  assert.match(
    style.props.children,
    /--dsh-chat-end-inset:\s*var\(--dsh-chat-end-reserve,\s*0px\)\s*!important/,
  )
})
