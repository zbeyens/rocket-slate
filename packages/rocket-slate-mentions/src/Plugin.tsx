import React from 'react';
import ReactDOM from 'react-dom';
import { MentionPlugin, withMention, MENTION } from 'slate-plugins-next';
import { IRocketSlatePlugin } from '@rocket-slate/core/Editor';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';

const MENTION_ON_CHANGE = new WeakMap();
const MENTION_ON_KEYDOWN = new WeakMap();

const RocketSlateMentionElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const focused = useFocused();
  return (
    <span
      {...attributes}
      data-slate-type={MENTION}
      contentEditable={false}
      style={{
        padding: '3px 3px 2px',
        margin: '0 1px',
        verticalAlign: 'middle',
        display: 'inline-block',
        borderRadius: '4px',
        backgroundColor: '#eee',
        boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
      }}
    >
      {element.character.text}
      {children}
    </span>
  );
};

const RocketSlateMentionPlugin = <T extends RenderElementProps>(options?: {
  component?: React.ComponentType<T>;
}): IRocketSlatePlugin => {
  return {
    plugin: {
      ...MentionPlugin({
        component: RocketSlateMentionElement,
        ...options,
      }),
      onKeyDown: (e, editor) => {
        const onKeyDownMention = MENTION_ON_KEYDOWN.get(editor);
        if (onKeyDownMention) {
          onKeyDownMention(e, editor);
        }
      },
    },
    withPlugin: (editor) => {
      const { onChange } = editor;
      editor.onChange = () => {
        onChange();
        ReactDOM.unstable_batchedUpdates(() => {
          const onChangeMention = MENTION_ON_CHANGE.get(editor);
          if (onChangeMention) {
            onChangeMention();
          }
        });
      };
      return withMention(editor);
    },
  };
};

export { RocketSlateMentionPlugin, MENTION_ON_CHANGE, MENTION_ON_KEYDOWN };
