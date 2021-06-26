import {
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { createClassString } from '../utils';

const modalElement = document.getElementById('modal-root') as Element;

export type ModalHandle = { close: () => void; open: () => void };

export default forwardRef<
  ModalHandle,
  { children: ReactNode; defaultOpened?: boolean; fade?: boolean }
>(({ children, defaultOpened = false, fade = false }, ref) => {
  const [isOpen, setIsOpen] = useState(defaultOpened);

  const close = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(
    ref,
    () => ({
      open: () => setIsOpen(true),
      close,
    }),
    [close]
  );

  const handleEscape = useCallback(
    (event) => {
      if (event.keyCode === 27) close();
    },
    [close]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleEscape, false);
    return () => {
      document.removeEventListener('keydown', handleEscape, false);
    };
  }, [handleEscape, isOpen]);

  return createPortal(
    isOpen ? (
      <div
        className={createClassString({
          modal: true,
          'modal-fade': fade,
        })}
      >
        <div className="modal-overlay" onClick={close} />

        <span
          role="button"
          className="modal-close"
          aria-label="close"
          onClick={close}
        >
          x
        </span>

        <div className="modal-body">{children}</div>
      </div>
    ) : null,
    modalElement
  );
});
