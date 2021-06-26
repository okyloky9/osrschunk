import { ChangeEventHandler, ReactNode } from 'react';

const ToggleSwitch: React.FC<{
  checked?: boolean;
  children: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ checked, children, onChange }) => {
  return (
    <label className="toggle-switch">
      <input checked={checked} type="checkbox" onChange={onChange} />
      <i />
      <span>{children}</span>
    </label>
  );
};

export default ToggleSwitch;
