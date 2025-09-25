import { Button, Divider, Group, Modal as MantineModal, ModalProps } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  title?: string;
  onClose: () => void;
  isOpen: boolean;
  children?: ReactNode;
  renderActionButton: () => ReactNode;
  size?: ModalProps['size'];
  trapFocus?: boolean;
  showCloseButton?: boolean;
  centered?: boolean;
};

export const Modal = ({
  title,
  onClose,
  isOpen,
  children,
  renderActionButton,
  size,
  trapFocus = false,
  showCloseButton = true,
  centered,
}: Props) => {

  return (
    <MantineModal.Root
      size={size}
      onClose={onClose}
      opened={isOpen}
      trapFocus={trapFocus}
      centered={centered}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <MantineModal.Overlay backgroundOpacity={0.4} />
      <MantineModal.Content>
        {title ? (
          <>
            <MantineModal.Header>
              <MantineModal.Title className="font-semibold text-base">{title}</MantineModal.Title>
            </MantineModal.Header>
            <Divider color="gray.2" />
          </>
        ) : null}
        <MantineModal.Body>
          <div className="py-4">{children}</div>
          <Group justify="flex-end">
            {/* {showCloseButton && (
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  onClose();
                }}
                variant="outline"
              >
                {('Cancel')}
              </Button>
            )} */}
            {renderActionButton()}
          </Group>
        </MantineModal.Body>
      </MantineModal.Content>
    </MantineModal.Root>
  );
};
