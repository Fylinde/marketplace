import React, { cloneElement, Fragment, ReactElement, useState } from "react";
import Modal from "../modal/Modal";
import AccountSection from "../../components/sessions/AccountSection";

export interface AccountSectionDialogProps {
  handle: ReactElement;
}

const AccountSectionDialog: React.FC<AccountSectionDialogProps> = ({ handle }) => {
  const [open, setOpen] = useState(false);

  const toggleDialog = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      {cloneElement(handle, { onClick: toggleDialog })}

      <Modal open={open} onClose={toggleDialog}>
        <AccountSection />
      </Modal>
    </Fragment>
  );
};

export default AccountSectionDialog;
