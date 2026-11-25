window.__ModuleLoader__.load({
  id: 'dsh-session-panel-centering',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const ID = 'dsh-session-panel-centering';

    // DSH centers the transcript in the full viewport and reserves a minimum
    // end gutter. Padding the scrollport by that reserve re-centers the
    // column in the space left of the docked Session panel.
    const CSS = `
      [data-conversation-content] {
        --dsh-chat-end-inset: var(--dsh-chat-end-reserve, 0px) !important;
      }
    `;

    function CenterStyle() {
      return h('style', { id: ID }, CSS);
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            { name: 'conversation.composer.dock', id: 'session-panel-centering', order: -1 },
            CenterStyle,
          ),
        );
      },
    };
  },
});
