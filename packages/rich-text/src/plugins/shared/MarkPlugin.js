import isHotkey from 'is-hotkey';
import markDecorator from './MarkDecorator';
import { haveMarks } from './UtilHave';
import { css } from 'emotion';
import tokens from '@contentful/forma-36-tokens';

const styles = {
  // TODO: Ensure a bold mark on a headline makes the heading appear even
  //  bolder. Consider to make headings non-bold by default.
  bold: css({
    color: 'inherit',
    fontWeight: tokens.fontWeightDemiBold,
  }),
  italic: css({
    textAlign: 'left',
    lineHeight: 1, // Prevents vertical jitter effect when applying code mark.
  }),
  code: css({
    fontFamily: tokens.fontStackMonospace,
    textAlign: 'center', // Can't use `rem` to account for code inside a heading.
  }),
  underline: css({
    fontFamily: tokens.fontStackMonospace,
    textAlign: 'right', // Can't use `rem` to account for code inside a heading.
  }),
};

export default function ({ type, tagName, hotkey, richTextAPI }) {
  return {
    renderMark: (props, _editor, next) => {
      if (props.mark.type === type) {
        return markDecorator(tagName === 'b' ? tagName : 'div', { className: styles[type] })(props);
      }
      return next();
    },
    onKeyDown(event, editor, next) {
      if (isHotkey(hotkey, event)) {
        editor.toggleMark(type);

        const action = haveMarks(editor, type) ? 'mark' : 'unmark';
        richTextAPI.logShortcutAction(action, { markType: type });
        return;
      }
      return next();
    },
  };
}
