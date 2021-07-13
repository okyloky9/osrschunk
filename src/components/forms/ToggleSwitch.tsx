import { ChangeEventHandler, ReactNode, useRef } from 'react';

const ToggleSwitch: React.FC<{
  checked?: boolean;
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ checked, children, onChange }) => {
  const input = useRef<HTMLInputElement>(null);

  return (
    <label
      className="toggle-switch"
      onKeyUp={(e) => {
        const keyCode = e.which || e.keyCode;

        // if spacebar or enter are pressed
        if ([13, 32].includes(keyCode)) {
          input.current?.click();
        }
      }}
      tabIndex={0}
    >
      <input
        checked={checked}
        type="checkbox"
        onChange={onChange}
        ref={input}
      />
      <i />
      <span>{children}</span>
    </label>
  );
};

export default ToggleSwitch;
