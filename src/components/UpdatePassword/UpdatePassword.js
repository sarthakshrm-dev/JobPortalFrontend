import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import ChangePassWord from "../ChangePassWord/ChangePassWord";

export default function UpdatePassword({ navigate }) {

  return (
    <div>
      <Tabs id="controlled-tab" className="mb-3">
        <Tab eventKey="password" title="Change Password">
          <ChangePassWord navigate={navigate} />
        </Tab>
      </Tabs>
    </div>
  );
}
